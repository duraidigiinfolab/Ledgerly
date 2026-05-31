import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const lineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(0).default(1),
  rate: z.number().min(0).default(0),
  amount: z.number().min(0).default(0),
});

const createInvoiceSchema = z.object({
  clientId: z.string().min(1),
  invoiceNumber: z.string().min(1),
  issueDate: z.string(),
  dueDate: z.string(),
  status: z.enum(["DRAFT", "SENT", "PAID"]).default("DRAFT"),
  notes: z.string().optional(),
  taxRate: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      include: {
        client: true,
        lineItems: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createInvoiceSchema.parse(body);

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        clientId: validated.clientId,
        invoiceNumber: validated.invoiceNumber,
        issueDate: new Date(validated.issueDate),
        dueDate: new Date(validated.dueDate),
        status: validated.status,
        notes: validated.notes,
        taxRate: validated.taxRate,
        discount: validated.discount,
        lineItems: {
          create: validated.lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.quantity * item.rate,
          })),
        },
      },
      include: {
        client: true,
        lineItems: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

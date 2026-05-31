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

const updateInvoiceSchema = z.object({
  clientId: z.string().min(1),
  invoiceNumber: z.string().min(1),
  issueDate: z.string(),
  dueDate: z.string(),
  status: z.enum(["DRAFT", "SENT", "PAID"]).optional(),
  notes: z.string().optional(),
  taxRate: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  discountType: z.enum(["FLAT", "PERCENTAGE"]).default("FLAT"),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
      include: {
        client: true,
        lineItems: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateInvoiceSchema.parse(body);

    const existing = await prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const invoice = await prisma.$transaction(async (tx) => {
      await tx.lineItem.deleteMany({ where: { invoiceId: id } });

      return tx.invoice.update({
        where: { id },
        data: {
          clientId: validated.clientId,
          invoiceNumber: validated.invoiceNumber,
          issueDate: new Date(validated.issueDate),
          dueDate: new Date(validated.dueDate),
          status: validated.status,
          notes: validated.notes,
          taxRate: validated.taxRate,
          discount: validated.discount,
          discountType: validated.discountType,
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
    });

    return NextResponse.json(invoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    await prisma.invoice.delete({ where: { id } });

    return NextResponse.json({ message: "Invoice deleted" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["DRAFT", "SENT", "PAID"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const existing = await prisma.invoice.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: { client: true, lineItems: true },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

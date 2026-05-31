import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditInvoiceClient } from "./edit-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Invoice",
  description: "Edit your invoice details, line items, and export as PDF.",
};

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { client: true, lineItems: true },
  });

  if (!invoice) redirect("/dashboard");

  const serialized = {
    id: invoice.id,
    clientId: invoice.clientId,
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate.toISOString().split("T")[0],
    dueDate: invoice.dueDate.toISOString().split("T")[0],
    status: invoice.status,
    notes: invoice.notes || "",
    taxRate: invoice.taxRate,
    discount: invoice.discount,
    discountType: invoice.discountType,
    lineItems: invoice.lineItems.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
    })),
    client: invoice.client
      ? {
          id: invoice.client.id,
          name: invoice.client.name,
          email: invoice.client.email,
          address: invoice.client.address,
          phone: invoice.client.phone,
        }
      : undefined,
  };

  return <EditInvoiceClient invoiceId={id} initialData={serialized} />;
}

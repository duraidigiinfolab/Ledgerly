import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/summary-cards";
import { InvoiceTable } from "@/components/invoice-table";
import { Plus } from "lucide-react";
import { safeNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View and manage all your invoices from the Ledgerly dashboard. Track payments, revenue, and invoice status.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [invoices, user] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: session.user.id },
      include: { client: true, lineItems: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { currency: true },
    }),
  ]);

  const currency = user?.currency || "USD";

  const getTotal = (inv: typeof invoices[0]) => {
    const subtotal = inv.lineItems.reduce(
      (sum, item) => sum + safeNumber(item.quantity) * safeNumber(item.rate),
      0
    );
    const tax = subtotal * (safeNumber(inv.taxRate) / 100);
    return subtotal + tax - safeNumber(inv.discount);
  };

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === "DRAFT").length,
    sent: invoices.filter((i) => i.status === "SENT").length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    revenue: invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, inv) => sum + getTotal(inv), 0),
  };

  const serializedInvoices = invoices.map((inv) => ({
    ...inv,
    issueDate: inv.issueDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
    updatedAt: inv.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your invoices and track payments
          </p>
        </div>
        <Link href="/invoices/new">
          <Button size="lg" className="shadow-md">
            <Plus className="h-5 w-5" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <SummaryCards {...stats} currency={currency} />

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Invoices
          </h2>
        </div>
        <div className="p-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <InvoiceTable invoices={serializedInvoices as any} currency={currency} />
        </div>
      </div>
    </div>
  );
}

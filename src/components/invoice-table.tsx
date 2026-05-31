"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  CheckCircle2,
  ArrowUpDown,
  FileText,
} from "lucide-react";
import { formatCurrency, safeNumber } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: "DRAFT" | "SENT" | "PAID";
  taxRate: number;
  discount: number;
  client: { id: string; name: string };
  lineItems: { quantity: number; rate: number; amount: number }[];
}

interface InvoiceTableProps {
  invoices: Invoice[];
  currency: string;
}

type SortField = "invoiceNumber" | "clientName" | "issueDate" | "total" | "status";
type SortDir = "asc" | "desc";

const statusConfig = {
  DRAFT: { label: "Draft", variant: "secondary" as const },
  SENT: { label: "Sent", variant: "default" as const },
  PAID: { label: "Paid", variant: "success" as const },
};

export function InvoiceTable({ invoices: initialInvoices, currency }: InvoiceTableProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [sortField, setSortField] = useState<SortField>("issueDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const getTotal = (inv: Invoice) => {
    const subtotal = inv.lineItems.reduce(
      (sum, item) => sum + safeNumber(item.quantity) * safeNumber(item.rate),
      0
    );
    const tax = subtotal * (safeNumber(inv.taxRate) / 100);
    return subtotal + tax - safeNumber(inv.discount);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...invoices].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "invoiceNumber":
        return a.invoiceNumber.localeCompare(b.invoiceNumber) * dir;
      case "clientName":
        return a.client.name.localeCompare(b.client.name) * dir;
      case "issueDate":
        return (new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()) * dir;
      case "total":
        return (getTotal(a) - getTotal(b)) * dir;
      case "status":
        return a.status.localeCompare(b.status) * dir;
      default:
        return 0;
    }
  });

  const handleStatusUpdate = async (id: string, status: "DRAFT" | "SENT" | "PAID") => {
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
        );
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No invoices yet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Create your first invoice to get started.
        </p>
        <Button
          onClick={() => router.push("/invoices/new")}
          className="mt-4"
        >
          Create Invoice
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-4 py-3 text-left">
              <SortButton field="invoiceNumber">Invoice #</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="clientName">Client</SortButton>
            </th>
            <th className="px-4 py-3 text-left hidden sm:table-cell">
              <SortButton field="issueDate">Date</SortButton>
            </th>
            <th className="px-4 py-3 text-right">
              <SortButton field="total">Total</SortButton>
            </th>
            <th className="px-4 py-3 text-center">
              <SortButton field="status">Status</SortButton>
            </th>
            <th className="px-4 py-3 text-right w-12"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((invoice) => (
            <tr
              key={invoice.id}
              className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
            >
              <td className="px-4 py-3">
                <span className="font-medium text-slate-900">
                  {invoice.invoiceNumber}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {invoice.client.name}
              </td>
              <td className="px-4 py-3 text-sm text-slate-500 hidden sm:table-cell">
                {new Date(invoice.issueDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="font-semibold text-slate-900">
                  {formatCurrency(getTotal(invoice), currency)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <Badge variant={statusConfig[invoice.status].variant}>
                  {statusConfig[invoice.status].label}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {invoice.status !== "SENT" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(invoice.id, "SENT")}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Mark as Sent
                      </DropdownMenuItem>
                    )}
                    {invoice.status !== "PAID" && (
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(invoice.id, "PAID")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Paid
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

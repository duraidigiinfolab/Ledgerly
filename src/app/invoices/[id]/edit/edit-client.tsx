"use client";

import { Sidebar } from "@/components/sidebar";
import { InvoiceEditor } from "@/components/invoice-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditInvoiceClientProps {
  invoiceId: string;
  initialData: {
    clientId: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: string;
    notes: string;
    taxRate: number;
    discount: number;
    lineItems: {
      id: string;
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }[];
    client?: {
      id: string;
      name: string;
      email?: string | null;
      address?: string | null;
      phone?: string | null;
    };
  };
}

export function EditInvoiceClient({ invoiceId, initialData }: EditInvoiceClientProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-300">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-fade-in">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Invoice{" "}
              <span className="text-indigo-600">
                {initialData.invoiceNumber}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Update invoice details and preview changes in real-time
            </p>
          </div>

          <InvoiceEditor invoiceId={invoiceId} initialData={initialData} />
        </div>
      </main>
    </div>
  );
}

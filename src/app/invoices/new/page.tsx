"use client";

import { Sidebar } from "@/components/sidebar";
import { InvoiceEditor } from "@/components/invoice-editor";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewInvoicePage() {
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
              Create New Invoice
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Fill in the details and preview your invoice in real-time
            </p>
          </div>

          <InvoiceEditor />
        </div>
      </main>
    </div>
  );
}

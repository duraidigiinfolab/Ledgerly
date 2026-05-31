"use client";

import { forwardRef } from "react";
import { formatCurrency, safeNumber } from "@/lib/utils";
import type { LineItem, ClientData, UserProfile } from "@/components/invoice-editor";

interface InvoicePreviewProps {
  userProfile: UserProfile | null;
  client: ClientData | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes: string;
  currency: string;
  invoiceFooter?: string | null;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  (
    {
      userProfile,
      client,
      invoiceNumber,
      issueDate,
      dueDate,
      lineItems,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      notes,
      currency,
      invoiceFooter,
    },
    ref
  ) => {
    const formatDate = (dateStr: string) => {
      if (!dateStr) return "";
      try {
        return new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch {
        return dateStr;
      }
    };

    const fmt = (amount: number) => formatCurrency(amount, currency);

    return (
      <div
        ref={ref}
        className="bg-white rounded-lg shadow-lg p-8 min-h-[800px]"
        style={{
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          maxWidth: "210mm",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {userProfile?.logoUrl && (
              <img
                src={userProfile.logoUrl}
                alt="Business Logo"
                className="h-16 w-auto mb-3 object-contain"
              />
            )}
            <h1 className="text-2xl font-bold text-slate-900">
              {userProfile?.businessName || "Your Business"}
            </h1>
            {userProfile?.businessAddress && (
              <p className="text-sm text-slate-500 mt-1 whitespace-pre-line">
                {userProfile.businessAddress}
              </p>
            )}
            {userProfile?.businessEmail && (
              <p className="text-sm text-slate-500">{userProfile.businessEmail}</p>
            )}
            {userProfile?.businessPhone && (
              <p className="text-sm text-slate-500">{userProfile.businessPhone}</p>
            )}
            {userProfile?.taxId && (
              <p className="text-sm text-slate-500">Tax ID: {userProfile.taxId}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-indigo-600 tracking-tight">
              INVOICE
            </h2>
            <p className="text-lg font-semibold text-slate-700 mt-1">
              {invoiceNumber || "---"}
            </p>
          </div>
        </div>

        {/* Client & Dates */}
        <div className="flex justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Bill To
            </p>
            {client ? (
              <>
                <p className="font-semibold text-slate-900">{client.name}</p>
                {client.email && (
                  <p className="text-sm text-slate-500">{client.email}</p>
                )}
                {client.address && (
                  <p className="text-sm text-slate-500 whitespace-pre-line">
                    {client.address}
                  </p>
                )}
                {client.phone && (
                  <p className="text-sm text-slate-500">{client.phone}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400 italic">No client selected</p>
            )}
          </div>
          <div className="text-right">
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Issue Date
              </p>
              <p className="text-sm font-medium text-slate-700">
                {formatDate(issueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Due Date
              </p>
              <p className="text-sm font-medium text-slate-700">
                {formatDate(dueDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Description
              </th>
              <th className="text-right py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-20">
                Qty
              </th>
              <th className="text-right py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">
                Rate
              </th>
              <th className="text-right py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems
              .filter((item) => item.description.trim())
              .map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-slate-100"
                >
                  <td className="py-3 text-sm text-slate-700">
                    {item.description}
                  </td>
                  <td className="py-3 text-sm text-slate-700 text-right">
                    {safeNumber(item.quantity)}
                  </td>
                  <td className="py-3 text-sm text-slate-700 text-right">
                    {fmt(safeNumber(item.rate))}
                  </td>
                  <td className="py-3 text-sm font-medium text-slate-900 text-right">
                    {fmt(safeNumber(item.quantity) * safeNumber(item.rate))}
                  </td>
                </tr>
              ))}
            {lineItems.filter((item) => item.description.trim()).length ===
              0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-sm text-slate-400 italic"
                >
                  No items added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium text-slate-700">{fmt(subtotal)}</span>
            </div>
            {safeNumber(taxRate) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax ({safeNumber(taxRate)}%)</span>
                <span className="font-medium text-slate-700">
                  {fmt(taxAmount)}
                </span>
              </div>
            )}
            {safeNumber(discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount</span>
                <span className="font-medium text-red-600">
                  -{fmt(safeNumber(discount))}
                </span>
              </div>
            )}
            <div className="border-t-2 border-slate-900 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-indigo-600">
                  {fmt(Math.max(0, total))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Notes
            </p>
            <p className="text-sm text-slate-600 whitespace-pre-line">{notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          {invoiceFooter ? (
            <p className="text-xs text-slate-500 whitespace-pre-line">
              {invoiceFooter}
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Thank you for your business!
            </p>
          )}
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";

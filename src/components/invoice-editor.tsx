"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ClientSelector } from "@/components/client-selector";
import { LineItemsEditor } from "@/components/line-items-editor";
import { InvoicePreview } from "@/components/invoice-preview";
import { exportToPdf } from "@/lib/pdf-export";
import { generateInvoiceNumber, safeNumber } from "@/lib/utils";
import { Save, Download, Send, Loader2 } from "lucide-react";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ClientData {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface UserProfile {
  id: string;
  name?: string | null;
  email: string;
  businessName?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
  businessAddress?: string | null;
  taxId?: string | null;
  currency: string;
  logoUrl?: string | null;
}

interface InvoiceEditorProps {
  invoiceId?: string;
  initialData?: {
    clientId: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: string;
    notes: string;
    taxRate: number;
    discount: number;
    discountType?: string;
    lineItems: LineItem[];
    client?: ClientData;
  };
}

export function InvoiceEditor({ invoiceId, initialData }: InvoiceEditorProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const previewRef = useRef<HTMLDivElement>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(
    initialData?.client || null
  );
  const [invoiceNumber, setInvoiceNumber] = useState(initialData?.invoiceNumber || "");
  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(() =>
    initialData?.dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData?.lineItems || [
      { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0, amount: 0 },
    ]
  );
  const [taxRate, setTaxRate] = useState(initialData?.taxRate || 0);
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [discountType, setDiscountType] = useState(initialData?.discountType || "FLAT");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Calculations
  const subtotal = lineItems.reduce(
    (sum, item) => sum + safeNumber(item.quantity) * safeNumber(item.rate),
    0
  );
  const taxAmount = subtotal * (safeNumber(taxRate) / 100);
  const discountAmount =
    discountType === "PERCENTAGE"
      ? subtotal * (safeNumber(discount) / 100)
      : safeNumber(discount);
  const total = subtotal + taxAmount - discountAmount;

  // Fetch user profile
  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUserProfile)
      .catch(console.error);
  }, []);

  // Fetch clients
  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients)
      .catch(console.error);
  }, []);

  // Generate invoice number
  useEffect(() => {
    if (!invoiceId && userProfile) {
      fetch("/api/invoices/next-number")
        .then((r) => r.json())
        .then((data) => {
          const number = generateInvoiceNumber(
            data.businessName || "INV",
            data.nextNumber - 1
          );
          setInvoiceNumber(number);
        })
        .catch(console.error);
    }
  }, [invoiceId, userProfile]);

  const handleClientCreated = useCallback((client: ClientData) => {
    setClients((prev) => [...prev, client]);
    setSelectedClient(client);
  }, []);

  const handleSave = async (status: "DRAFT" | "SENT" = "DRAFT") => {
    if (!selectedClient) {
      alert("Please select a client");
      return;
    }
    if (lineItems.every((item) => !item.description.trim())) {
      alert("Please add at least one line item");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        clientId: selectedClient.id,
        invoiceNumber,
        issueDate,
        dueDate,
        status,
        notes,
        taxRate: safeNumber(taxRate),
        discount: safeNumber(discount),
        discountType,
        lineItems: lineItems
          .filter((item) => item.description.trim())
          .map((item) => ({
            description: item.description,
            quantity: safeNumber(item.quantity),
            rate: safeNumber(item.rate),
            amount: safeNumber(item.quantity) * safeNumber(item.rate),
          })),
      };

      const url = invoiceId ? `/api/invoices/${invoiceId}` : "/api/invoices";
      const method = invoiceId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save invoice");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save invoice");
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      await exportToPdf(previewRef.current, invoiceNumber || "invoice");
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  const currency = userProfile?.currency || "USD";

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Column - Editor */}
      <div className="lg:w-1/2 space-y-6 overflow-y-auto">
        {/* Invoice Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Invoice Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-000001"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* Client Selection */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Client</h2>
          <ClientSelector
            clients={clients}
            selectedClient={selectedClient}
            onSelect={setSelectedClient}
            onClientCreated={handleClientCreated}
          />
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Line Items
          </h2>
          <LineItemsEditor
            items={lineItems}
            onChange={setLineItems}
            currency={currency}
          />
        </div>

        {/* Tax, Discount, Notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                value={taxRate}
                onChange={(e) => setTaxRate(safeNumber(e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(safeNumber(e.target.value))}
                  className="flex-1"
                />
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-20 rounded-md border border-slate-200 bg-white px-2 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="FLAT">Amt</option>
                  <option value="PERCENTAGE">%</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="notes">Notes / Terms</Label>
            <Textarea
              id="notes"
              placeholder="Payment terms, thank you message, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pb-6">
          <Button
            onClick={() => handleSave("DRAFT")}
            disabled={saving}
            variant="outline"
            className="flex-1 min-w-[140px]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSave("SENT")}
            disabled={saving}
            className="flex-1 min-w-[140px]"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Save & Send
          </Button>
          <Button
            onClick={handleExportPdf}
            disabled={exporting}
            variant="secondary"
            className="flex-1 min-w-[140px]"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Right Column - Live Preview */}
      <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="bg-slate-100 rounded-xl p-6 min-h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Live Preview
            </h2>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <InvoicePreview
            ref={previewRef}
            userProfile={userProfile}
            client={selectedClient}
            invoiceNumber={invoiceNumber}
            issueDate={issueDate}
            dueDate={dueDate}
            lineItems={lineItems}
            subtotal={subtotal}
            taxRate={taxRate}
            taxAmount={taxAmount}
            discount={discountAmount}
            total={total}
            notes={notes}
            currency={currency}
          />
        </div>
      </div>
    </div>
  );
}

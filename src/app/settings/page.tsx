"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Building2, Upload } from "lucide-react";

const currencies = [
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "CAD", name: "Canadian Dollar (C$)" },
  { code: "AUD", name: "Australian Dollar (A$)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
  { code: "CNY", name: "Chinese Yuan (¥)" },
  { code: "SGD", name: "Singapore Dollar (S$)" },
  { code: "CHF", name: "Swiss Franc (CHF)" },
  { code: "MXN", name: "Mexican Peso (MX$)" },
  { code: "BRL", name: "Brazilian Real (R$)" },
  { code: "AED", name: "UAE Dirham (د.إ)" },
  { code: "SAR", name: "Saudi Riyal (﷼)" },
  { code: "ZAR", name: "South African Rand (R)" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [logoUrl, setLogoUrl] = useState("");
  const [invoiceFooter, setInvoiceFooter] = useState("");

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((user) => {
        setName(user.name || "");
        setBusinessName(user.businessName || "");
        setBusinessEmail(user.businessEmail || "");
        setBusinessPhone(user.businessPhone || "");
        setBusinessAddress(user.businessAddress || "");
        setTaxId(user.taxId || "");
        setCurrency(user.currency || "USD");
        setLogoUrl(user.logoUrl || "");
        setInvoiceFooter(user.invoiceFooter || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          businessName,
          businessEmail,
          businessPhone,
          businessAddress,
          taxId,
          currency,
          logoUrl,
          invoiceFooter,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />
        <main className="pl-[260px]">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="pl-[260px] transition-all duration-300">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your business details and preferences
            </p>
          </div>

          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Personal Information
            </h2>
            <div>
              <Label htmlFor="settings-name">Full Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 max-w-md"
              />
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">
                Business Details
              </h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              This information appears on your invoices.
            </p>

            {/* Logo */}
            <div className="mb-6">
              <Label>Business Logo</Label>
              <div className="mt-2 flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative">
                    <img
                      src={logoUrl}
                      alt="Business logo"
                      className="h-16 w-auto rounded-lg border border-slate-200 object-contain bg-white p-1"
                    />
                    <button
                      onClick={() => setLogoUrl("")}
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex h-16 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-5 w-5" />
                      <span className="text-xs mt-1">Upload</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG or SVG. Max 2MB.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="biz-name">Business Name</Label>
                <Input
                  id="biz-name"
                  placeholder="Your Company Inc."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="biz-email">Business Email</Label>
                <Input
                  id="biz-email"
                  type="email"
                  placeholder="billing@company.com"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="biz-phone">Business Phone</Label>
                <Input
                  id="biz-phone"
                  placeholder="+1 (555) 000-0000"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="biz-taxid">Tax ID / GST Number</Label>
                <Input
                  id="biz-taxid"
                  placeholder="XX-XXXXXXX"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="biz-address">Business Address</Label>
                <Textarea
                  id="biz-address"
                  placeholder="123 Main Street&#10;City, State ZIP"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="biz-footer">Invoice Footer</Label>
                <Textarea
                  id="biz-footer"
                  placeholder="Thank you for your business! Payment is due within 30 days."
                  value={invoiceFooter}
                  onChange={(e) => setInvoiceFooter(e.target.value)}
                  className="mt-1.5"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Currency
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Select the default currency for your invoices.
            </p>
            <div className="max-w-xs">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="shadow-md"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            {success && (
              <span className="text-sm text-emerald-600 font-medium animate-fade-in">
                ✓ Changes saved successfully
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

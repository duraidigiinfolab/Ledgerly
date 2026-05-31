import Link from "next/link";
import type { Metadata } from "next";
import {
  Receipt,
  FileText,
  Users,
  Download,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ledgerly — Professional Invoice Generator for Freelancers & Small Businesses",
  description:
    "Generate professional invoices with live preview, manage clients, and export PDFs instantly. Free invoice generator for freelancers and small businesses.",
};

const features = [
  {
    icon: Zap,
    title: "Live Preview",
    description:
      "See your invoice update in real-time as you type. No more guessing how it'll look.",
  },
  {
    icon: FileText,
    title: "PDF Export",
    description:
      "Download clean, professional A4 invoices as PDF with one click.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Save client details and reuse them across invoices effortlessly.",
  },
  {
    icon: Download,
    title: "Auto-Calculations",
    description:
      "Subtotals, taxes, and discounts calculated automatically. Zero errors.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data stays yours. Secure authentication and encrypted storage.",
  },
  {
    icon: CheckCircle2,
    title: "Status Tracking",
    description:
      "Track invoice status from Draft to Sent to Paid at a glance.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ledgerly
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Free &amp; Open Source Invoice Generator
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Create{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Beautiful Invoices
            </span>{" "}
            in Seconds
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop wasting time with spreadsheets. Ledgerly lets you create
            professional invoices with a live preview, manage clients, and
            export to PDF — all from one clean dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Creating Invoices
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-8 py-3.5 text-base font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Everything You Need
          </h2>
          <p className="text-slate-500 text-lg">
            Professional invoicing tools, no complexity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300 mb-4">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your invoicing?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and small businesses who trust
            Ledgerly for professional invoicing.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-lg hover:bg-indigo-50 transition-all duration-200 hover:shadow-xl"
          >
            Create Your Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-indigo-600" />
            <span className="font-semibold text-slate-700">Ledgerly</span>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Ledgerly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Invoice",
  description: "Create a new professional invoice with live preview. Add line items, taxes, and discounts, then export as PDF.",
};

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

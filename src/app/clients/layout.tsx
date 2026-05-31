import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
  description: "Manage your client contacts in Ledgerly. Add, edit, and organize your business clients for invoicing.",
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

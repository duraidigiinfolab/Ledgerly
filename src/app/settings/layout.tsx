import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your Ledgerly business details, currency preferences, and account settings.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

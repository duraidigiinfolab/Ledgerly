import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Ledgerly — Professional Invoice Generator",
    template: "%s | Ledgerly",
  },
  description:
    "Create, manage, and send professional invoices in seconds. Ledgerly is a modern invoice generator for freelancers and small businesses.",
  keywords: [
    "invoice generator",
    "invoicing software",
    "freelance invoicing",
    "small business invoices",
    "billing software",
    "PDF invoice",
    "invoice management",
  ],
  authors: [{ name: "Ledgerly" }],
  openGraph: {
    title: "Ledgerly — Professional Invoice Generator",
    description:
      "Create, manage, and send professional invoices in seconds.",
    type: "website",
    siteName: "Ledgerly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledgerly — Professional Invoice Generator",
    description:
      "Create, manage, and send professional invoices in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

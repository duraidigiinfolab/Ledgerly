import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber(businessName: string, existingCount: number): string {
  const prefix = businessName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();
  const number = String(existingCount + 1).padStart(6, "0");
  return `${prefix || "INV"}-${number}`;
}

export function safeNumber(value: string | number | undefined | null): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  Send,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  revenue: number;
  currency: string;
}

export function SummaryCards({
  total,
  draft,
  sent,
  paid,
  revenue,
  currency,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Invoices",
      value: total.toString(),
      icon: FileText,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Draft",
      value: draft.toString(),
      icon: Clock,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      title: "Sent",
      value: sent.toString(),
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Paid",
      value: paid.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Revenue",
      value: formatCurrency(revenue, currency),
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}
              >
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {card.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

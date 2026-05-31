"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, PackagePlus } from "lucide-react";
import { formatCurrency, safeNumber } from "@/lib/utils";
import type { LineItem } from "@/components/invoice-editor";
import { useState, useEffect } from "react";

interface PresavedItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
}

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  currency: string;
}

export function LineItemsEditor({
  items,
  onChange,
  currency,
}: LineItemsEditorProps) {
  const [presavedItems, setPresavedItems] = useState<PresavedItem[]>([]);

  useEffect(() => {
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => setPresavedItems(data))
      .catch(console.error);
  }, []);

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.amount = safeNumber(updated.quantity) * safeNumber(updated.rate);
        return updated;
      })
    );
  };

  const addItem = () => {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const addPresavedItem = (itemId: string) => {
    if (!itemId) return;
    const preset = presavedItems.find((i) => i.id === itemId);
    if (!preset) return;
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        description: preset.name + (preset.description ? ` - ${preset.description}` : ""),
        quantity: 1,
        rate: preset.price,
        amount: preset.price,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="hidden sm:grid sm:grid-cols-[minmax(150px,1fr)_80px_100px_120px_40px] gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 pb-2">
        <div className="pl-3">Description</div>
        <div className="text-right pr-3">Qty</div>
        <div className="text-right pr-3">Rate</div>
        <div className="text-right pr-3">Amount</div>
        <div></div>
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className="group grid grid-cols-1 sm:grid-cols-[minmax(150px,1fr)_80px_100px_120px_40px] gap-2 items-center rounded-lg border border-slate-200 p-3 sm:p-2 sm:border-transparent sm:hover:border-slate-200 transition-all duration-200"
        >
          <div>
            <label className="sm:hidden text-xs text-slate-400 mb-1 block">
              Description
            </label>
            <Input
              placeholder="Item description"
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <label className="sm:hidden text-xs text-slate-400 mb-1 block">
              Quantity
            </label>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="1"
              value={item.quantity || ""}
              onChange={(e) =>
                updateItem(item.id, "quantity", safeNumber(e.target.value))
              }
              className="h-9 text-right"
            />
          </div>
          <div>
            <label className="sm:hidden text-xs text-slate-400 mb-1 block">
              Rate
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={item.rate || ""}
              onChange={(e) =>
                updateItem(item.id, "rate", safeNumber(e.target.value))
              }
              className="h-9 text-right"
            />
          </div>
          <div className="text-right">
            <label className="sm:hidden text-xs text-slate-400 mb-1 block">
              Amount
            </label>
            <span className="text-sm font-medium text-slate-700 px-3 h-9 flex items-center justify-end">
              {formatCurrency(
                safeNumber(item.quantity) * safeNumber(item.rate),
                currency
              )}
            </span>
          </div>
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
              disabled={items.length <= 1}
              className="h-9 w-9 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-0 opacity-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Add Item */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={addItem}
          className="flex-1 border-dashed border-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Line Item
        </Button>
        {presavedItems.length > 0 && (
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <PackagePlus className="h-4 w-4 text-indigo-500" />
            </div>
            <select
              className="w-full h-10 pl-10 pr-4 rounded-md border border-slate-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-300 cursor-pointer transition-colors"
              onChange={(e) => {
                addPresavedItem(e.target.value);
                e.target.value = ""; // reset
              }}
              defaultValue=""
            >
              <option value="" disabled>Insert pre-saved item...</option>
              {presavedItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({formatCurrency(item.price, currency)})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

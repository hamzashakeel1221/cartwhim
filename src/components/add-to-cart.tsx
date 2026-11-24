"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "./cart-provider";

export function QuickAdd({ slug }: { slug: string }) {
  const { add } = useCart();
  return (
    <button
      onClick={(e) => { e.preventDefault(); add(slug); }}
      className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white transition hover:bg-brand-500"
      aria-label="Add to cart"
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}

export function QtyStepper({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div className="inline-flex items-center rounded-full border border-stone-200 bg-white">
      <button className="p-2.5 disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button className="p-2.5 disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function BuyBox({ slug, stock }: { slug: string; stock: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <QtyStepper value={qty} onChange={setQty} max={stock} />
        <span className={`text-sm font-medium ${stock < 20 ? "text-brand-600" : "text-mint"}`}>
          {stock < 20 ? `Only ${stock} left in stock` : "In stock, ready to ship"}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button className="btn btn-ghost" onClick={() => add(slug, qty)}>
          <ShoppingCart className="h-5 w-5" /> Add to cart
        </button>
        <button className="btn btn-primary" onClick={() => { add(slug, qty); router.push("/checkout"); }}>
          <Zap className="h-5 w-5" /> Buy now, pay on delivery
        </button>
      </div>
    </div>
  );
}

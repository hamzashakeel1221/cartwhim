"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { useCart } from "./cart-provider";

export function QuickAdd({ slug }: { slug: string }) {
  const { add } = useCart();
  return (
    <button
      onClick={(e) => { e.preventDefault(); add(slug); }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-brand-500 active:scale-90 sm:h-10 sm:w-10"
      aria-label="Add to cart"
    >
      <Plus className="h-5 w-5" />
    </button>
  );
}

export function QtyStepper({ value, onChange, max, small }: { value: number; onChange: (n: number) => void; max: number; small?: boolean }) {
  const pad = small ? "p-1.5" : "p-2.5";
  return (
    <div className="inline-flex items-center rounded-full border border-stone-200 bg-white">
      <button className={`${pad} disabled:opacity-30`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button className={`${pad} disabled:opacity-30`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function BuyBox({ slug, stock, price }: { slug: string; stock: number; price: number }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const buyNow = () => { add(slug, qty); router.push("/checkout"); };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <QtyStepper value={qty} onChange={setQty} max={stock} />
        <span className={`flex items-center gap-1.5 text-sm font-medium ${stock < 20 ? "text-brand-600" : "text-emerald-600"}`}>
          <span className={`h-2 w-2 rounded-full ${stock < 20 ? "animate-pulse bg-brand-500" : "bg-emerald-500"}`} />
          {stock < 20 ? `Hurry, only ${stock} left` : "In stock, ships in 24 hours"}
        </span>
      </div>
      <div className="hidden gap-3 sm:grid sm:grid-cols-2">
        <button className="btn btn-ghost py-3.5" onClick={() => add(slug, qty, { openDrawer: true })}>
          <ShoppingCart className="h-5 w-5" /> Add to cart
        </button>
        <button className="btn btn-primary py-3.5" onClick={buyNow}>
          <Zap className="h-5 w-5" /> Buy now · Pay on delivery
        </button>
      </div>

      {/* Sticky buy bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-2">
          <div className="mr-1 min-w-0">
            <p className="text-[11px] font-medium text-stone-500">Total</p>
            <p className="text-base font-extrabold leading-tight">{formatPKR(price * qty)}</p>
          </div>
          <button className="btn btn-ghost ml-auto h-12 w-12 shrink-0 p-0" onClick={() => add(slug, qty, { openDrawer: true })} aria-label="Add to cart">
            <ShoppingCart className="h-5 w-5" />
          </button>
          <button className="btn btn-primary h-12 flex-1 px-4 text-[15px]" onClick={buyNow}>
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

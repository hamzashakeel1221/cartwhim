"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { QtyStepper } from "@/components/add-to-cart";
import { useCart } from "@/components/cart-provider";
import { ProductArt } from "@/components/product-art";
import { Summary } from "@/components/summary";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";

export default function CartPage() {
  const { lines, subtotal, shipping, total, setQty, remove, ready } = useCart();

  if (!ready) return <div className="container-x py-24" />;

  if (!lines.length) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-500"><ShoppingBag className="h-9 w-9" /></span>
        <h1 className="mt-6 text-2xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-stone-500">Find something you like, we have new arrivals every week.</p>
        <Link href="/products" className="btn btn-primary mt-8">Start shopping</Link>
      </div>
    );
  }

  const toFree = store.shipping.freeOver - subtotal;

  return (
    <div className="container-x pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {toFree > 0 ? (
            <div className="rounded-2xl bg-brand-50 p-4 text-sm">
              Add <b>{formatPKR(toFree)}</b> more to get <b>free delivery</b>.
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, (subtotal / store.shipping.freeOver) * 100)}%` }} />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-mint/10 p-4 text-sm font-medium text-emerald-700">🎉 You have unlocked free delivery!</div>
          )}
          {lines.map(({ product, qty }) => (
            <div key={product.slug} className="flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-stone-200/70">
              <Link href={`/products/${product.slug}`} className="w-24 shrink-0 sm:w-28"><ProductArt product={product} /></Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link href={`/products/${product.slug}`} className="line-clamp-2 font-semibold hover:text-brand-600">{product.name}</Link>
                  <button onClick={() => remove(product.slug)} className="h-fit p-1 text-stone-400 hover:text-red-500" aria-label={`Remove ${product.name}`}><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-1 text-sm text-stone-500">{formatPKR(product.price)} each</p>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <QtyStepper value={qty} max={product.stock} onChange={(n) => setQty(product.slug, n)} />
                  <p className="font-extrabold">{formatPKR(product.price * qty)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 lg:sticky lg:top-40">
          <h2 className="text-lg font-bold">Order summary</h2>
          <Summary subtotal={subtotal} shipping={shipping} total={total} />
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">Checkout <ArrowRight className="h-4 w-4" /></Link>
          <p className="mt-3 text-center text-xs text-stone-500">Cash on Delivery available</p>
        </aside>
      </div>
    </div>
  );
}

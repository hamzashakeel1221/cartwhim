"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";
import { QtyStepper } from "./add-to-cart";
import { useCatalog } from "./catalog-provider";
import { useCart } from "./cart-provider";
import { ProductArt } from "./product-art";

export function CartDrawer() {
  const { drawerOpen: open, setDrawerOpen, lines, subtotal, shipping, total, setQty, remove, add } = useCart();
  const path = usePathname();
  const { products } = useCatalog();

  useEffect(() => setDrawerOpen(false), [path, setDrawerOpen]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, setDrawerOpen]);

  const toFree = Math.max(0, store.shipping.freeOver - subtotal);
  const inCart = new Set(lines.map((l) => l.slug));
  const upsell = products.filter((p) => !inCart.has(p.slug) && p.price < 1600).slice(0, 3);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setDrawerOpen(false)} className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-stone-50 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <h2 className="text-lg font-extrabold">Your cart {lines.length > 0 && <span className="text-stone-400">({lines.reduce((s, l) => s + l.qty, 0)})</span>}</h2>
          <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-stone-100" aria-label="Close cart"><X className="h-5 w-5" /></button>
        </div>

        {!lines.length ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-500"><ShoppingBag className="h-9 w-9" /></span>
            <p className="mt-5 text-lg font-bold">Your cart is empty</p>
            <p className="mt-1 text-sm text-stone-500">Let&apos;s find something you&apos;ll love.</p>
            <Link href="/products" className="btn btn-primary mt-6">Start shopping</Link>
          </div>
        ) : (
          <>
            <div className="border-b border-stone-200 bg-white px-5 py-3">
              <p className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-brand-500" />
                {toFree > 0 ? <>Add <b>{formatPKR(toFree)}</b> more for <b>free delivery</b></> : <b className="text-emerald-600">You&apos;ve unlocked free delivery 🎉</b>}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-rose-500 transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / store.shipping.freeOver) * 100)}%` }} />
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {lines.map(({ product, qty }) => (
                <div key={product.slug} className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-stone-200/70">
                  <Link href={`/products/${product.slug}`} className="w-20 shrink-0"><ProductArt product={product} /></Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                      <button onClick={() => remove(product.slug)} className="h-fit p-1 text-stone-400 hover:text-red-500" aria-label={`Remove ${product.name}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-2">
                      <QtyStepper value={qty} max={product.stock} onChange={(n) => setQty(product.slug, n)} small />
                      <p className="font-extrabold">{formatPKR(product.price * qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {upsell.length > 0 && (
                <div className="pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Add a little extra</p>
                  <div className="mt-3 space-y-2">
                    {upsell.map((p) => (
                      <div key={p.slug} className="flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-stone-200/70">
                        <div className="w-12 shrink-0"><ProductArt product={p} /></div>
                        <p className="line-clamp-1 flex-1 text-sm">{p.name}</p>
                        <span className="text-sm font-semibold">{formatPKR(p.price)}</span>
                        <button onClick={() => add(p.slug, 1, { openDrawer: true })} className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white hover:bg-brand-500" aria-label={`Add ${p.name}`}><Plus className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-stone-200 bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd className="font-semibold">{formatPKR(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-stone-500">Delivery</dt><dd className="font-semibold">{shipping ? formatPKR(shipping) : <span className="text-emerald-600">Free</span>}</dd></div>
                <div className="flex justify-between pt-1 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">{formatPKR(total)}</dd></div>
              </dl>
              <Link href="/checkout" className="btn btn-primary mt-4 w-full py-3.5 text-base">Checkout · Cash on Delivery</Link>
              <Link href="/cart" className="mt-2 block text-center text-sm font-semibold text-stone-500 hover:text-ink">View full cart</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

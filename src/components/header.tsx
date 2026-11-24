"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Menu, Search, ShoppingCart, Truck, X } from "lucide-react";
import { categories } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";
import { useCart } from "./cart-provider";
import { Logo } from "./logo";

function SearchBox({ className = "" }: { className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  return (
    <form
      role="search"
      className={`relative ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search earbuds, air fryers, handbags..."
        aria-label="Search products"
        className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
      />
    </form>
  );
}

export function Header() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/90 backdrop-blur">
      <div className="bg-ink text-white">
        <div className="container-x flex h-9 items-center justify-center gap-2 text-xs font-medium sm:justify-between">
          <p className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-brand-200" />
            Free delivery on orders over {formatPKR(store.shipping.freeOver)} · Cash on Delivery all over Pakistan
          </p>
          <div className="hidden gap-5 sm:flex">
            <Link href="/track-order" className="hover:text-brand-200">Track order</Link>
            <a href={`https://wa.me/${store.whatsappNumber}`} className="hover:text-brand-200">WhatsApp us</a>
          </div>
        </div>
      </div>

      <div className="container-x flex h-16 items-center gap-4">
        <button className="-ml-2 p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
        <Logo />
        <Suspense fallback={<div className="hidden flex-1 md:block" />}>
          <SearchBox className="mx-6 hidden max-w-xl flex-1 md:block" />
        </Suspense>
        <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold lg:flex">
          <Link href="/products" className="hover:text-brand-600">Shop all</Link>
          <Link href="/products?tag=deal" className="text-brand-600 hover:text-brand-700">Deals</Link>
        </nav>
        <Link href="/cart" className="relative ml-auto rounded-full p-2.5 transition hover:bg-stone-100 lg:ml-0" aria-label={`Cart, ${count} items`}>
          <ShoppingCart className="h-6 w-6" />
          {ready && count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>

      <div className="container-x pb-3 md:hidden">
        <Suspense fallback={null}>
          <SearchBox />
        </Suspense>
      </div>

      <div className="hidden border-t border-stone-100 lg:block">
        <nav className="container-x scrollbar-none flex h-11 items-center gap-7 overflow-x-auto text-sm text-stone-600">
          {categories.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="whitespace-nowrap hover:text-ink">
              {c.name}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2"><X className="h-5 w-5" /></button>
            </div>
            <nav className="flex flex-col gap-1 text-[15px]" onClick={() => setOpen(false)}>
              <Link href="/products" className="rounded-lg px-3 py-2.5 font-semibold hover:bg-stone-100">Shop all</Link>
              <Link href="/products?tag=deal" className="rounded-lg px-3 py-2.5 font-semibold text-brand-600 hover:bg-stone-100">Deals</Link>
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Categories</p>
              {categories.map((c) => (
                <Link key={c.slug} href={`/products?category=${c.slug}`} className="rounded-lg px-3 py-2.5 hover:bg-stone-100">{c.name}</Link>
              ))}
              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Help</p>
              <Link href="/track-order" className="rounded-lg px-3 py-2.5 hover:bg-stone-100">Track order</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

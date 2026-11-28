"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { categories } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { useCatalog } from "./catalog-provider";
import { Icon } from "./icon";

const popular = ["tummy trimmer", "lcd tablet", "luggage scale", "trimmer", "busy book"];

export function SearchBox({ className = "", autoFocus }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const { products } = useCatalog();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return products.filter((p) => words.every((w) => `${p.name} ${p.category}`.toLowerCase().includes(w))).slice(0, 5);
  }, [q, products]);
  const cats = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? categories.filter((c) => c.name.toLowerCase().includes(n)).slice(0, 2) : [];
  }, [q]);

  function go(term: string) {
    setOpen(false);
    router.push(term.trim() ? `/products?q=${encodeURIComponent(term.trim())}` : "/products");
  }

  return (
    <div ref={box} className={`relative ${className}`}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); go(q); }}>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={q}
          autoFocus={autoFocus}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          placeholder="Search for products..."
          aria-label="Search products"
          enterKeyHint="search"
          className="w-full rounded-2xl border border-transparent bg-stone-100 py-3 pl-11 pr-10 text-[15px] outline-none transition placeholder:text-stone-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 hover:bg-stone-200" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-stone-200">
          {!q.trim() ? (
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((t) => (
                  <button key={t} onClick={() => go(t)} className="rounded-full bg-stone-100 px-3 py-1.5 text-sm hover:bg-brand-50 hover:text-brand-700">{t}</button>
                ))}
              </div>
            </div>
          ) : results.length || cats.length ? (
            <ul className="py-2">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link onClick={() => setOpen(false)} href={`/category/${c.slug}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.hue}`}><Icon name={c.icon} className="h-5 w-5" /></span>
                    <span className="flex-1 text-sm font-medium">{c.name}</span>
                    <span className="text-xs text-stone-400">Category</span>
                  </Link>
                </li>
              ))}
              {results.map((p) => (
                <li key={p.slug}>
                  <Link onClick={() => setOpen(false)} href={`/products/${p.slug}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-stone-100"><Icon name={p.icon} className="h-5 w-5" /></span>
                    <span className="line-clamp-1 flex-1 text-sm">{p.name}</span>
                    <span className="text-sm font-semibold">{formatPKR(p.price)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={() => go(q)} className="flex w-full items-center justify-between border-t border-stone-100 px-4 py-3 text-sm font-semibold text-brand-600 hover:bg-stone-50">
                  See all results for &ldquo;{q}&rdquo; <ArrowUpRight className="h-4 w-4" />
                </button>
              </li>
            </ul>
          ) : (
            <p className="p-4 text-sm text-stone-500">No matches for &ldquo;{q}&rdquo;. Try another word.</p>
          )}
        </div>
      )}
    </div>
  );
}

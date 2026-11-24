"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/lib/catalog";
import { shippingFor } from "@/lib/store-config";

export type CartLine = { slug: string; qty: number };
type Line = CartLine & { product: Product };

type CartState = {
  lines: Line[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  toast: string | null;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "cartwhim-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setRaw(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(raw)); } catch {}
  }, [raw, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback((slug: string, qty = 1) => {
    const p = getProduct(slug);
    if (!p) return;
    setRaw((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, p.stock) } : l));
      return [...prev, { slug, qty: Math.min(qty, p.stock) }];
    });
    setToast(`${p.name} added to cart`);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const p = getProduct(slug);
    setRaw((prev) =>
      qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, p?.stock ?? qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setRaw((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartState>(() => {
    const lines = raw
      .map((l) => ({ ...l, product: getProduct(l.slug) }))
      .filter((l): l is Line => Boolean(l.product));
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const shipping = shippingFor(subtotal);
    return {
      lines, subtotal, shipping, total: subtotal + shipping, ready, toast,
      count: lines.reduce((s, l) => s + l.qty, 0),
      add, setQty, remove, clear,
    };
  }, [raw, ready, toast, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

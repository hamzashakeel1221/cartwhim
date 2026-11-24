"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type WishlistState = {
  slugs: string[];
  ready: boolean;
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  recent: string[];
  markViewed: (slug: string) => void;
};

const Ctx = createContext<WishlistState | null>(null);
const WISH = "cartwhim-wishlist-v1";
const RECENT = "cartwhim-recent-v1";

function load(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(key: string, v: string[]) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

// Wishlist and "recently viewed" are kept in the browser, no login needed.
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSlugs(load(WISH));
    setRecent(load(RECENT));
    setReady(true);
  }, []);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      save(WISH, next);
      return next;
    });
  }, []);

  const markViewed = useCallback((slug: string) => {
    setRecent((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 12);
      save(RECENT, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ slugs, ready, recent, toggle, markViewed, has: (s: string) => slugs.includes(s) }), [slugs, ready, recent, toggle, markViewed]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

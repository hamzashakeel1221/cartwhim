"use client";

import { useEffect } from "react";
import type { Product } from "@/lib/catalog";
import { useCatalog } from "./catalog-provider";
import { ProductCard } from "./product-card";
import { useWishlist } from "./wishlist-provider";

export function TrackView({ slug }: { slug: string }) {
  const { markViewed } = useWishlist();
  useEffect(() => markViewed(slug), [slug, markViewed]);
  return null;
}

export function RecentlyViewed({ exclude, title = "Recently viewed" }: { exclude?: string; title?: string }) {
  const { recent, ready } = useWishlist();
  const { getProduct } = useCatalog();
  if (!ready) return null;
  const list = recent.filter((s) => s !== exclude).map(getProduct).filter((p): p is Product => Boolean(p)).slice(0, 8);
  if (!list.length) return null;
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      <div className="snap-row">{list.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
    </section>
  );
}

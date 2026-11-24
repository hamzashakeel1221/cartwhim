"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// On a category page the sort jumps to /products with that category kept (sorted views are not indexed).
export function SortSelect({ basePath, preset }: { basePath?: string; preset?: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <select
      aria-label="Sort products"
      className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium outline-none focus:border-brand-500"
      value={params.get("sort") ?? "featured"}
      onChange={(e) => {
        const next = new URLSearchParams(params);
        for (const [k, v] of Object.entries(preset ?? {})) next.set(k, v);
        if (e.target.value === "featured") next.delete("sort"); else next.set("sort", e.target.value);
        router.push(`${basePath ?? pathname}?${next.toString()}`);
      }}
    >
      <option value="featured">Featured</option>
      <option value="popular">Most popular</option>
      <option value="new">Newest</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
      <option value="discount">Biggest discount</option>
    </select>
  );
}

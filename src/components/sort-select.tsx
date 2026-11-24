"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
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
        if (e.target.value === "featured") next.delete("sort"); else next.set("sort", e.target.value);
        router.push(`${pathname}?${next.toString()}`);
      }}
    >
      <option value="featured">Featured</option>
      <option value="popular">Most popular</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
      <option value="discount">Biggest discount</option>
    </select>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { SortSelect } from "@/components/sort-select";
import { categories, getCategory, products } from "@/lib/catalog";
import { sortProducts } from "@/lib/sorting";

type SP = Promise<{ q?: string; category?: string; sort?: string; tag?: string; price?: string }>;

const priceBands: Record<string, { label: string; min: number; max: number }> = {
  "under-1500": { label: "Under Rs. 1,500", min: 0, max: 1499 },
  "1500-3500": { label: "Rs. 1,500 to 3,500", min: 1500, max: 3500 },
  "over-3500": { label: "Over Rs. 3,500", min: 3501, max: Infinity },
};

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Object.values(sp).some(Boolean);
  return {
    title: sp.q ? `Search results for "${sp.q}"` : sp.tag === "deal" ? "Today's deals" : "Shop all products online in Pakistan",
    description: "Browse every product at CartWhim. Best prices in Pakistan with Cash on Delivery and fast delivery.",
    alternates: { canonical: "/products" },
    // Search results and filtered views are not indexed, to avoid duplicate pages in Google.
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const { q = "", category, sort, tag, price } = await searchParams;
  const cat = category ? getCategory(category) : undefined;
  const band = price ? priceBands[price] : undefined;
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const list = sortProducts(
    products.filter((p) => {
      if (cat && p.category !== cat.slug) return false;
      if (tag && !p.tags?.includes(tag as "deal")) return false;
      if (band && (p.price < band.min || p.price > band.max)) return false;
      if (words.length) {
        const hay = `${p.name} ${p.description} ${getCategory(p.category)?.name}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      }
      return true;
    }),
    sort,
  );

  const title = words.length ? `Results for “${q}”` : tag === "deal" ? "Today's deals" : cat?.name ?? "All products";
  const link = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams();
    const merged = { q: q || undefined, category, sort, tag, price, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/products?${s}` : "/products";
  };
  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"}`;

  return (
    <div className="container-x pt-6">
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500"><Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{title}</span></nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-stone-500">{list.length} {list.length === 1 ? "product" : "products"}</p>
        </div>
        <Suspense fallback={null}><SortSelect /></Suspense>
      </div>

      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={link({ category: undefined, tag: undefined })} className={chip(!cat && !tag)}>All</Link>
        <Link href={link({ tag: tag === "deal" ? undefined : "deal" })} className={chip(tag === "deal")}>🔥 Deals</Link>
        {categories.map((c) => (
          <Link key={c.slug} href={link({ category: cat?.slug === c.slug ? undefined : c.slug })} className={chip(cat?.slug === c.slug)}>{c.name}</Link>
        ))}
      </div>
      <div className="scrollbar-none -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {Object.entries(priceBands).map(([k, b]) => (
          <Link key={k} href={link({ price: price === k ? undefined : k })} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${price === k ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"}`}>{b.label}</Link>
        ))}
      </div>

      {list.length ? (
        <div className="mt-6"><ProductGrid list={list} /></div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX className="h-12 w-12 text-stone-300" />
          <p className="mt-4 text-lg font-semibold">No products found</p>
          <p className="mt-1 text-sm text-stone-500">Try a different word or remove a filter.</p>
          <Link href="/products" className="btn btn-dark mt-6">Browse all</Link>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { SortSelect } from "@/components/sort-select";
import { categories, getCategory, products } from "@/lib/catalog";
import { discountPercent } from "@/lib/format";

type SP = Promise<{ q?: string; category?: string; sort?: string; tag?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { category, q } = await searchParams;
  const c = category ? getCategory(category) : undefined;
  return { title: q ? `Search: ${q}` : c ? c.name : "Shop all products" };
}

export default async function ProductsPage({ searchParams }: { searchParams: SP }) {
  const { q = "", category, sort, tag } = await searchParams;
  const cat = category ? getCategory(category) : undefined;
  const needle = q.trim().toLowerCase();

  let list = products.filter((p) => {
    if (cat && p.category !== cat.slug) return false;
    if (tag && !p.tags?.includes(tag as "deal")) return false;
    if (needle) {
      const hay = `${p.name} ${p.description} ${getCategory(p.category)?.name}`.toLowerCase();
      return needle.split(/\s+/).every((w) => hay.includes(w));
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "popular": return b.reviews - a.reviews;
      case "discount": return (discountPercent(b.price, b.compareAt) ?? 0) - (discountPercent(a.price, a.compareAt) ?? 0);
      default: return 0;
    }
  });

  const title = needle ? `Results for "${q}"` : tag === "deal" ? "Hot deals" : cat?.name ?? "Shop all products";
  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"}`;

  return (
    <div className="container-x pt-8">
      <nav className="text-sm text-stone-500"><Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{title}</span></nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-stone-500">{list.length} {list.length === 1 ? "product" : "products"}</p>
        </div>
        <Suspense fallback={null}><SortSelect /></Suspense>
      </div>

      <div className="scrollbar-none -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href="/products" className={chip(!cat && !tag)}>All</Link>
        <Link href="/products?tag=deal" className={chip(tag === "deal")}>Deals</Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/products?category=${c.slug}`} className={chip(cat?.slug === c.slug)}>{c.name}</Link>
        ))}
      </div>

      {list.length ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX className="h-12 w-12 text-stone-300" />
          <p className="mt-4 text-lg font-semibold">No products found</p>
          <p className="mt-1 text-sm text-stone-500">Try a different word, or browse all products.</p>
          <Link href="/products" className="btn btn-dark mt-6">Browse all</Link>
        </div>
      )}
    </div>
  );
}

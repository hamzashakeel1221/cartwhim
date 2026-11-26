import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Faq } from "@/components/faq";
import { Icon } from "@/components/icon";
import { ProductGrid } from "@/components/product-grid";
import { SortSelect } from "@/components/sort-select";
import { categories, getCategory } from "@/lib/catalog";
import { productsInCategory } from "@/lib/product-store";
import { formatPKR } from "@/lib/format";
import { breadcrumbLd, faqLd, itemListLd, JsonLd } from "@/lib/seo";
import { sortProducts } from "@/lib/sorting";
import { store } from "@/lib/store-config";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  const list = await productsInCategory(c.slug);
  const min = Math.min(...list.map((p) => p.price));
  const title = `${c.name}: Buy Online in Pakistan`;
  const description = `Shop ${c.name.toLowerCase()} online in Pakistan from ${formatPKR(min)}. ${list.length} products, Cash on Delivery, fast delivery and ${store.returnDays} day returns.`;
  return {
    title,
    description,
    keywords: c.keywords,
    alternates: { canonical: `/category/${c.slug}` },
    openGraph: { title, description, url: `/category/${c.slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const all = await productsInCategory(c.slug);
  const list = sortProducts(all);
  const min = Math.min(...all.map((p) => p.price));
  const faqs = [
    { q: `What is the price of ${c.name.toLowerCase()} at ${store.name}?`, a: `Prices start from ${formatPKR(min)}. Every product page shows the final price in PKR, including the discount.` },
    { q: `Can I order ${c.name.toLowerCase()} with Cash on Delivery?`, a: `Yes, Cash on Delivery is available on every product, anywhere in Pakistan.` },
    { q: "How fast is delivery?", a: `Orders ship within 24 hours and usually arrive in ${store.shipping.deliveryDays}.` },
  ];

  return (
    <div className="container-x pt-6">
      <JsonLd data={[itemListLd(c, list), faqLd(faqs), breadcrumbLd([{ name: "Home", path: "/" }, { name: c.name, path: `/category/${c.slug}` }])]} />
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500"><Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">{c.name}</span></nav>

      <header className={`mt-4 flex items-center gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br ${c.hue} p-6 sm:p-10`}>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{c.name}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/70">{c.intro}</p>
        </div>
        <Icon name={c.icon} className="hidden h-28 w-28 shrink-0 text-ink/20 sm:block lg:h-40 lg:w-40" />
      </header>

      <div className="scrollbar-none -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {categories.map((x) => (
          <Link key={x.slug} href={`/category/${x.slug}`} aria-current={x.slug === c.slug ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${x.slug === c.slug ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-stone-400"}`}>
            {x.name}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-stone-500">{list.length} products</p>
        <Suspense fallback={null}><SortSelect basePath={`/products`} preset={{ category: c.slug }} /></Suspense>
      </div>
      <div className="mt-4"><ProductGrid list={list} /></div>

      <section className="mt-14 max-w-3xl">
        <h2 className="mb-4 text-xl font-extrabold tracking-tight">{c.name}: common questions</h2>
        <Faq items={faqs} />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, Check, MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { BuyBox } from "@/components/add-to-cart";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { Rating } from "@/components/rating";
import { getCategory, getProduct, products } from "@/lib/catalog";
import { discountPercent, formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return { title: p.name, description: p.description };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const cat = getCategory(product.category);
  const off = discountPercent(product.price, product.compareAt);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const more = related.length < 4 ? products.filter((p) => p.category !== product.category).slice(0, 4 - related.length) : [];
  const waText = encodeURIComponent(`Hi CartWhim, I want to order: ${product.name} (${formatPKR(product.price)})`);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description,
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
    offers: { "@type": "Offer", priceCurrency: "PKR", price: product.price, availability: "https://schema.org/InStock" },
  };

  return (
    <div className="container-x pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="text-sm text-stone-500">
        <Link href="/" className="hover:text-ink">Home</Link> / {cat && <><Link href={`/products?category=${cat.slug}`} className="hover:text-ink">{cat.name}</Link> / </>}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="rounded-[2rem] bg-white p-4 ring-1 ring-stone-200/70">
          <ProductArt product={product} size="lg" priority />
        </div>

        <div>
          {product.tags?.includes("trending") && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">🔥 Trending</span>}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3"><Rating value={product.rating} reviews={product.reviews} size="md" /></div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-extrabold">{formatPKR(product.price)}</span>
            {product.compareAt && <span className="text-lg text-stone-400 line-through">{formatPKR(product.compareAt)}</span>}
            {off && <span className="rounded-full bg-mint/10 px-2.5 py-1 text-sm font-bold text-mint">Save {formatPKR(product.compareAt! - product.price)}</span>}
          </div>

          <p className="mt-5 leading-relaxed text-stone-600">{product.description}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{h}</li>
            ))}
          </ul>

          <div className="mt-8"><BuyBox slug={product.slug} stock={product.stock} /></div>
          <a href={`https://wa.me/${store.whatsappNumber}?text=${waText}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 py-3 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/10">
            <MessageCircle className="h-5 w-5" /> Order on WhatsApp instead
          </a>

          <div className="mt-8 divide-y divide-stone-200 rounded-2xl bg-white ring-1 ring-stone-200/70">
            {[
              [Banknote, "Cash on Delivery available", "Pay the rider when your parcel arrives."],
              [Truck, `Delivery in ${store.shipping.deliveryDays}`, `Free delivery on orders over ${formatPKR(store.shipping.freeOver)}, otherwise ${formatPKR(store.shipping.flatFee)}.`],
              [RotateCcw, `${store.returnDays} day returns`, "Damaged or not as described? We will replace or refund."],
              [ShieldCheck, "Quality checked", "Every item is checked before it ships."],
            ].map(([I, t, d]) => {
              const C = I as typeof Truck;
              return (
                <div key={t as string} className="flex gap-3 p-4">
                  <C className="h-5 w-5 shrink-0 text-brand-600" />
                  <div><p className="text-sm font-semibold">{t as string}</p><p className="text-sm text-stone-500">{d as string}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-extrabold tracking-tight">You may also like</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {[...related, ...more].map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}

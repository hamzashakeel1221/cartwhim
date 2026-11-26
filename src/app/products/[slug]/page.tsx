import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, Check, ChevronDown, MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { BuyBox } from "@/components/add-to-cart";
import { DeliveryEstimate } from "@/components/delivery-estimate";
import { Faq } from "@/components/faq";
import { Gallery } from "@/components/gallery";
import { ProductCard } from "@/components/product-card";
import { Rating } from "@/components/rating";
import { RecentlyViewed, TrackView } from "@/components/recently-viewed";
import { ShareButton } from "@/components/share-button";
import { Tilt } from "@/components/tilt";
import { WishlistButton } from "@/components/wishlist-button";
import { ProductScroll3D } from "@/components/product-scroll-3d";
import { getCategory, hasScroll3d, productSku } from "@/lib/catalog";
import { findProduct, getCatalog } from "@/lib/product-store";
import { discountPercent, formatPKR } from "@/lib/format";
import { breadcrumbLd, faqLd, JsonLd, productLd } from "@/lib/seo";
import { store } from "@/lib/store-config";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await findProduct((await params).slug);
  if (!p) return {};
  const off = discountPercent(p.price, p.compareAt);
  const title = `${p.name} Price in Pakistan`;
  const description = `Buy ${p.name} online in Pakistan for ${formatPKR(p.price)}${off ? ` (${off}% off)` : ""}. ${p.highlights.slice(0, 2).join(", ")}. Cash on Delivery, fast delivery, ${store.returnDays} day returns.`;
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { type: "website", title, description, url: `/products/${p.slug}` },
    twitter: { card: "summary_large_image", title, description },
    other: { "product:price:amount": String(p.price), "product:price:currency": "PKR" },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await findProduct((await params).slug);
  if (!product) notFound();
  const products = await getCatalog();
  const cat = getCategory(product.category);
  const off = discountPercent(product.price, product.compareAt);
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const more = products.filter((p) => p.category !== product.category && p.tags?.includes("trending"));
  const waText = encodeURIComponent(`Hi CartWhim, I want to order: ${product.name} (${formatPKR(product.price)})\n${`https://${store.domain}/products/${product.slug}`}`);
  const faqs = [
    { q: `What is the price of ${product.name} in Pakistan?`, a: `The price of ${product.name} at ${store.name} is ${formatPKR(product.price)}${product.compareAt ? `, down from ${formatPKR(product.compareAt)}` : ""}.` },
    { q: "Is Cash on Delivery available?", a: "Yes. Pay in cash when the parcel reaches you, anywhere in Pakistan." },
    { q: "What if the product is damaged or not as shown?", a: `Message us within ${store.returnDays} days of delivery with a photo or video and we will replace it or refund you.` },
  ];

  return (
    <>
    <div className="container-x pt-4 sm:pt-6">
      <JsonLd data={[
        productLd(product),
        breadcrumbLd([{ name: "Home", path: "/" }, ...(cat ? [{ name: cat.name, path: `/category/${cat.slug}` }] : []), { name: product.name, path: `/products/${product.slug}` }]),
        faqLd(faqs),
      ]} />
      <TrackView slug={product.slug} />

      <nav aria-label="Breadcrumb" className="scrollbar-none overflow-x-auto whitespace-nowrap text-sm text-stone-500">
        <Link href="/" className="hover:text-ink">Home</Link> / {cat && <><Link href={`/category/${cat.slug}`} className="hover:text-ink">{cat.name}</Link> / </>}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:mt-6 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative -mx-4 bg-white p-3 sm:mx-0 sm:rounded-[2rem] sm:p-4 sm:ring-1 sm:ring-stone-200/70">
            <Tilt className="rounded-2xl" max={7}><Gallery product={product} /></Tilt>
            <div className="absolute right-6 top-6 z-20 flex flex-col gap-2 sm:right-7 sm:top-7">
              <WishlistButton slug={product.slug} className="h-10 w-10 rounded-full bg-white shadow-md" />
              <ShareButton title={product.name} className="h-10 w-10 rounded-full bg-white shadow-md" />
            </div>
            {off && <span className="absolute left-6 top-6 z-20 rounded-full bg-brand-500 px-3 py-1 text-sm font-bold text-white sm:left-7 sm:top-7">-{off}%</span>}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.tags?.includes("trending") && <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">🔥 Trending</span>}
            {product.tags?.includes("new") && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">New arrival</span>}
            <span className="text-xs text-stone-400">SKU {productSku(product)}</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-2"><Rating value={product.rating} reviews={product.reviews} size="md" /></div>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-extrabold sm:text-4xl">{formatPKR(product.price)}</span>
            {product.compareAt && <span className="text-lg text-stone-400 line-through">{formatPKR(product.compareAt)}</span>}
            {off && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">You save {formatPKR(product.compareAt! - product.price)}</span>}
          </div>
          <p className="mt-1 text-xs text-stone-500">Price in PKR, inclusive of all taxes</p>

          <div className="mt-5"><DeliveryEstimate /></div>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{h}</li>
            ))}
          </ul>

          <div className="mt-6"><BuyBox slug={product.slug} stock={product.stock} price={product.price} /></div>
          <a href={`https://wa.me/${store.whatsappNumber}?text=${waText}`} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 py-3 text-sm font-semibold text-[#128C7E] transition hover:bg-[#25D366]/10">
            <MessageCircle className="h-5 w-5" /> Order on WhatsApp
          </a>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {[
              [Banknote, "Cash on Delivery"],
              [Truck, product.price >= store.shipping.freeOver ? "Free delivery" : `Delivery ${formatPKR(store.shipping.flatFee)}`],
              [RotateCcw, `${store.returnDays} day returns`],
              [ShieldCheck, "Quality checked"],
            ].map(([I, t]) => {
              const C = I as typeof Truck;
              return (
                <div key={t as string} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 text-sm font-medium ring-1 ring-stone-200/70">
                  <C className="h-5 w-5 shrink-0 text-brand-600" />{t as string}
                </div>
              );
            })}
          </div>

          <div className="mt-6 divide-y divide-stone-200 rounded-3xl bg-white ring-1 ring-stone-200/70">
            <Section title="Description" open><p>{product.description}</p></Section>
            <Section title="Delivery & Cash on Delivery">
              <p>Ships within 24 hours from our partner warehouse. Delivery takes {store.shipping.deliveryDays} anywhere in Pakistan. Free delivery on orders over {formatPKR(store.shipping.freeOver)}, otherwise {formatPKR(store.shipping.flatFee)}. Pay the rider in cash when your parcel arrives.</p>
            </Section>
            <Section title="Returns & refunds">
              <p>Damaged, faulty or not as described? Message us within {store.returnDays} days of delivery with a photo or short video and we will replace it or refund you. <Link href="/policies#returns" className="font-semibold text-brand-600">Full policy</Link></p>
            </Section>
          </div>
        </div>
      </div>

    </div>

    {hasScroll3d(product) && <ProductScroll3D product={product} />}

    <div className="container-x">
      <section className="mt-14">
        <h2 className="mb-5 text-xl font-extrabold tracking-tight sm:text-2xl">You may also like</h2>
        <div className="snap-row">{[...related, ...more].slice(0, 8).map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="mb-4 text-xl font-extrabold tracking-tight sm:text-2xl">Questions about this product</h2>
        <Faq items={faqs} />
      </section>

      <RecentlyViewed exclude={product.slug} />
    </div>
    </>
  );
}

function Section({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-5 w-5 text-stone-400 transition group-open:rotate-180" />
      </summary>
      <div className="px-5 pb-5 text-sm leading-relaxed text-stone-600">{children}</div>
    </details>
  );
}

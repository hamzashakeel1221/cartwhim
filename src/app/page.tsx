import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, MessageCircle, RotateCcw, Truck } from "lucide-react";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { categories, getProduct, products } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";

const perks = [
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when your parcel arrives" },
  { icon: Truck, title: "Nationwide delivery", text: `${store.shipping.deliveryDays}` },
  { icon: RotateCcw, title: `${store.returnDays} day easy returns`, text: "Changed your mind? No problem" },
  { icon: BadgeCheck, title: "Checked before dispatch", text: "Every order is quality checked" },
];

export default function Home() {
  const trending = products.filter((p) => p.tags?.includes("trending")).slice(0, 8);
  const deals = products.filter((p) => p.tags?.includes("deal")).slice(0, 4);
  const hero = getProduct("anc-wireless-earbuds")!;
  const hero2 = getProduct("digital-air-fryer-4l")!;

  return (
    <>
      {/* Hero */}
      <section className="container-x pt-6 sm:pt-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 via-brand-500 to-rose-500 px-6 py-12 text-white sm:px-12 sm:py-16 lg:py-20">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-1/3 h-80 w-80 rounded-full bg-white/10" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Winter Sale is live: up to 45% off
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Everything you want,<br />on a whim.
              </h1>
              <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">
                Trending gadgets, kitchen helpers, fashion and more. Order in a minute, pay cash when it reaches your door.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="btn bg-white text-ink hover:bg-brand-50">Start shopping <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/products?tag=deal" className="btn border border-white/40 text-white hover:bg-white/10">View deals</Link>
              </div>
            </div>
            <div className="relative hidden grid-cols-2 gap-4 lg:grid">
              {[hero, hero2].map((p, i) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className={`rounded-3xl bg-white p-3 text-ink shadow-2xl shadow-black/20 transition hover:-translate-y-1 ${i === 1 ? "mt-12" : ""}`}>
                  <ProductArt product={p} priority />
                  <p className="mt-3 px-1 text-sm font-semibold">{p.name}</p>
                  <p className="px-1 pb-1 text-lg font-extrabold">{formatPKR(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-x mt-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {perks.map(({ icon: I, title, text }) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{title}</p>
                <p className="truncate text-xs text-stone-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x mt-16">
        <SectionHead title="Shop by category" href="/products" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className={`group rounded-3xl bg-gradient-to-br ${c.hue} p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 text-ink transition group-hover:scale-110"><Icon name={c.icon} className="h-6 w-6" /></span>
              <p className="mt-6 font-semibold leading-tight">{c.name}</p>
              <p className="mt-1 text-xs text-ink/60">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container-x mt-16">
        <SectionHead title="Trending right now" href="/products?sort=popular" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {trending.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* COD banner */}
      <section className="container-x mt-16">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">No card? No problem.</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Order now, pay cash at your doorstep.</h2>
            <p className="mt-4 max-w-lg text-stone-300">
              Cash on Delivery is available in every city we deliver to. Open the parcel, check your item, then pay the rider. Prefer ordering on chat? Message us on WhatsApp.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-primary">Shop with COD</Link>
              <a href={`https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent("Hi CartWhim, I want to place an order.")}`} className="btn bg-[#25D366] text-white hover:bg-[#1fb857]">
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[["50+", "cities"], ["24h", "dispatch"], [`${store.returnDays} days`, "returns"]].map(([a, b]) => (
              <div key={b} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-extrabold text-brand-200">{a}</p>
                <p className="mt-1 text-xs text-stone-400">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="container-x mt-16">
        <SectionHead title="Today's best deals" href="/products?tag=deal" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {deals.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
        See all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

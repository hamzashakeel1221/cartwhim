import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, MessageCircle, RotateCcw, Truck, Zap } from "lucide-react";
import { Countdown } from "@/components/countdown";
import { Faq } from "@/components/faq";
import { Icon } from "@/components/icon";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { RecentlyViewed } from "@/components/recently-viewed";
import { Hero3D } from "@/components/three/hero-3d";
import { Tilt } from "@/components/tilt";
import { categories, type Product } from "@/lib/catalog";
import { getCatalog } from "@/lib/product-store";
import { storeFaqs } from "@/lib/faqs";
import { discountPercent, formatPKR } from "@/lib/format";
import { faqLd, JsonLd, websiteLd } from "@/lib/seo";
import { store } from "@/lib/store-config";

const perks = [
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when it arrives" },
  { icon: Truck, title: "Fast delivery", text: store.shipping.deliveryDays },
  { icon: RotateCcw, title: `${store.returnDays} day returns`, text: "Hassle free" },
  { icon: BadgeCheck, title: "Quality checked", text: "Before every dispatch" },
];

export default async function Home() {
  const products = await getCatalog();
  const getProduct = (slug: string) => products.find((p) => p.slug === slug);
  const trending = products.filter((p) => p.tags?.includes("trending"));
  const deals = [...products].sort((a, b) => (discountPercent(b.price, b.compareAt) ?? 0) - (discountPercent(a.price, a.compareAt) ?? 0)).slice(0, 8);
  const fresh = products.filter((p) => p.tags?.includes("new")).slice(0, 4);
  const heroPicks = ["tummy-trimmer-single-spring", "kids-lcd-writing-tablet-8-5", "digital-luggage-scale-50kg"].map((s) => getProduct(s)!);

  return (
    <>
      <JsonLd data={[websiteLd(), faqLd(storeFaqs)]} />

      {/* Hero */}
      <section className="container-x pt-4 sm:pt-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink text-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-brand-500/50 blur-3xl" />
            <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-rose-500/40 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_0)] [background-size:22px_22px]" />
          </div>
          <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-2 px-5 pb-6 pt-9 lg:gap-8 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:px-14 lg:py-16">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15 backdrop-blur">
                <Zap className="h-3.5 w-3.5 fill-brand-200 text-brand-200" /> Winter Sale · up to 45% off
              </span>
              <h1 className="mt-5 text-[2.35rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Everything you want,{" "}
                <span className="bg-gradient-to-r from-brand-200 via-brand-500 to-rose-400 bg-clip-text text-transparent">on a whim.</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70 sm:text-lg">
                Online shopping in Pakistan made easy. Trending gadgets, kitchen helpers and fashion, delivered to your door. Pay cash when it arrives.
              </p>
              <div className="mt-7 flex gap-3">
                <Link href="/products" className="btn btn-primary flex-1 px-5 py-3.5 sm:flex-none sm:px-7">Shop now <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/products?tag=deal" className="btn flex-1 bg-white/10 px-5 py-3.5 text-white ring-1 ring-white/20 hover:bg-white/15 sm:flex-none sm:px-6">Deals</Link>
              </div>
              <div className="mt-8 hidden items-center gap-6 text-sm text-white/60 sm:flex">
                <span className="flex items-center gap-2"><Banknote className="h-4 w-4 text-brand-200" /> Cash on Delivery</span>
                <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand-200" /> 50+ cities</span>
                <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-brand-200" /> Easy returns</span>
              </div>
            </div>

            <div className="relative">
              {/* Interactive 3D scene: drag to spin the bag. Static picks show until it loads (or if 3D is off). */}
              <Hero3D
                className="-mx-5 h-64 sm:h-80 lg:mx-0 lg:h-[480px]"
                fallback={<div className="hidden h-full lg:block"><HeroPicks picks={heroPicks} desktop /></div>}
              />
              <p className="pointer-events-none absolute bottom-1 left-1/2 hidden -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/60 backdrop-blur lg:block">Drag to spin</p>
            </div>
            <div className="lg:hidden"><HeroPicks picks={heroPicks} /></div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-x mt-4" aria-label="Why shop with us">
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:px-0">
          {perks.map(({ icon: I, title, text }) => (
            <div key={title} className="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200/70">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span>
              <div>
                <p className="whitespace-nowrap text-sm font-semibold">{title}</p>
                <p className="whitespace-nowrap text-xs text-stone-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x mt-12">
        <SectionHead title="Shop by category" href="/categories" />
        <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:px-0 lg:grid-cols-6">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group flex w-[76px] shrink-0 flex-col items-center text-center sm:w-auto sm:items-start sm:rounded-3xl sm:bg-white sm:p-5 sm:text-left sm:ring-1 sm:ring-stone-200/70 sm:transition sm:hover:-translate-y-0.5 sm:hover:shadow-lg">
              <span className={`grid h-[72px] w-[72px] place-items-center rounded-full bg-gradient-to-br ${c.hue} transition group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl`}>
                <Icon name={c.icon} className="h-7 w-7 text-ink/80" />
              </span>
              <p className="mt-2 text-xs font-semibold leading-tight sm:mt-5 sm:text-base">{c.name}</p>
              <p className="mt-1 hidden text-xs text-stone-500 sm:block">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash deals */}
      <section className="container-x mt-12">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-rose-50 p-4 ring-1 ring-brand-100 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-white"><Zap className="h-5 w-5 fill-white" /></span>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Flash deals</h2>
                <p className="text-xs text-stone-500">New prices every midnight</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-stone-500 sm:inline">Ends in</span>
              <Countdown />
            </div>
          </div>
          <div className="snap-row">{deals.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
        </div>
      </section>

      {/* Trending */}
      <section className="container-x mt-12">
        <SectionHead title="Trending in Pakistan" href="/products?sort=popular" />
        <div className="snap-row">{trending.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      {/* Promo tiles */}
      <section className="container-x mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4">
        <PromoTile href="/category/home-kitchen" kicker="Kitchen upgrades" title="Organise your home" price="from Rs. 899" hue="from-amber-200 to-orange-300" icon="cooking-pot" />
        <PromoTile href="/category/kids-toys" kicker="Kids learning" title="Screen-free learning toys" price="from Rs. 699" hue="from-lime-200 to-emerald-300" icon="baby" />
      </section>

      {/* New arrivals */}
      <section className="container-x mt-12">
        <SectionHead title="Just landed" href="/products?sort=new" />
        <div className="snap-row">{fresh.map((p) => <ProductCard key={p.slug} product={p} />)}</div>
      </section>

      <div className="container-x"><RecentlyViewed /></div>

      {/* COD + WhatsApp */}
      <section className="container-x mt-14">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">No card? No problem.</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Order now, pay cash at your doorstep.</h2>
            <p className="mt-4 max-w-lg text-stone-300">Open the parcel, check your item, then pay the rider. Prefer chatting? Order straight from WhatsApp.</p>
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

      {/* FAQ + SEO copy */}
      <section className="container-x mt-14 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Online shopping in Pakistan, the easy way</h2>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-stone-600">
            <p>
              {store.name} is an online store for everyday finds: <Link className="font-semibold text-ink underline-offset-2 hover:underline" href="/category/electronics">luggage scales and handy gadgets</Link>,{" "}
              <Link className="font-semibold text-ink underline-offset-2 hover:underline" href="/category/home-kitchen">kitchen and home organisers</Link>,{" "}
              <Link className="font-semibold text-ink underline-offset-2 hover:underline" href="/category/kids-toys">learning toys for kids</Link> and more.
            </p>
            <p>We deliver to Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar and 50+ cities with Cash on Delivery, so you only pay when your parcel is in your hands.</p>
          </div>
        </div>
        <div>
          <h2 className="sr-only">Frequently asked questions</h2>
          <Faq items={storeFaqs} />
        </div>
      </section>
    </>
  );
}

function HeroPicks({ picks, desktop }: { picks: Product[]; desktop?: boolean }) {
  return (
    <div className={desktop ? "grid grid-cols-2 gap-4" : "scrollbar-none -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"}>
      {picks.map((p, i) => (
        <Tilt key={p.slug} className={desktop ? `${i === 1 ? "mt-10" : ""} ${i === 2 ? "col-span-2 mx-auto -mt-4 w-1/2" : ""}` : "w-[62%] shrink-0 snap-start sm:w-[40%]"}>
          <Link href={`/products/${p.slug}`} className="block rounded-3xl bg-white p-2.5 text-ink shadow-2xl shadow-black/30">
            <ProductArt product={p} priority={i === 0} />
            <div className="px-1.5 pb-1 pt-2.5">
              <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
              <div className="mt-0.5 flex items-baseline gap-2">
                <span className="text-lg font-extrabold">{formatPKR(p.price)}</span>
                {p.compareAt && <span className="text-xs text-stone-400 line-through">{formatPKR(p.compareAt)}</span>}
              </div>
            </div>
          </Link>
        </Tilt>
      ))}
    </div>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
        See all <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function PromoTile({ href, kicker, title, price, hue, icon }: { href: string; kicker: string; title: string; price: string; hue: string; icon: string }) {
  return (
    <Link href={href} className={`group relative flex min-h-44 overflow-hidden rounded-[2rem] bg-gradient-to-br ${hue} p-6 sm:min-h-56 sm:p-8`}>
      <div className="relative z-10 max-w-[60%]">
        <p className="text-xs font-bold uppercase tracking-wider text-ink/60">{kicker}</p>
        <p className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{title}</p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-sm font-semibold backdrop-blur">{price} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></p>
      </div>
      <Icon name={icon} className="absolute -bottom-6 -right-4 h-44 w-44 text-white/60 transition duration-500 group-hover:rotate-[-6deg] group-hover:scale-105 sm:h-56 sm:w-56" />
    </Link>
  );
}

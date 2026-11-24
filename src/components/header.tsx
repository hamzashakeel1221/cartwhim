"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Heart, ShoppingBag, Truck, UserRound } from "lucide-react";
import { categories } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";
import { useCart } from "./cart-provider";
import { Logo } from "./logo";
import { SearchBox } from "./search-box";
import { useWishlist } from "./wishlist-provider";

const announcements = [
  `Free delivery on orders over ${formatPKR(store.shipping.freeOver)}`,
  "Cash on Delivery all over Pakistan",
  `${store.returnDays} day easy returns`,
];

function Announcement() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % announcements.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-ink text-white">
      <div className="container-x flex h-9 items-center justify-center gap-2 text-xs font-medium sm:justify-between">
        <p key={i} className="flex animate-[fadeUp_.4s_ease] items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-brand-200" /> {announcements[i]}
        </p>
        <div className="hidden gap-5 sm:flex">
          <Link href="/track-order" className="hover:text-brand-200">Track order</Link>
          <a href={`https://wa.me/${store.whatsappNumber}`} className="hover:text-brand-200">WhatsApp us</a>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const { count, ready, setDrawerOpen } = useCart();
  const wish = useWishlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <Announcement />
      <header className={`sticky top-0 z-40 bg-white/85 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-[0_1px_0_#e7e5e4,0_8px_24px_-12px_rgb(0_0_0/0.12)]" : "shadow-[0_1px_0_#f0eeec]"}`}>
        <div className="container-x flex h-16 items-center gap-3 lg:h-[72px]">
          <Logo />
          <Suspense fallback={<div className="hidden flex-1 md:block" />}>
            <SearchBox className="mx-6 hidden max-w-xl flex-1 md:block" />
          </Suspense>
          <nav className="ml-auto flex items-center gap-1" aria-label="Account and cart">
            <Link href="/wishlist" className="relative hidden rounded-full p-2.5 transition hover:bg-stone-100 md:block" aria-label="Wishlist">
              <Heart className="h-[22px] w-[22px]" />
              {wish.ready && wish.slugs.length > 0 && <Badge n={wish.slugs.length} />}
            </Link>
            <Link href="/account" className="hidden rounded-full p-2.5 transition hover:bg-stone-100 md:block" aria-label="My account">
              <UserRound className="h-[22px] w-[22px]" />
            </Link>
            <button onClick={() => setDrawerOpen(true)} className="relative rounded-full p-2.5 transition hover:bg-stone-100" aria-label={`Open cart, ${count} items`}>
              <ShoppingBag className="h-[22px] w-[22px]" />
              {ready && count > 0 && <Badge n={count} />}
            </button>
          </nav>
        </div>
        <div className="container-x pb-3 md:hidden">
          <Suspense fallback={<div className="h-12" />}>
            <SearchBox />
          </Suspense>
        </div>
        <div className="hidden border-t border-stone-100 lg:block">
          <nav className="container-x flex h-11 items-center gap-7 text-sm text-stone-600" aria-label="Categories">
            <Link href="/products?tag=deal" className="font-semibold text-brand-600 hover:text-brand-700">🔥 Deals</Link>
            {categories.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="whitespace-nowrap hover:text-ink">{c.name}</Link>
            ))}
            <Link href="/products" className="ml-auto font-semibold text-ink hover:text-brand-600">Shop all</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
      {n > 99 ? "99+" : n}
    </span>
  );
}

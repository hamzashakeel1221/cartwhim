"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "./cart-provider";
import { useWishlist } from "./wishlist-provider";

// App-style tab bar on phones. Hidden on checkout and product pages (those have their own sticky bar).
export function BottomNav() {
  const path = usePathname();
  const { count, ready, setDrawerOpen } = useCart();
  const wish = useWishlist();
  if (path.startsWith("/checkout") || path.startsWith("/products/")) return null;

  const item = (active: boolean) =>
    `relative flex flex-1 flex-col items-center gap-1 pt-2 pb-1.5 text-[11px] font-semibold transition ${active ? "text-brand-600" : "text-stone-500"}`;

  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="flex">
        <Link href="/" className={item(path === "/")}><Home className="h-[22px] w-[22px]" />Home</Link>
        <Link href="/categories" className={item(path.startsWith("/categor"))}><LayoutGrid className="h-[22px] w-[22px]" />Categories</Link>
        <Link href="/wishlist" className={item(path === "/wishlist")}>
          <Heart className="h-[22px] w-[22px]" />Wishlist
          {wish.ready && wish.slugs.length > 0 && <Dot n={wish.slugs.length} />}
        </Link>
        <button onClick={() => setDrawerOpen(true)} className={item(path === "/cart")}>
          <ShoppingBag className="h-[22px] w-[22px]" />Cart
          {ready && count > 0 && <Dot n={count} />}
        </button>
        <Link href="/account" className={item(path.startsWith("/account"))}><UserRound className="h-[22px] w-[22px]" />Account</Link>
      </div>
    </nav>
  );
}

function Dot({ n }: { n: number }) {
  return <span className="absolute left-1/2 top-1 ml-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">{n}</span>;
}

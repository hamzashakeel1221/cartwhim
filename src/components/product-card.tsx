import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { discountPercent, formatPKR } from "@/lib/format";
import { store } from "@/lib/store-config";
import { QuickAdd } from "./add-to-cart";
import { ProductArt } from "./product-art";
import { Rating } from "./rating";
import { Tilt } from "./tilt";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const off = discountPercent(product.price, product.compareAt);
  const isNew = product.tags?.includes("new");
  return (
    <Tilt className={`h-full rounded-3xl ${className}`} max={8}>
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex h-full flex-col rounded-3xl bg-white p-2 ring-1 ring-stone-200/70 transition-shadow duration-300 hover:shadow-[0_24px_48px_-20px_rgb(28_26_46/0.3)] sm:p-2.5"
    >
      <div className="relative overflow-hidden rounded-[1.25rem]">
        <div className="transition duration-500 group-hover:scale-[1.04]">
          <ProductArt product={product} />
        </div>
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {off && <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">-{off}%</span>}
          {isNew && <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">NEW</span>}
        </div>
        <WishlistButton slug={product.slug} className="absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white" />
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug sm:text-sm">{product.name}</h3>
        <div className="mt-1.5"><Rating value={product.rating} reviews={product.reviews} /></div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <p className="text-base font-extrabold leading-none sm:text-lg">{formatPKR(product.price)}</p>
            {product.compareAt && <p className="mt-1 text-[11px] text-stone-400 line-through sm:text-xs">{formatPKR(product.compareAt)}</p>}
          </div>
          <QuickAdd slug={product.slug} />
        </div>
        {product.price >= store.shipping.freeOver && <p className="mt-2 text-[11px] font-semibold text-emerald-600">Free delivery</p>}
      </div>
    </Link>
    </Tilt>
  );
}

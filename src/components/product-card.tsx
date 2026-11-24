import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { discountPercent, formatPKR } from "@/lib/format";
import { QuickAdd } from "./add-to-cart";
import { ProductArt } from "./product-art";
import { Rating } from "./rating";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAt);
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col rounded-3xl bg-white p-3 ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-200/60">
      <div className="relative">
        <div className="transition duration-300 group-hover:scale-[1.02]">
          <ProductArt product={product} />
        </div>
        {off && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white">-{off}%</span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.name}</h3>
        <div className="mt-1.5"><Rating value={product.rating} reviews={product.reviews} /></div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="text-lg font-extrabold leading-none">{formatPKR(product.price)}</p>
            {product.compareAt && <p className="mt-1 text-xs text-stone-400 line-through">{formatPKR(product.compareAt)}</p>}
          </div>
          <QuickAdd slug={product.slug} />
        </div>
      </div>
    </Link>
  );
}

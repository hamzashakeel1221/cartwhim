import type { Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export function ProductGrid({ list }: { list: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {list.map((p) => <ProductCard key={p.slug} product={p} />)}
    </div>
  );
}

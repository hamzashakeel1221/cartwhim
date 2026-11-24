import type { Product } from "./catalog";
import { discountPercent } from "./format";

export function sortProducts(list: Product[], sort?: string) {
  const score = (p: Product) => (p.tags?.includes("new") ? 1 : 0);
  return [...list].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "popular": return b.reviews - a.reviews;
      case "new": return score(b) - score(a);
      case "discount": return (discountPercent(b.price, b.compareAt) ?? 0) - (discountPercent(a.price, a.compareAt) ?? 0);
      default: return 0;
    }
  });
}

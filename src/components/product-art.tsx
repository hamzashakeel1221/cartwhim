import Image from "next/image";
import { categoryHue, type Product } from "@/lib/catalog";
import { Icon } from "./icon";

// Shows the product photo when one exists, otherwise a branded placeholder.
export function ProductArt({ product, size = "md", priority }: { product: Product; size?: "md" | "lg"; priority?: boolean }) {
  // Cards use the small uploaded thumbnail; the big product view uses the full photo.
  const img = size === "lg" ? product.images?.[0] : (product.thumbs?.[0] ?? product.images?.[0]);
  if (img) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
        <Image src={img} alt={product.name} fill priority={priority} unoptimized={img.startsWith("/api/photo/")} quality={90} sizes="(max-width: 768px) 50vw, 25vw" className="photo-enhance object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative grid place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${size === "lg" ? "aspect-[5/4] sm:aspect-square" : "aspect-square"} ${categoryHue(product.category)}`}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/30" />
      <Icon name={product.icon} className={`relative text-ink/80 ${size === "lg" ? "h-1/4 w-1/4" : "h-2/5 w-2/5"}`} />
    </div>
  );
}

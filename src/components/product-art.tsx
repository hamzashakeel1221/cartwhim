import Image from "next/image";
import { categoryHue, type Product } from "@/lib/catalog";
import { Icon } from "./icon";

// Shows the product photo when one exists, otherwise a branded placeholder.
export function ProductArt({ product, size = "md", priority }: { product: Product; size?: "md" | "lg"; priority?: boolean }) {
  const img = product.images?.[0];
  if (img) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
        <Image src={img} alt={product.name} fill priority={priority} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative grid aspect-square place-items-center overflow-hidden rounded-2xl bg-gradient-to-br ${categoryHue(product.category)}`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40" />
      <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/30" />
      <Icon name={product.icon} className={`relative text-ink/80 ${size === "lg" ? "h-1/4 w-1/4" : "h-2/5 w-2/5"}`} />
    </div>
  );
}

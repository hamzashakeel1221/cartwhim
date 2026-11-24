"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductArt } from "./product-art";

// Swipeable on phones (scroll-snap), thumbnails on desktop. Falls back to placeholder art.
export function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  if (images.length <= 1) return <ProductArt product={product} size="lg" priority />;

  const goTo = (i: number) => {
    setActive(i);
    track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      <div
        ref={track}
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
      >
        {images.map((src, i) => (
          <div key={src} className="relative aspect-square w-full shrink-0 snap-center bg-stone-100">
            <Image src={src} alt={`${product.name} photo ${i + 1}`} fill priority={i === 0} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
        {images.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-ink" : "w-1.5 bg-stone-300"}`} />)}
      </div>
      <div className="mt-3 hidden gap-2 sm:flex">
        {images.map((src, i) => (
          <button key={src} onClick={() => goTo(i)} className={`relative h-20 w-20 overflow-hidden rounded-xl ring-2 transition ${i === active ? "ring-brand-500" : "ring-transparent opacity-70 hover:opacity-100"}`} aria-label={`Show photo ${i + 1}`}>
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

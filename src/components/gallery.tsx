"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductArt } from "./product-art";

type Media = { kind: "image"; src: string; thumb?: string } | { kind: "video"; src: string; poster?: string };

// Swipeable on phones (scroll-snap), thumbnails on desktop. Photos first, then the product video. Falls back to placeholder art.
export function Gallery({ product }: { product: Product }) {
  const images = product.images ?? [];
  const media: Media[] = [
    ...images.map((src, i): Media => ({ kind: "image", src, thumb: product.thumbs?.[i] })),
    ...(product.video ? [{ kind: "video", src: product.video, poster: images[0] } as Media] : []),
  ];
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  if (media.length <= 1 && !product.video) return <ProductArt product={product} size="lg" priority />;

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
        {media.map((m, i) => (
          <div key={m.src} className="relative aspect-square w-full shrink-0 snap-center bg-white">
            {m.kind === "image" ? (
              <Image src={m.src} alt={`${product.name} photo ${i + 1}`} fill priority={i === 0} quality={90} unoptimized={m.src.startsWith("/api/photo/")} sizes="(max-width: 1024px) 100vw, 50vw" className="photo-enhance object-contain" />
            ) : (
              <video src={m.src} controls playsInline muted preload="metadata" className="h-full w-full bg-black object-contain" aria-label={`${product.name} video`} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
        {media.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-ink" : "w-1.5 bg-stone-300"}`} />)}
      </div>
      <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
        {media.map((m, i) => (
          <button key={m.src} onClick={() => goTo(i)} className={`relative h-20 w-20 overflow-hidden rounded-xl bg-white ring-2 transition ${i === active ? "ring-brand-500" : "ring-transparent opacity-70 hover:opacity-100"}`} aria-label={m.kind === "video" ? "Play video" : `Show photo ${i + 1}`}>
            {m.kind === "image" ? (
              <Image src={m.thumb ?? m.src} alt="" fill sizes="80px" unoptimized={m.src.startsWith("/api/photo/")} className="photo-enhance object-contain" />
            ) : (
              <>
                {m.poster && <Image src={m.poster} alt="" fill sizes="80px" className="object-contain opacity-60" />}
                <span className="absolute inset-0 grid place-items-center bg-ink/40"><Play className="h-7 w-7 fill-white text-white" /></span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

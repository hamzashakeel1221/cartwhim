"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { useCart } from "./cart-provider";

// A scroll-driven 3D showcase built from the product's own photos.
// The section is a tall "track"; a sticky stage inside it stays on screen while the
// photos swing through 3D space as you scroll. Only runs while it is on screen.

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function ProductScroll3D({ product }: { product: Product }) {
  const photos = (product.images ?? []).slice(0, 8);
  const n = photos.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floorRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [caption, setCaption] = useState(0);
  const [reduced, setReduced] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let visible = false;
    let raf = 0;
    let shown = 0; // lerped position, 0..n-1
    let px = 0, py = 0, tpx = 0, tpy = 0; // pointer parallax
    let lastCaption = 0;

    const target = () => {
      const r = track.getBoundingClientRect();
      const range = Math.max(1, r.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -r.top / range));
      const pos = progress * (n - 1);
      const base = Math.min(n - 1, Math.floor(pos));
      const frac = pos - base;
      // dwell on each photo, then swing quickly to the next
      return base >= n - 1 ? n - 1 : base + smooth(0.2, 0.8, frac);
    };

    const frame = () => {
      raf = 0;
      if (!visible) return;
      const t = target();
      shown += (t - shown) * 0.14;
      if (Math.abs(t - shown) < 0.0005) shown = t;
      px += (tpx - px) * 0.08;
      py += (tpy - py) * 0.08;
      const wide = stage.clientWidth;
      const step = Math.min(wide * 0.3, 330);

      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const d = i - shown;
        const a = Math.abs(d);
        const x = d * step;
        const z = -Math.min(a, 3) * 260;
        const ry = Math.max(-1.2, Math.min(1.2, d)) * -34 + px * 6;
        const s = 1 - Math.min(a, 2) * 0.1;
        el.style.transform = `translate3d(${x}px, ${py * -8}px, ${z}px) rotateY(${ry}deg) rotateX(${py * 3}deg) scale(${s})`;
        el.style.opacity = String(Math.max(0, 1 - Math.max(0, a - 0.9) * 0.6));
        el.style.zIndex = String(100 - Math.round(a * 10));
        const sh = shadeRefs.current[i];
        if (sh) sh.style.opacity = String(Math.min(0.55, a * 0.45));
      }
      if (floorRef.current) floorRef.current.style.backgroundPosition = `${-shown * 120}px 0`;
      const idx = Math.round(shown);
      if (idx !== lastCaption) { lastCaption = idx; setCaption(idx); }
      dotRefs.current.forEach((d, i) => {
        if (!d) return;
        d.style.transform = `scaleX(${i === idx ? 1 : 0.35})`;
        d.style.opacity = i === idx ? "1" : "0.4";
      });
      if (shown !== t || Math.abs(tpx - px) > 0.001 || Math.abs(tpy - py) > 0.001) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (visible && !raf) raf = requestAnimationFrame(frame); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }, { rootMargin: "100px" });
    io.observe(track);
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      tpx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tpy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      kick();
    };
    stage.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    shown = target();
    kick();
    return () => {
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n, reduced]);

  const highlights = product.highlights ?? [];
  const caps = photos.map((_, i) => highlights[i] ?? (i === 0 ? product.name : ""));
  const last = caption === n - 1;

  if (reduced) {
    return (
      <section aria-label={`${product.name} photos`} className="mt-14 bg-[#12101f] py-10 text-white">
        <div className="container-x">
          <h2 className="text-xl font-extrabold sm:text-2xl">{product.name}</h2>
          <div className="snap-row mt-5">
            {photos.map((src, i) => (
              <div key={src} className="relative aspect-square w-72 shrink-0 overflow-hidden rounded-2xl bg-white">
                <Image src={src} alt={`${product.name} view ${i + 1}`} fill sizes="288px" unoptimized className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={`${product.name} 3D showcase`} className="mt-14">
      <div ref={trackRef} style={{ height: `${(n + 1) * 80}vh` }} className="relative">
        <div ref={stageRef} className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-[#12101f] text-white">
          {/* backdrop glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(242,98,46,0.28),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1.5px)] [background-size:46px_46px]" />
          {/* floor grid */}
          <div
            ref={floorRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:60px_60px] [mask-image:linear-gradient(to_top,black,transparent)] [transform-origin:bottom] [transform:perspective(500px)_rotateX(62deg)]"
          />

          <div className="absolute inset-x-0 top-36 z-[200] px-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Scroll to explore</p>
            <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h2>
          </div>

          <div className="absolute inset-0 [perspective:1100px]">
            <div className="absolute left-1/2 top-[57%] h-0 w-0 [transform-style:preserve-3d]">
              {photos.map((src, i) => (
                <div
                  key={src}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="absolute -left-[min(29vw,180px)] -top-[min(29vw,180px)] aspect-square w-[min(58vw,360px)] overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.55)] will-change-transform [backface-visibility:hidden]"
                  style={{ transform: `translate3d(${i * 300}px,0,-${Math.min(i, 3) * 260}px)`, opacity: i === 0 ? 1 : 0.5 }}
                >
                  <Image src={src} alt={`${product.name} view ${i + 1}`} fill sizes="420px" unoptimized priority={i === 0} className="object-contain p-3" />
                  <div ref={(el) => { shadeRefs.current[i] = el; }} className="pointer-events-none absolute inset-0 bg-[#12101f] opacity-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-8 z-[200] flex flex-col items-center gap-4 px-5 text-center">
            {last ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-3xl font-extrabold">{formatPKR(product.price)}</p>
                <button
                  onClick={() => add(product.slug, 1, { openDrawer: true })}
                  disabled={product.stock <= 0}
                  className="btn btn-primary"
                >
                  <ShoppingCart className="h-5 w-5" /> {product.stock > 0 ? "Add to cart" : "Sold out"}
                </button>
              </div>
            ) : (
              <p className="min-h-[1.75rem] max-w-md text-base font-medium text-white/85 sm:text-lg" aria-live="polite">{caps[caption]}</p>
            )}
            <div className="flex gap-1.5" aria-hidden>
              {photos.map((_, i) => (
                <span key={i} ref={(el) => { dotRefs.current[i] = el; }} className="h-1.5 w-8 origin-center rounded-full bg-white transition-[opacity] [transform:scaleX(0.35)]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Loads the 3D scene only after the page is ready, so it never slows down the first paint (good for SEO and
// Core Web Vitals). Shoppers who prefer reduced motion, use data saver, or have very weak devices keep the
// static `fallback` instead. The scene pauses when scrolled out of view to save battery.

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

type NavigatorExtras = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

function canUse3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 2) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero3D({ className = "", compact, fallback }: { className?: string; compact?: boolean; fallback?: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!canUse3D()) return;
    const start = () => setEnabled(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 600);
  }, []);

  useEffect(() => {
    if (!enabled || !box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(box.current);
    const t = setTimeout(() => setShown(true), 50);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [enabled]);

  return (
    <div ref={box} className={`relative min-w-0 overflow-hidden ${className}`}>
      {(!enabled || !shown) && fallback}
      {enabled && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}>
          <HeroScene active={visible} compact={compact} />
        </div>
      )}
    </div>
  );
}

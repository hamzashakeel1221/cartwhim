"use client";

import { useRef } from "react";

// 3D tilt that follows the mouse, with a moving glare. Only on devices with a real pointer (no effect on touch),
// and off for people who prefer reduced motion. Children can use `[transform:translateZ(..)]` to pop out.
export function Tilt({ children, className = "", max = 10, glare = true }: { children: React.ReactNode; className?: string; max?: number; glare?: boolean }) {
  const el = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.PointerEvent) {
    if (!el.current || !enabled()) return;
    const r = el.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!el.current) return;
      el.current.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) scale3d(1.02,1.02,1.02)`;
      if (shine.current) {
        shine.current.style.opacity = "1";
        shine.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.35), transparent 55%)`;
      }
    });
  }

  function onLeave() {
    cancelAnimationFrame(frame.current);
    if (el.current) el.current.style.transform = "";
    if (shine.current) shine.current.style.opacity = "0";
  }

  return (
    <div
      ref={el}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative transition-transform duration-300 ease-out [transform-style:preserve-3d] will-change-transform ${className}`}
    >
      {children}
      {glare && <div ref={shine} aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300" />}
    </div>
  );
}

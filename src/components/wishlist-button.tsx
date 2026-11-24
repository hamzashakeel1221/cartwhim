"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "./wishlist-provider";

export function WishlistButton({ slug, className = "", withLabel }: { slug: string; className?: string; withLabel?: boolean }) {
  const { has, toggle } = useWishlist();
  const on = has(slug);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      className={`inline-flex items-center justify-center gap-2 transition active:scale-90 ${className}`}
    >
      <Heart className={`h-5 w-5 transition ${on ? "fill-brand-500 text-brand-500" : "text-ink/70"}`} />
      {withLabel && <span className="text-sm font-semibold">{on ? "Saved" : "Save"}</span>}
    </button>
  );
}

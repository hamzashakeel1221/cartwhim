import { Star } from "lucide-react";

export function Rating({ value, reviews, size = "sm" }: { value: number; reviews?: number; size?: "sm" | "md" }) {
  const s = size === "md" ? "h-4 w-4" : "h-3 w-3 sm:h-3.5 sm:w-3.5";
  return (
    <div className="flex items-center gap-1 whitespace-nowrap" aria-label={`Rated ${value} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`${s} ${i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}`} />
        ))}
      </div>
      <span className="text-[11px] text-stone-500 sm:text-xs">{value.toFixed(1)}{reviews !== undefined && ` (${reviews})`}</span>
    </div>
  );
}

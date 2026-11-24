import { formatPKR } from "@/lib/format";

export function Summary({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <dl className="mt-4 space-y-3 text-sm">
      <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd className="font-semibold">{formatPKR(subtotal)}</dd></div>
      <div className="flex justify-between"><dt className="text-stone-500">Delivery</dt><dd className="font-semibold">{shipping ? formatPKR(shipping) : <span className="text-mint">Free</span>}</dd></div>
      <div className="flex justify-between border-t border-stone-200 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">{formatPKR(total)}</dd></div>
    </dl>
  );
}

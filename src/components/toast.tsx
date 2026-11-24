"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartToast() {
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div role="status" className="fixed inset-x-4 bottom-20 z-50 lg:bottom-4 mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-2xl sm:inset-x-auto sm:right-6">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-mint" />
      <span className="line-clamp-1 flex-1">{toast}</span>
      <Link href="/cart" className="font-semibold text-brand-200 hover:text-white">View cart</Link>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Banknote, Loader2, Lock, Smartphone } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ProductArt } from "@/components/product-art";
import { Summary } from "@/components/summary";
import { formatPKR } from "@/lib/format";
import { pakistanCities } from "@/lib/store-config";

type Errors = Partial<Record<string, string[]>>;

export default function CheckoutPage() {
  const { lines, subtotal, shipping, total, clear, ready } = useCart();
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!ready) return <div className="container-x py-24" />;
  if (!lines.length) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-extrabold">Nothing to check out yet</h1>
        <Link href="/products" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
      });
      const data = (await res.json()) as { id?: string; total?: number; error?: string; fields?: Errors };
      if (!res.ok) {
        setErrors(data.fields ?? {});
        setFormError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/order-success?id=${data.id}&total=${data.total}`);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  const err = (k: string) => errors[k]?.[0] && <p className="mt-1 text-xs font-medium text-red-600">{errors[k]![0]}</p>;

  return (
    <div className="container-x pt-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Checkout</h1>
      <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
            <h2 className="text-lg font-bold">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Full name</span>
                <input name="name" autoComplete="name" className="input mt-1.5" placeholder="Ali Raza" />
                {err("name")}
              </label>
              <label className="block">
                <span className="text-sm font-medium">Mobile number</span>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" className="input mt-1.5" placeholder="0300 1234567" />
                {err("phone")}
              </label>
              <label className="block">
                <span className="text-sm font-medium">Email <span className="text-stone-400">(optional)</span></span>
                <input name="email" type="email" autoComplete="email" className="input mt-1.5" placeholder="you@example.com" />
                {err("email")}
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">City</span>
                <select name="city" defaultValue="" className="input mt-1.5">
                  <option value="" disabled>Select your city</option>
                  {pakistanCities.map((c) => <option key={c}>{c}</option>)}
                </select>
                {err("city")}
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Full address</span>
                <textarea name="address" rows={3} autoComplete="street-address" className="input mt-1.5" placeholder="House #, street, block / area, nearby landmark" />
                {err("address")}
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Order notes <span className="text-stone-400">(optional)</span></span>
                <input name="notes" className="input mt-1.5" placeholder="e.g. call before delivery" />
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
            <h2 className="text-lg font-bold">Payment method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-brand-500 bg-brand-50/50 p-4">
                <input type="radio" name="payment" value="cod" defaultChecked className="h-4 w-4 accent-brand-500" />
                <Banknote className="h-6 w-6 text-brand-600" />
                <div><p className="font-semibold">Cash on Delivery</p><p className="text-sm text-stone-500">Pay the rider in cash when your order arrives.</p></div>
              </label>
              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 p-4 opacity-60">
                <input type="radio" disabled className="h-4 w-4" />
                <Smartphone className="h-6 w-6" />
                <div><p className="font-semibold">JazzCash / Easypaisa / Card</p><p className="text-sm text-stone-500">Coming soon</p></div>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 lg:sticky lg:top-40">
          <h2 className="text-lg font-bold">Your order</h2>
          <ul className="mt-4 space-y-3">
            {lines.map(({ product, qty }) => (
              <li key={product.slug} className="flex items-center gap-3">
                <div className="relative w-14 shrink-0">
                  <ProductArt product={product} />
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">{qty}</span>
                </div>
                <p className="line-clamp-2 flex-1 text-sm">{product.name}</p>
                <p className="text-sm font-semibold">{formatPKR(product.price * qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-stone-200 pt-1"><Summary subtotal={subtotal} shipping={shipping} total={total} /></div>
          {formError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full disabled:opacity-70">
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
            {submitting ? "Placing order..." : `Place order · ${formatPKR(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-stone-500">We will call or WhatsApp you to confirm before dispatch.</p>
        </aside>
      </form>
    </div>
  );
}

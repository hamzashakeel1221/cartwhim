"use client";

import { useState } from "react";
import Link from "next/link";
import { RefreshCw, Search } from "lucide-react";
import { categories } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";

type Variation = { id: number; name: string; status: number; sale_price: number; quantity: number; product_thumbnail: string | null };
type HhcProduct = {
  id: number; name: string; type: "simple" | "variable"; wholesalePrice: number; salePrice: number; pdr: number | null; quantity: number;
  stock_status_name?: string; store_name?: string; store_city?: string; product_thumbnail: string | null; variations?: Variation[];
};

// Products that Pakistani stores were advertising most on Meta (Ads Library, Nov 2026). One tap searches HHC for them.
export const IN_DEMAND = [
  "tummy trimmer", "posture corrector", "lcd writing tablet", "magic calligraphy book", "water drawing book", "busy book",
  "leather wallet", "bike cover", "weighing scale", "luggage scale", "corner rack", "air freshener", "wifi camera",
  "knee warmer", "hair dye stick", "trimmer", "spice grinder", "storage bag", "ac cover", "solar panel brush", "fairy lights", "tool kit",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;
const H = { "x-cartwhim-admin": "1" };
const field = "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500";

// Pricing rule: sell at HHC cost + your margin (Rs. 500 to 1,000), ending in 9.
export const MIN_MARGIN = 500;
export const MAX_MARGIN = 1000;
export function priceFor(cost: number, margin: number) {
  const m = Math.min(MAX_MARGIN, Math.max(MIN_MARGIN, margin));
  const p = Math.ceil((cost + m + 1) / 100) * 100 - 1; // e.g. 423 + 500 → 999
  return p - cost > MAX_MARGIN ? cost + MAX_MARGIN : p;
}
/** The struck-through "was" price: about 45% off, ending in 9. */
export function wasPriceFor(price: number) {
  return Math.ceil((price * 1.8) / 100) * 100 - 1;
}

export function HhcImporter() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ total: number; products: HhcProduct[]; imported: Record<string, string> } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function search(term = q, p = 1) {
    setQ(term);
    setPage(p);
    setBusy("Searching HHC…");
    setMsg(null);
    const res = await fetch(`/admin/api/hhc/search?q=${encodeURIComponent(term)}&page=${p}`, { headers: H });
    const body = (await res.json().catch(() => ({}))) as Loose;
    setBusy(null);
    if (!res.ok) { setMsg({ ok: false, text: body.error ?? "Search failed" }); return; }
    setData(body);
  }

  async function sync() {
    setBusy("Updating stock and costs from HHC…");
    setMsg(null);
    const res = await fetch("/admin/api/hhc/sync", { method: "POST", headers: H });
    const body = (await res.json().catch(() => ({}))) as Loose;
    setBusy(null);
    if (!res.ok) { setMsg({ ok: false, text: body.error ?? "Sync failed" }); return; }
    const parts = [`Checked ${body.checked} HHC products.`];
    if (body.unavailable.length) parts.push(`${body.unavailable.length} out of stock at HHC (stock set to 0): ${body.unavailable.join(", ")}.`);
    if (body.lossMaking.length) parts.push(`Your margin is now under Rs. 500 for: ${body.lossMaking.join(", ")}. Raise those prices.`);
    setMsg({ ok: !body.lossMaking.length, text: parts.join(" ") });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
        <form onSubmit={(e) => { e.preventDefault(); search(); }} className="flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search HHC products, e.g. posture corrector" className={field} />
          <button className="btn btn-primary shrink-0" disabled={!!busy}><Search className="h-4 w-4" /> Search</button>
        </form>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-500">In demand on Meta ads right now</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {IN_DEMAND.map((t) => (
            <button key={t} type="button" onClick={() => search(t)} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700 hover:bg-brand-50 hover:text-brand-700">{t}</button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-stone-100 pt-4">
          <button type="button" onClick={sync} disabled={!!busy} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600"><RefreshCw className="h-4 w-4" /> Update stock &amp; costs from HHC</button>
          <span className="text-xs text-stone-500">Run this daily. Your prices are never changed.</span>
        </div>
      </section>

      {busy && <p className="text-sm text-stone-500">{busy}</p>}
      {msg && <p className={`rounded-2xl px-4 py-3 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>{msg.text}</p>}

      {data && (
        <>
          <p className="text-sm text-stone-500">{data.total} HHC products{q && <> for “{q}”</>}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.products.map((p) => <HhcCard key={p.id} p={p} imported={data.imported} onImported={(sku, slug) => setData({ ...data, imported: { ...data.imported, [sku]: slug } })} />)}
          </div>
          <div className="flex gap-3">
            {page > 1 && <button className="btn" onClick={() => search(q, page - 1)}>← Previous</button>}
            {page * 24 < data.total && <button className="btn" onClick={() => search(q, page + 1)}>Next →</button>}
          </div>
        </>
      )}
    </div>
  );
}

function HhcCard({ p, imported, onImported }: { p: HhcProduct; imported: Record<string, string>; onImported: (sku: string, slug: string) => void }) {
  const variations = (p.variations ?? []).filter((v) => v.status === 1);
  const [variationId, setVariationId] = useState<number | null>(p.type === "variable" ? variations[0]?.id ?? null : null);
  const variation = variations.find((v) => v.id === variationId);
  const cost = Math.round(variation ? variation.sale_price : p.wholesalePrice);
  const stock = variation ? variation.quantity : p.quantity;
  const [margin, setMargin] = useState(String(MIN_MARGIN));
  const price = priceFor(cost, Number(margin) || 0);
  const was = wasPriceFor(price);
  const [category, setCategory] = useState(categories[0].slug);
  const [enhance, setEnhance] = useState(false);
  const [state, setState] = useState<{ busy?: boolean; error?: string }>({});
  const sku = variationId ? `${p.id}-v${variationId}` : String(p.id);
  const done = imported[sku];
  const profit = price - cost;
  const marginOk = Number(margin) >= MIN_MARGIN && Number(margin) <= MAX_MARGIN;

  async function importIt() {
    setState({ busy: true });
    const res = await fetch("/admin/api/hhc/import", {
      method: "POST",
      headers: { ...H, "content-type": "application/json" },
      body: JSON.stringify({ id: p.id, variationId, category, price, compareAt: was, enhance }),
    });
    const body = (await res.json().catch(() => ({}))) as Loose;
    if (!res.ok && !body.slug) { setState({ error: body.error ?? "Import failed" }); return; }
    setState({});
    onImported(sku, body.slug);
  }

  return (
    <div className="flex flex-col rounded-3xl bg-white p-4 ring-1 ring-stone-200/70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {(variation?.product_thumbnail || p.product_thumbnail) ? <img src={variation?.product_thumbnail || p.product_thumbnail!} alt="" className="aspect-square w-full rounded-2xl bg-stone-50 object-contain" /> : <div className="aspect-square rounded-2xl bg-stone-100" />}
      <p className="mt-3 line-clamp-2 font-semibold">{p.name}</p>
      <p className="mt-1 text-xs text-stone-500">{p.store_name}{p.store_city && ` · ${p.store_city}`} · HHC #{p.id}</p>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-stone-50 p-2"><dt className="text-stone-500">HHC cost</dt><dd className="font-bold">{formatPKR(cost)}</dd></div>
        <div className="rounded-xl bg-stone-50 p-2"><dt className="text-stone-500">Stock</dt><dd className="font-bold">{stock}</dd></div>
        <div className="rounded-xl bg-stone-50 p-2"><dt className="text-stone-500">Delivered</dt><dd className="font-bold">{p.pdr != null ? `${Math.round(p.pdr)}%` : "–"}</dd></div>
      </dl>
      {variations.length > 0 && (
        <select value={variationId ?? ""} onChange={(e) => setVariationId(Number(e.target.value))} className={`${field} mt-3`}>
          {variations.map((v) => <option key={v.id} value={v.id}>{v.name} · {formatPKR(v.sale_price)}</option>)}
        </select>
      )}
      <div className="mt-auto pt-3">
        {done ? (
          <Link href={`/admin/products/${done}`} className="btn w-full justify-center">Imported · Edit</Link>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <label className="flex-1 text-xs text-stone-500">Your margin (500–1,000)
                <input value={margin} onChange={(e) => setMargin(e.target.value.replace(/\D/g, ""))} inputMode="numeric" className={`${field} mt-1`} />
              </label>
              <label className="flex-1 text-xs text-stone-500">Category
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${field} mt-1`}>
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-stone-600">
              <input type="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)} />
              Light photo touch-up (white square background, a bit brighter and sharper; product look unchanged)
            </label>
            <p className="text-sm">
              Sells at <b>{formatPKR(price)}</b> <span className="text-stone-400 line-through">{formatPKR(was)}</span>{" "}
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">-{Math.round((1 - price / was) * 100)}%</span>
            </p>
            <p className={`text-xs ${marginOk ? "text-emerald-700" : "text-red-600"}`}>Your margin: {formatPKR(profit)}{!marginOk && " (keep it between 500 and 1,000)"}</p>
            <button onClick={importIt} disabled={state.busy || !marginOk} className="btn btn-primary w-full justify-center">{state.busy ? "Importing…" : "Import to CartWhim"}</button>
            {state.error && <p className="text-xs text-red-600">{state.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

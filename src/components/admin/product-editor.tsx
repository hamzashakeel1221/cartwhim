"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { categories } from "@/lib/catalog";
import { suppliers } from "@/lib/suppliers";
import { uploadPhotos } from "./photo-manager";

type Initial = {
  name: string; category: string; supplier: string; supplierSku: string; cost: string; price: string; compareAt: string; stock: string;
  description: string; highlights: string; trending: boolean; deal: boolean; isNew: boolean; scroll3d: boolean; published: boolean;
};

export const blankProduct: Initial = {
  name: "", category: categories[0].slug, supplier: suppliers[0].id, supplierSku: "", cost: "", price: "", compareAt: "", stock: "50",
  description: "", highlights: "", trending: false, deal: false, isNew: true, scroll3d: true, published: true,
};

const field = "mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500";

export function ProductEditor({ slug, initial = blankProduct }: { slug?: string; initial?: Initial }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const set = <K extends keyof Initial>(k: K, val: Initial[K]) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy("Saving…");
    const body = {
      name: v.name, category: v.category, supplier: v.supplier, supplierSku: v.supplierSku, cost: v.cost, price: v.price, compareAt: v.compareAt, stock: v.stock,
      description: v.description, highlights: v.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: [v.trending && "trending", v.deal && "deal", v.isNew && "new"].filter(Boolean), scroll3d: v.scroll3d, published: v.published,
    };
    const res = await fetch(slug ? `/admin/api/products/${slug}` : "/admin/api/products", {
      method: slug ? "PUT" : "POST", headers: { "content-type": "application/json", "x-cartwhim-admin": "1" }, body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { slug?: string; error?: string };
    if (!res.ok) { setBusy(null); setError(data.error ?? "Could not save"); return; }
    const target = slug ?? data.slug!;
    if (files.length) {
      const err = await uploadPhotos(target, files.slice(0, 8), (d) => setBusy(`Uploading photos ${d}/${files.length}…`));
      if (err) { setBusy(null); setError(`Product saved, but: ${err}`); router.push(`/admin/products/${target}`); return; }
    }
    router.push(slug ? "/admin/products" : `/admin/products/${target}`);
    router.refresh();
  }

  async function remove() {
    if (!slug || !confirm("Delete this product and its photos?")) return;
    setBusy("Deleting…");
    const res = await fetch(`/admin/api/products/${slug}`, { method: "DELETE", headers: { "x-cartwhim-admin": "1" } });
    if (!res.ok) { setBusy(null); setError("Could not delete"); return; }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {!slug && (
        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="font-bold">Photos</h2>
          <p className="mt-1 text-sm text-stone-500">Add 3 or more photos from different angles. The first one is the main photo. We resize them for you.</p>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {files.map((f, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(f)} alt="" className="aspect-square w-full rounded-xl object-contain ring-1 ring-stone-200" />
                <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove" className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-ink text-white"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            {files.length < 8 && (
              <button type="button" onClick={() => picker.current?.click()} className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-stone-300 text-xs text-stone-500 hover:border-brand-500">
                <span className="flex flex-col items-center gap-1"><ImagePlus className="h-5 w-5" />Add</span>
              </button>
            )}
          </div>
          <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => { setFiles([...files, ...Array.from(e.target.files ?? [])].slice(0, 8)); e.target.value = ""; }} />
          {files.length > 0 && files.length < 3 && <p className="mt-3 text-xs text-amber-700">Add at least 3 photos to get the 3D scroll animation.</p>}
        </section>
      )}

      <section className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 sm:grid-cols-2">
        <label className="text-sm font-medium sm:col-span-2">Product name<input required className={field} value={v.name} onChange={(e) => set("name", e.target.value)} /></label>
        <label className="text-sm font-medium">Category
          <select className={field} value={v.category} onChange={(e) => set("category", e.target.value)}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
        </label>
        <label className="text-sm font-medium">Supplier
          <select className={field} value={v.supplier} onChange={(e) => set("supplier", e.target.value)}>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        </label>
        <label className="text-sm font-medium">Selling price (PKR)<input required inputMode="numeric" className={field} value={v.price} onChange={(e) => set("price", e.target.value)} /></label>
        <label className="text-sm font-medium">Old price (PKR, optional)<input inputMode="numeric" className={field} value={v.compareAt} onChange={(e) => set("compareAt", e.target.value)} /></label>
        <label className="text-sm font-medium">Your cost from supplier (PKR, private)<input inputMode="numeric" className={field} value={v.cost} onChange={(e) => set("cost", e.target.value)} /></label>
        <label className="text-sm font-medium">Supplier product code (private)<input className={field} value={v.supplierSku} onChange={(e) => set("supplierSku", e.target.value)} /></label>
        <label className="text-sm font-medium">Stock<input required inputMode="numeric" className={field} value={v.stock} onChange={(e) => set("stock", e.target.value)} /></label>
        <label className="text-sm font-medium sm:col-span-2">Description<textarea required rows={4} className={field} value={v.description} onChange={(e) => set("description", e.target.value)} /></label>
        <label className="text-sm font-medium sm:col-span-2">Highlights (one per line)
          <textarea rows={4} className={field} value={v.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"Fast charging\n1 year warranty"} />
          <span className="mt-1 block text-xs font-normal text-stone-500">These also become the captions in the 3D scroll animation, one per photo.</span>
        </label>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:col-span-2">
          {([["trending", "Trending"], ["deal", "Deal"], ["isNew", "New arrival"]] as const).map(([k, l]) => (
            <label key={k} className="inline-flex items-center gap-2"><input type="checkbox" checked={v[k]} onChange={(e) => set(k, e.target.checked)} />{l}</label>
          ))}
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={v.scroll3d} onChange={(e) => set("scroll3d", e.target.checked)} />Show 3D scroll animation</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} />Visible in store</label>
        </div>
      </section>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      <div className="flex items-center gap-3">
        <button disabled={!!busy} className="btn btn-primary disabled:opacity-60">{busy ?? (slug ? "Save changes" : "Create product")}</button>
        {slug && <button type="button" onClick={remove} disabled={!!busy} className="btn btn-ghost text-red-600">Delete product</button>}
      </div>
    </form>
  );
}

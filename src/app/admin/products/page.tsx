import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategory } from "@/lib/catalog";
import { formatPKR } from "@/lib/format";
import { listAdminProducts } from "@/lib/product-store";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata = { title: "Products (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const { ready, products } = await listAdminProducts();
  return (
    <div className="container-x pt-10">
      <AdminNav active="products" />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} products. Add photos to any product; with 3 or more, its page gets the 3D scroll animation.</p>
        </div>
        {ready && <Link href="/admin/products/new" className="btn btn-primary"><Plus className="h-5 w-5" /> Add product</Link>}
      </div>
      {!ready && (
        <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          The database has not been updated yet, so adding products is switched off. Run <code className="rounded bg-white px-1.5 py-0.5">npm run db:migrate:remote</code> once, then reload this page.
        </p>
      )}
      <div className="mt-6 divide-y divide-stone-200 overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70">
        {products.map((p) => (
          <div key={p.slug} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.thumbs?.[0] || p.images?.[0] ? <img src={p.thumbs?.[0] ?? p.images![0]} alt="" className="h-12 w-12 rounded-lg object-contain ring-1 ring-stone-200" /> : <span className="grid h-12 w-12 place-items-center rounded-lg bg-stone-100 text-xs text-stone-400">No photo</span>}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.name}</p>
              <p className="text-xs text-stone-500">{getCategory(p.category)?.name} · {formatPKR(p.price)} · {p.photoCount} photo{p.photoCount === 1 ? "" : "s"}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className={`rounded-full px-2.5 py-1 ${p.fromAdmin ? "bg-brand-50 text-brand-700" : "bg-stone-100 text-stone-600"}`}>{p.fromAdmin ? "Added here" : "Built-in"}</span>
              {p.photoCount >= 3 && p.scroll3d !== false && <span className="rounded-full bg-ink px-2.5 py-1 text-white">3D</span>}
              {!p.published && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">Hidden</span>}
            </div>
            <div className="flex gap-3 text-sm font-semibold">
              {ready && <Link href={`/admin/products/${p.slug}`} className="text-brand-600">{p.fromAdmin ? "Edit" : "Photos"}</Link>}
              {p.published && <Link href={`/products/${p.slug}`} className="text-stone-500">View</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

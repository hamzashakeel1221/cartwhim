import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoManager } from "@/components/admin/photo-manager";
import { ProductEditor } from "@/components/admin/product-editor";
import { products as builtIn } from "@/lib/catalog";
import { getAdminProduct, listPhotos } from "@/lib/product-store";

export const metadata = { title: "Edit product (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const base = builtIn.find((p) => p.slug === slug);
  const mine = base ? null : await getAdminProduct(slug).catch(() => null);
  if (!base && !mine) notFound();
  const photos = await listPhotos(slug).catch(() => []);
  const name = (base ?? mine)!.name;

  return (
    <div className="container-x max-w-3xl pt-10">
      <Link href="/admin/products" className="text-sm font-semibold text-stone-500 hover:text-ink">← Products</Link>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{name}</h1>
      <section className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
        <h2 className="mb-4 font-bold">Photos</h2>
        <PhotoManager slug={slug} photos={photos} builtInCount={base?.images?.length ?? 0} />
      </section>
      {base ? (
        <p className="mt-6 text-sm text-stone-500">This is a built-in product, so its details are edited in <code>src/lib/catalog.ts</code>. You can still change its photos here.</p>
      ) : (
        <div className="mt-6">
          <ProductEditor
            slug={slug}
            initial={{
              name: mine!.name, category: mine!.category, supplier: mine!.supplier, supplierSku: mine!.supplierSku ?? "", cost: mine!.cost?.toString() ?? "",
              price: String(mine!.price), compareAt: mine!.compareAt?.toString() ?? "", stock: String(mine!.stock), description: mine!.description,
              highlights: mine!.highlights.join("\n"), trending: !!mine!.tags?.includes("trending"), deal: !!mine!.tags?.includes("deal"), isNew: !!mine!.tags?.includes("new"),
              scroll3d: mine!.scroll3d !== false, published: mine!.published,
            }}
          />
        </div>
      )}
    </div>
  );
}

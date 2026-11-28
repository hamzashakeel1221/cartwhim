import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";
import { guardAdmin } from "@/lib/admin-guard";
import { categories } from "@/lib/catalog";
import { getHhcProduct, hhcCostAndStock, hhcSku, HhcError, htmlToText } from "@/lib/hhc";
import { addPhoto, createProduct, listSupplierProducts, MAX_PHOTOS, sniffImage } from "@/lib/product-store";

const schema = z.object({
  id: z.number().int().positive(),
  variationId: z.number().int().positive().nullable().optional(),
  category: z.string(),
  price: z.number().int().min(1).max(10_000_000),
  compareAt: z.number().int().min(0).max(10_000_000).nullable().optional(),
  name: z.string().trim().min(3).max(120).optional(),
  published: z.boolean().default(true),
  enhance: z.boolean().default(false),
});

const MAX_PHOTO_BYTES = 1_800_000;

// Optional light touch-up with Cloudflare Images: square white canvas, slightly brighter, a touch more contrast and
// sharpness. It never crops, recolours or reshapes the product, so it still looks exactly like what the customer gets.
async function touchUp(data: ArrayBuffer): Promise<{ data: ArrayBuffer; thumb: ArrayBuffer } | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const run = async (size: number) => {
      if (!env.IMAGES) throw new Error("No Images binding");
      const out = await env.IMAGES.input(new Response(data).body!)
        .transform({ width: size, height: size, fit: "pad", background: "#ffffff", brightness: 1.05, contrast: 1.05, sharpen: 1 })
        .output({ format: "image/webp", quality: 85 });
      return out.response().arrayBuffer();
    };
    const [big, small] = await Promise.all([run(1200), run(560)]);
    return big.byteLength <= MAX_PHOTO_BYTES ? { data: big, thumb: small } : null;
  } catch (e) {
    console.warn("Photo touch-up failed, keeping the original", e);
    return null;
  }
}

export async function POST(req: Request) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const v = parsed.data;
  if (!categories.some((c) => c.slug === v.category)) return NextResponse.json({ error: "Choose a category" }, { status: 400 });

  try {
    const p = await getHhcProduct(v.id);
    if (!p) return NextResponse.json({ error: "HHC no longer lists this product" }, { status: 404 });
    if (p.type === "variable" && !v.variationId) return NextResponse.json({ error: "Choose a variation" }, { status: 400 });
    const sku = hhcSku(p.id, v.variationId);
    const existing = (await listSupplierProducts("hhc")).find((l) => l.supplierSku === sku);
    if (existing) return NextResponse.json({ error: "Already imported", slug: existing.slug }, { status: 409 });

    const { cost, stock } = hhcCostAndStock(p, v.variationId ?? null);
    if (v.price <= cost) return NextResponse.json({ error: `Your price must be above HHC's cost (Rs. ${cost})` }, { status: 400 });
    const variation = v.variationId ? p.variations?.find((x) => x.id === v.variationId) : undefined;
    let description = htmlToText(p.description).slice(0, 3000);
    if (description.length < 10) description = `${p.name}. Cash on delivery all over Pakistan.`;

    const slug = await createProduct({
      name: (v.name ?? (variation ? `${p.name} (${variation.name})` : p.name)).slice(0, 120),
      category: v.category,
      supplier: "hhc",
      supplierSku: sku,
      cost,
      price: v.price,
      compareAt: v.compareAt && v.compareAt > v.price ? v.compareAt : null,
      stock,
      description,
      highlights: [],
      tags: ["new"],
      scroll3d: true,
      published: v.published,
    });

    // Copy the supplier's photos into our own storage so the store never depends on HHC's image links.
    const urls = [variation?.product_thumbnail, p.product_thumbnail, ...(p.product_galleries ?? [])]
      .filter((u): u is string => typeof u === "string" && /^https:\/\//.test(u));
    let photos = 0;
    for (const url of [...new Set(urls)]) {
      if (photos >= MAX_PHOTOS) break;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.arrayBuffer();
        if (data.byteLength > MAX_PHOTO_BYTES) continue;
        const mime = sniffImage(new Uint8Array(data));
        if (!mime) continue;
        const better = v.enhance ? await touchUp(data) : null;
        const added = better ? await addPhoto(slug, "image/webp", better.data, better.thumb) : await addPhoto(slug, mime, data, null);
        if ("id" in added) photos++;
      } catch (e) {
        console.warn("Could not copy HHC photo", url, e);
      }
    }
    return NextResponse.json({ slug, photos });
  } catch (e) {
    console.error("HHC import failed", e);
    if (e instanceof HhcError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Could not import. Has the database been updated (npm run db:migrate:remote)?" }, { status: 500 });
  }
}

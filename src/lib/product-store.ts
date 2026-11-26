import "server-only";
import { cache } from "react";
import { db } from "./db";
import {
  categories,
  emptyOverlay,
  mergeCatalog,
  productPhotoUrl,
  products as builtIn,
  type CatalogOverlay,
  type Product,
} from "./catalog";

// Products and photos added in /admin/products live in Cloudflare D1 (migrations/0003_products.sql).
// Every read falls back to the built-in catalog if the tables are missing (for example in the short gap between
// a deploy and its migration), so the storefront never breaks because of this feature.

export type ProductInput = {
  name: string;
  category: string;
  supplier: string;
  supplierSku?: string;
  cost?: number | null;
  price: number;
  compareAt?: number | null;
  stock: number;
  description: string;
  highlights: string[];
  tags: ("trending" | "deal" | "new")[];
  scroll3d: boolean;
  published: boolean;
};

type ProductRow = {
  slug: string; name: string; category: string; supplier: string; supplier_sku: string | null; cost: number | null;
  price: number; compare_at: number | null; stock: number; description: string; highlights: string; tags: string;
  scroll3d: number; published: number; created_at: string;
};

export const MAX_PHOTOS = 8;

function parseList<T>(json: string): T[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function rowToProduct(r: ProductRow): Product {
  return {
    slug: r.slug,
    name: r.name,
    category: r.category,
    supplier: r.supplier,
    supplierSku: r.supplier_sku ?? undefined,
    cost: r.cost ?? undefined,
    price: r.price,
    compareAt: r.compare_at ?? undefined,
    rating: 0, // new products have no reviews yet; the storefront shows "New" instead of stars
    reviews: 0,
    stock: r.stock,
    icon: categories.find((c) => c.slug === r.category)?.icon ?? "package",
    description: r.description,
    highlights: parseList<string>(r.highlights),
    tags: parseList<"trending" | "deal" | "new">(r.tags),
    scroll3d: r.scroll3d === 1,
    fromAdmin: true,
  };
}

/** Admin products + uploaded photos, cached for the length of one request. */
export const getOverlay = cache(async (): Promise<CatalogOverlay> => {
  try {
    const d = await db();
    const [prods, photos] = await d.batch([
      d.prepare(`SELECT * FROM products WHERE published = 1 ORDER BY created_at DESC`),
      d.prepare(`SELECT id, product_slug FROM product_photos ORDER BY product_slug, position, created_at`),
    ]);
    const photoMap: CatalogOverlay["photos"] = {};
    for (const p of photos.results as { id: string; product_slug: string }[]) {
      (photoMap[p.product_slug] ??= { images: [], thumbs: [] }).images.push(productPhotoUrl(p.id));
      photoMap[p.product_slug].thumbs.push(productPhotoUrl(p.id, true));
    }
    return { added: (prods.results as ProductRow[]).map(rowToProduct), photos: photoMap };
  } catch (e) {
    console.error("Could not load admin products (is migration 0003 applied?)", e);
    return emptyOverlay;
  }
});

/** Every product shown in the store: admin products first, then the built-in catalog. */
export const getCatalog = cache(async (): Promise<Product[]> => mergeCatalog(await getOverlay()));

export async function findProduct(slug: string): Promise<Product | undefined> {
  return (await getCatalog()).find((p) => p.slug === slug);
}

export async function productsInCategory(category: string): Promise<Product[]> {
  return (await getCatalog()).filter((p) => p.category === category);
}

// ───────────── admin ─────────────

export type AdminProduct = Product & { published: boolean; photoCount: number };

/** Everything, including hidden admin products, for the admin list. Returns `ready: false` if the tables are missing. */
export async function listAdminProducts(): Promise<{ ready: boolean; products: AdminProduct[] }> {
  try {
    const d = await db();
    const [prods, photos] = await d.batch([
      d.prepare(`SELECT * FROM products ORDER BY created_at DESC`),
      d.prepare(`SELECT id, product_slug FROM product_photos ORDER BY product_slug, position, created_at`),
    ]);
    const photoMap: CatalogOverlay["photos"] = {};
    for (const p of photos.results as { id: string; product_slug: string }[]) {
      (photoMap[p.product_slug] ??= { images: [], thumbs: [] }).images.push(productPhotoUrl(p.id));
      photoMap[p.product_slug].thumbs.push(productPhotoUrl(p.id, true));
    }
    const attach = (p: Product, published: boolean): AdminProduct => {
      const ph = photoMap[p.slug];
      const merged = ph?.images.length ? { ...p, images: ph.images, thumbs: ph.thumbs } : p;
      return { ...merged, published, photoCount: merged.images?.length ?? 0 };
    };
    return {
      ready: true,
      products: [
        ...(prods.results as ProductRow[]).map((r) => attach(rowToProduct(r), r.published === 1)),
        ...builtIn.map((p) => attach(p, true)),
      ],
    };
  } catch (e) {
    console.error("Admin products unavailable", e);
    return { ready: false, products: builtIn.map((p) => ({ ...p, published: true, photoCount: p.images?.length ?? 0 })) };
  }
}

export type AdminPhoto = { id: string; url: string; thumb: string };

export async function listPhotos(slug: string): Promise<AdminPhoto[]> {
  const d = await db();
  const { results } = await d.prepare(`SELECT id FROM product_photos WHERE product_slug = ? ORDER BY position, created_at`).bind(slug).all<{ id: string }>();
  return results.map((r) => ({ id: r.id, url: productPhotoUrl(r.id), thumb: productPhotoUrl(r.id, true) }));
}

export async function getAdminProduct(slug: string): Promise<(Product & { published: boolean }) | null> {
  const d = await db();
  const row = await d.prepare(`SELECT * FROM products WHERE slug = ?`).bind(slug).first<ProductRow>();
  return row ? { ...rowToProduct(row), published: row.published === 1 } : null;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "") || "product";
}

async function uniqueSlug(name: string) {
  const d = await db();
  const base = slugify(name);
  for (let i = 0; i < 50; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    if (builtIn.some((p) => p.slug === slug)) continue;
    const hit = await d.prepare(`SELECT 1 AS x FROM products WHERE slug = ?`).bind(slug).first();
    if (!hit) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function createProduct(input: ProductInput): Promise<string> {
  const d = await db();
  const slug = await uniqueSlug(input.name);
  const now = new Date().toISOString();
  await d
    .prepare(
      `INSERT INTO products (slug, name, category, supplier, supplier_sku, cost, price, compare_at, stock, description, highlights, tags, scroll3d, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      slug, input.name, input.category, input.supplier, input.supplierSku || null, input.cost ?? null, input.price, input.compareAt ?? null,
      input.stock, input.description, JSON.stringify(input.highlights), JSON.stringify(input.tags), input.scroll3d ? 1 : 0, input.published ? 1 : 0, now, now,
    )
    .run();
  return slug;
}

export async function updateProduct(slug: string, input: ProductInput): Promise<boolean> {
  const d = await db();
  const res = await d
    .prepare(
      `UPDATE products SET name = ?, category = ?, supplier = ?, supplier_sku = ?, cost = ?, price = ?, compare_at = ?, stock = ?, description = ?,
         highlights = ?, tags = ?, scroll3d = ?, published = ?, updated_at = ? WHERE slug = ?`,
    )
    .bind(
      input.name, input.category, input.supplier, input.supplierSku || null, input.cost ?? null, input.price, input.compareAt ?? null, input.stock,
      input.description, JSON.stringify(input.highlights), JSON.stringify(input.tags), input.scroll3d ? 1 : 0, input.published ? 1 : 0, new Date().toISOString(), slug,
    )
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  const d = await db();
  const [, res] = await d.batch([
    d.prepare(`DELETE FROM product_photos WHERE product_slug = ?`).bind(slug),
    d.prepare(`DELETE FROM products WHERE slug = ?`).bind(slug),
  ]);
  return (res.meta.changes ?? 0) > 0;
}

// ───────────── photos ─────────────

export type PhotoMime = "image/jpeg" | "image/png" | "image/webp";

/** Identify an image by its first bytes, so only real JPEG / PNG / WebP files are ever stored or served. */
export function sniffImage(bytes: Uint8Array): PhotoMime | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  return null;
}

export async function addPhoto(slug: string, mime: PhotoMime, data: ArrayBuffer, thumb: ArrayBuffer | null): Promise<{ id: string } | { error: string }> {
  const d = await db();
  const count = await d.prepare(`SELECT COUNT(*) AS n, COALESCE(MAX(position), -1) AS last FROM product_photos WHERE product_slug = ?`).bind(slug).first<{ n: number; last: number }>();
  if ((count?.n ?? 0) >= MAX_PHOTOS) return { error: `A product can have up to ${MAX_PHOTOS} photos.` };
  const id = crypto.randomUUID();
  await d
    .prepare(`INSERT INTO product_photos (id, product_slug, position, mime, data, thumb, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, slug, (count?.last ?? -1) + 1, mime, data, thumb, new Date().toISOString())
    .run();
  return { id };
}

export async function deletePhoto(id: string): Promise<boolean> {
  const d = await db();
  const res = await d.prepare(`DELETE FROM product_photos WHERE id = ?`).bind(id).run();
  return (res.meta.changes ?? 0) > 0;
}

/** Move one photo to the front (it becomes the main photo). */
export async function makeMainPhoto(id: string): Promise<boolean> {
  const d = await db();
  const row = await d.prepare(`SELECT product_slug FROM product_photos WHERE id = ?`).bind(id).first<{ product_slug: string }>();
  if (!row) return false;
  const { results } = await d.prepare(`SELECT id FROM product_photos WHERE product_slug = ? ORDER BY position, created_at`).bind(row.product_slug).all<{ id: string }>();
  const order = [id, ...results.map((r) => r.id).filter((x) => x !== id)];
  await d.batch(order.map((pid, i) => d.prepare(`UPDATE product_photos SET position = ? WHERE id = ?`).bind(i, pid)));
  return true;
}

export async function readPhoto(id: string, thumb: boolean): Promise<{ mime: string; data: ArrayBuffer } | null> {
  const d = await db();
  const row = await d.prepare(`SELECT mime, data, thumb FROM product_photos WHERE id = ?`).bind(id).first<{ mime: string; data: ArrayBuffer | number[]; thumb: ArrayBuffer | number[] | null }>();
  if (!row) return null;
  const raw = thumb && row.thumb ? row.thumb : row.data;
  const data = raw instanceof ArrayBuffer ? raw : new Uint8Array(raw as number[]).buffer;
  // The thumbnail can be a different format from the main photo, so identify the bytes we are about to serve.
  return { mime: sniffImage(new Uint8Array(data)) ?? row.mime, data };
}

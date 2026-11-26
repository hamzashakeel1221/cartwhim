import type { MetadataRoute } from "next";
import { categories } from "@/lib/catalog";
import { getCatalog } from "@/lib/product-store";
import { abs } from "@/lib/seo";

// Built per request so products added in the admin are listed.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();
  const now = new Date();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: abs("/products"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: abs("/categories"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...categories.map((c) => ({ url: abs(`/category/${c.slug}`), lastModified: now, changeFrequency: "daily" as const, priority: 0.9 })),
    ...products.map((p) => ({
      url: abs(`/products/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images?.map(abs),
    })),
    { url: abs("/policies"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: abs("/track-order"), lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}

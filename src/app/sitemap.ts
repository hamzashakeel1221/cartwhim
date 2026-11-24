import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { abs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
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

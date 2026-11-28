// Store catalog: categories and the built-in products (see lib/hhc-products.ts).
// `supplier`, `supplierSku` and `cost` are internal and never shown to shoppers.

import { hhcProducts } from "./hhc-products";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  icon: string; // lucide icon name, see components/icon.tsx
  hue: string; // tailwind gradient classes for placeholder art
  intro: string; // SEO text shown on the category page
  keywords: string[];
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  supplier: string; // id from lib/suppliers.ts
  supplierSku?: string; // the product code on the supplier's catalog
  cost?: number; // PKR, what the supplier charges you (for profit tracking)
  price: number; // PKR
  compareAt?: number; // PKR, original price for showing a discount
  rating: number;
  reviews: number;
  stock: number;
  icon: string;
  images?: string[]; // real product photos go here (put files in /public/products), or upload them in /admin/products
  thumbs?: string[]; // small versions of the uploaded photos, for product cards
  scroll3d?: boolean; // set false to hide the 3D scroll section (it shows when a product has 3 or more photos)
  fromAdmin?: boolean; // true for products created in /admin/products
  video?: string; // product video (mp4), shown after the photos in the gallery
  shipsFrom?: "Karachi" | "Lahore"; // supplier warehouse city, used for the delivery estimate
  description: string;
  highlights: string[];
  tags?: ("trending" | "deal" | "new")[];
};

export const categories: Category[] = [
  { slug: "electronics", name: "Gadgets & Electronics", blurb: "Bike pumps and travel scales", icon: "headphones", hue: "from-sky-100 to-indigo-200",
    intro: "Handy gadgets like digital luggage scales and mini air pumps for bikes and cycles, at the best prices in Pakistan. Cash on Delivery and 7 day easy returns.",
    keywords: ["luggage scale price in Pakistan","digital luggage scale 50kg","mini air pump for bike"],
  },
  { slug: "home-kitchen", name: "Home & Kitchen", blurb: "Smart tools for every ghar", icon: "chef-hat", hue: "from-amber-100 to-orange-200",
    intro: "Kitchen scales, salt and pepper grinders, bathroom corner racks, drawer organizers, AC and bike covers and more for your home. Order online with Cash on Delivery anywhere in Pakistan.",
    keywords: ["kitchen weighing scale price in Pakistan","bike cover","ac cover 1.5 ton","bathroom corner rack"],
  },
  { slug: "fashion", name: "Fashion & Accessories", blurb: "Bracelets and bike masks", icon: "shopping-bag", hue: "from-rose-100 to-pink-200",
    intro: "Stainless steel bracelets and windproof bike face masks at prices that make sense. Fast delivery to Karachi, Lahore, Islamabad and 50+ cities with Cash on Delivery.",
    keywords: ["stainless steel bracelet for women","bike face mask","winter bike mask Pakistan"],
  },
  { slug: "beauty", name: "Beauty & Personal Care", blurb: "Grooming and skincare", icon: "sparkles", hue: "from-fuchsia-100 to-purple-200",
    intro: "T9 trimmers and instant hair colour sticks for quick grooming at home. Quality checked, delivered to your door, pay when it arrives.",
    keywords: ["T9 trimmer price in Pakistan","hair colour stick","root touch up stick"],
  },
  { slug: "kids-toys", name: "Kids & Toys", blurb: "Fun that keeps them busy", icon: "baby", hue: "from-lime-100 to-emerald-200",
    intro: "LCD writing tablets, magic practice books, water drawing books and busy books that keep kids learning without screens. Delivered nationwide with Cash on Delivery.",
    keywords: ["LCD writing tablet price in Pakistan","sank magic book","magic water book","busy book for kids"],
  },
  { slug: "health-fitness", name: "Health & Fitness", blurb: "Stay active at home", icon: "dumbbell", hue: "from-teal-100 to-cyan-200",
    intro: "Stay fit at home with tummy trimmers, folding pedal exercisers and knee warmers. Affordable fitness gear delivered all over Pakistan.",
    keywords: ["tummy trimmer price in Pakistan","pedal exerciser","knee warmers"],
  },
];

// Every product sold on CartWhim. Admin-added products are merged in by mergeCatalog().
export const products: Product[] = [...hhcProducts];

// Products created in /admin/products, and photos uploaded there. Loaded from the database by lib/product-store.ts.
export type CatalogOverlay = {
  added: Product[];
  photos: Record<string, { images: string[]; thumbs: string[] }>; // keyed by product slug, also for products in this file
};

export const emptyOverlay: CatalogOverlay = { added: [], photos: {} };

// Built-in products plus whatever was added in the admin. Uploaded photos replace the built-in `images`.
export function mergeCatalog(overlay: CatalogOverlay): Product[] {
  const withPhotos = (p: Product): Product => {
    const ph = overlay.photos[p.slug];
    return ph?.images.length ? { ...p, images: ph.images, thumbs: ph.thumbs } : p;
  };
  return [...overlay.added.map(withPhotos), ...products.map(withPhotos)];
}

// Built-in products only. Pages should use getCatalog() (server) or useCatalog() (client) so admin products are included.
export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

// The 3D scroll section appears on product pages with 3 or more photos.
export function hasScroll3d(p: Product) {
  return p.scroll3d !== false && (p.images?.length ?? 0) >= 3;
}

export const productPhotoUrl = (id: string, thumb = false) => `/api/photo/${id}${thumb ? "?s=thumb" : ""}`;

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoryHue(slug: string) {
  return getCategory(slug)?.hue ?? "from-zinc-100 to-zinc-200";
}

export function productsIn(categorySlug: string) {
  return products.filter((p) => p.category === categorySlug);
}

// Public product code shown to shoppers and used in structured data.
export function productSku(p: Product) {
  return "CW-" + p.slug.split("-").map((w) => w[0]).join("").toUpperCase().slice(0, 6) + String(p.price).slice(-3);
}

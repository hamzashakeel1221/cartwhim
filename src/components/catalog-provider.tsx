"use client";

import { createContext, useContext, useMemo } from "react";
import { mergeCatalog, type CatalogOverlay, type Product } from "@/lib/catalog";

type CatalogState = { products: Product[]; getProduct: (slug: string) => Product | undefined };

const CatalogContext = createContext<CatalogState | null>(null);

// Gives client components (cart, search, wishlist...) the full catalog: built-in products plus the ones added in the admin.
export function CatalogProvider({ overlay, children }: { overlay: CatalogOverlay; children: React.ReactNode }) {
  const value = useMemo<CatalogState>(() => {
    const products = mergeCatalog(overlay);
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    return { products, getProduct: (slug) => bySlug.get(slug) };
  }, [overlay]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside CatalogProvider");
  return ctx;
}

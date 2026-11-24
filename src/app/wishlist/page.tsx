"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { useWishlist } from "@/components/wishlist-provider";
import { getProduct, type Product } from "@/lib/catalog";

export default function WishlistPage() {
  const { slugs, ready } = useWishlist();
  const list = slugs.map(getProduct).filter((p): p is Product => Boolean(p));
  return (
    <div className="container-x pt-6">
      <title>Wishlist | CartWhim</title>
      <meta name="robots" content="noindex" />
      <h1 className="text-3xl font-extrabold tracking-tight">Wishlist</h1>
      {!ready ? null : list.length ? (
        <div className="mt-6"><ProductGrid list={list} /></div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-500"><Heart className="h-9 w-9" /></span>
          <p className="mt-5 text-lg font-bold">Nothing saved yet</p>
          <p className="mt-1 text-sm text-stone-500">Tap the heart on any product to save it here.</p>
          <Link href="/products" className="btn btn-primary mt-6">Discover products</Link>
        </div>
      )}
    </div>
  );
}

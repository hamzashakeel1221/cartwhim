import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/icon";
import { categories, productsIn } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All categories",
  description: "Browse all CartWhim categories: gadgets, home & kitchen, fashion, beauty, kids and fitness. Cash on Delivery all over Pakistan.",
  alternates: { canonical: "/categories" },
};

export default function Categories() {
  return (
    <div className="container-x pt-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Categories</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className={`group flex items-center gap-4 rounded-3xl bg-gradient-to-br ${c.hue} p-4 transition hover:-translate-y-0.5 hover:shadow-lg`}>
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/70"><Icon name={c.icon} className="h-8 w-8" /></span>
            <div className="flex-1">
              <p className="font-bold">{c.name}</p>
              <p className="text-sm text-ink/60">{productsIn(c.slug).length} products · {c.blurb}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-ink/40 transition group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}

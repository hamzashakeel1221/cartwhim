import Link from "next/link";
import { categories } from "@/lib/catalog";
import { store } from "@/lib/store-config";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-stone-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-400">
            {store.tagline} Shop gadgets, home essentials, fashion and more, delivered to your door anywhere in Pakistan.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/products?category=${c.slug}`} className="hover:text-white">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Help</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/track-order" className="hover:text-white">Track your order</Link></li>
            <li><Link href="/policies#shipping" className="hover:text-white">Shipping & delivery</Link></li>
            <li><Link href="/policies#returns" className="hover:text-white">Returns & refunds</Link></li>
            <li><Link href="/policies#cod" className="hover:text-white">Cash on Delivery</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`https://wa.me/${store.whatsappNumber}`} className="hover:text-white">WhatsApp: {store.supportPhone}</a></li>
            <li><a href={`mailto:${store.supportEmail}`} className="hover:text-white">{store.supportEmail}</a></li>
            <li className="text-stone-400">Mon to Sat, 10am to 7pm</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {["Cash on Delivery", "JazzCash", "Easypaisa", "Bank Transfer"].map((m) => (
              <span key={m} className="rounded-md border border-white/15 px-2 py-1">{m}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-5 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
          <p>Prices in Pakistani Rupees (PKR), inclusive of all taxes.</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export function AdminNav({ active }: { active: "orders" | "products" | "hhc" }) {
  const item = (href: string, label: string, on: boolean) => (
    <Link href={href} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${on ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:text-ink"}`}>{label}</Link>
  );
  return <nav className="flex gap-2">{item("/admin/orders", "Orders", active === "orders")}{item("/admin/products", "Products", active === "products")}{item("/admin/hhc", "HHC import", active === "hhc")}</nav>;
}

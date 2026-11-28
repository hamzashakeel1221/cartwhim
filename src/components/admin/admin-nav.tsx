import Link from "next/link";

type Section = "dashboard" | "orders" | "customers" | "products" | "hhc";

const links: [Section, string, string][] = [
  ["dashboard", "/admin", "Dashboard"],
  ["orders", "/admin/orders", "Orders"],
  ["customers", "/admin/customers", "Customers"],
  ["products", "/admin/products", "Products"],
  ["hhc", "/admin/hhc", "HHC import"],
];

export function AdminNav({ active }: { active: Section }) {
  return (
    <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
      {links.map(([key, href, label]) => (
        <Link
          key={key}
          href={href}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${active === key ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:text-ink"}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

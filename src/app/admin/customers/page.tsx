import Link from "next/link";
import { Search } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { customers as toCustomers, pct } from "@/lib/analytics";
import { formatPKR } from "@/lib/format";
import { ordersSince } from "@/lib/orders";

export const metadata = { title: "Customers (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

type Sort = "recent" | "orders" | "spent" | "returns";

export default async function AdminCustomers({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const sp = await searchParams;
  const sort: Sort = (["recent", "orders", "spent", "returns"] as const).includes(sp.sort as Sort) ? (sp.sort as Sort) : "recent";
  const all = toCustomers(await ordersSince(null, 5000));
  const q = sp.q?.trim().toLowerCase();
  const digits = q?.replace(/\D/g, "");
  let list = all.filter((c) => !q || `${c.name} ${c.city} ${c.email ?? ""}`.toLowerCase().includes(q) || (digits && digits.length >= 4 && c.phone.replace(/\D/g, "").includes(digits)));
  if (sort === "orders") list = [...list].sort((a, b) => b.orders - a.orders);
  if (sort === "spent") list = [...list].sort((a, b) => b.spent - a.spent);
  if (sort === "returns") list = [...list].sort((a, b) => b.returned - a.returned || (b.returnRate ?? 0) - (a.returnRate ?? 0));

  const repeat = all.filter((c) => c.orders > 1).length;
  const risky = all.filter((c) => c.returned >= 2 || (c.returnRate ?? 0) >= 0.5).length;
  const spent = all.reduce((s, c) => s + c.spent, 0);
  const dt = (iso: string) => new Date(iso).toLocaleDateString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium" });
  const sortLink = (s: Sort, label: string) => (
    <Link href={`/admin/customers?sort=${s}${sp.q ? `&q=${encodeURIComponent(sp.q)}` : ""}`} className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${sort === s ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200"}`}>{label}</Link>
  );

  return (
    <div className="container-x pb-16 pt-10">
      <AdminNav active="customers" />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Customers</h1>
      <p className="mt-1 text-sm text-stone-500">Everyone who has ordered, grouped by phone number.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Customers" value={String(all.length)} />
        <Stat label="Ordered more than once" value={`${repeat} · ${pct(all.length ? repeat / all.length : null)}`} />
        <Stat label="Average spent (delivered)" value={formatPKR(all.length ? Math.round(spent / all.length) : 0)} />
        <Stat label="Often return orders" value={String(risky)} hint="2+ returns, or half their orders" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <form className="flex min-w-[260px] flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-stone-200 sm:max-w-md" action="/admin/customers">
          <Search className="h-4 w-4 text-stone-400" />
          <input type="hidden" name="sort" value={sort} />
          <input name="q" defaultValue={sp.q} placeholder="Search name, phone, city" className="w-full bg-transparent text-sm outline-none" />
        </form>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {sortLink("recent", "Latest")}{sortLink("orders", "Most orders")}{sortLink("spent", "Top spenders")}{sortLink("returns", "Most returns")}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl bg-white ring-1 ring-stone-200/70">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="font-semibold">City</th>
              <th className="text-right font-semibold">Orders</th>
              <th className="text-right font-semibold">Delivered</th>
              <th className="text-right font-semibold">Returned</th>
              <th className="text-right font-semibold">Spent</th>
              <th className="pl-4 font-semibold">Last order</th>
              <th className="pr-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {list.map((c) => (
              <tr key={c.phone}>
                <td className="px-4 py-3">
                  <p className="font-medium">{c.name}{c.accountId && <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">Account</span>}</p>
                  <p className="text-xs text-stone-500">{c.phone}{c.email ? ` · ${c.email}` : ""}</p>
                </td>
                <td>{c.city}</td>
                <td className="text-right tabular-nums">{c.orders}</td>
                <td className="text-right tabular-nums">{c.delivered}</td>
                <td className={`text-right tabular-nums ${c.returned >= 2 || (c.returnRate ?? 0) >= 0.5 ? "font-semibold text-rose-700" : ""}`}>{c.returned}{c.returnRate != null && c.returned > 0 ? ` (${pct(c.returnRate)})` : ""}</td>
                <td className="text-right tabular-nums">{formatPKR(c.spent)}</td>
                <td className="pl-4 text-stone-600">{dt(c.lastOrder)}</td>
                <td className="pr-4 text-right"><Link href={`/admin/orders?q=${encodeURIComponent(c.phone)}`} className="font-semibold text-brand-600">Orders</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="px-4 py-10 text-center text-sm text-stone-500">{all.length ? "No customers match." : "Customers appear here after their first order."}</p>}
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-stone-200/70">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-1 text-xl font-extrabold tabular-nums">{value}</p>
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

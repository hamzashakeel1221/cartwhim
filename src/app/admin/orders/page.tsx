import Link from "next/link";
import { Search } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { HhcBadge, StatusBadge, statusMeta } from "@/components/admin/status";
import { formatPKR } from "@/lib/format";
import { orderStatuses, ordersSince, type OrderStatus } from "@/lib/orders";

export const metadata = { title: "Orders (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

type Filters = { status?: string; hhc?: string; city?: string; q?: string };

export default async function AdminOrders({ searchParams }: { searchParams: Promise<Filters> }) {
  const f = await searchParams;
  const all = await ordersSince(null, 2000);
  const q = f.q?.trim().toLowerCase();
  const digits = q?.replace(/\D/g, "");
  const orders = all.filter((o) => {
    if (f.status && o.status !== f.status) return false;
    if (f.hhc === "failed" && o.hhc?.push !== "failed") return false;
    if (f.city && o.customer.city.toLowerCase() !== f.city.toLowerCase()) return false;
    if (q) {
      const hay = `${o.id} ${o.customer.name} ${o.customer.city} ${o.customer.address} ${o.hhc?.orderId ?? ""} ${o.hhc?.tracking ?? ""} ${o.items.map((i) => i.name).join(" ")}`.toLowerCase();
      const phoneHit = digits && digits.length >= 4 && o.customer.phone.replace(/\D/g, "").includes(digits);
      if (!hay.includes(q) && !phoneHit) return false;
    }
    return true;
  });
  const count = (s: OrderStatus) => all.filter((o) => o.status === s).length;
  const failed = all.filter((o) => o.hhc?.push === "failed").length;
  const href = (patch: Filters) => {
    const next = { ...f, ...patch };
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  };
  const chip = (on: boolean) => `shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${on ? "bg-ink text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:text-ink"}`;

  return (
    <div className="container-x pb-16 pt-10">
      <AdminNav active="orders" />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">{all.length} orders in total. New orders go to HHC automatically; open an order to see its tracking.</p>

      <form className="mt-5 flex max-w-xl items-center gap-2 rounded-full bg-white px-4 py-2 ring-1 ring-stone-200" action="/admin/orders">
        <Search className="h-4 w-4 text-stone-400" />
        {f.status && <input type="hidden" name="status" value={f.status} />}
        <input name="q" defaultValue={f.q} placeholder="Search order no., name, phone, city, tracking no." className="w-full bg-transparent text-sm outline-none" />
      </form>

      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={href({ status: undefined, hhc: undefined })} className={chip(!f.status && !f.hhc)}>All {all.length}</Link>
        {orderStatuses.map((s) => (
          <Link key={s} href={href({ status: s, hhc: undefined })} className={chip(f.status === s)}>{statusMeta[s].label} {count(s)}</Link>
        ))}
        {failed > 0 && <Link href={href({ hhc: "failed", status: undefined })} className={`${chip(f.hhc === "failed")} !text-red-700`}>Needs attention {failed}</Link>}
        {f.city && <Link href={href({ city: undefined })} className={chip(true)}>City: {f.city} ✕</Link>}
      </div>

      <div className="mt-5 overflow-x-auto rounded-3xl bg-white ring-1 ring-stone-200/70">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="font-semibold">Customer</th>
              <th className="font-semibold">Products</th>
              <th className="text-right font-semibold">Total</th>
              <th className="pl-4 font-semibold">Status</th>
              <th className="pr-4 font-semibold">HHC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((o) => (
              <tr key={o.id} className="align-top hover:bg-stone-50/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand-600">{o.id}</Link>
                  <p className="text-xs text-stone-500">{new Date(o.createdAt).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })}</p>
                </td>
                <td className="py-3 pr-3">
                  <p className="font-medium">{o.customer.name}</p>
                  <p className="text-xs text-stone-500">{o.customer.phone} · {o.customer.city}</p>
                </td>
                <td className="max-w-[260px] py-3 pr-3 text-xs text-stone-600">
                  {o.items.map((i) => <p key={i.slug} className="truncate">{i.qty} × {i.name}</p>)}
                </td>
                <td className="py-3 text-right font-semibold tabular-nums">{formatPKR(o.total)}</td>
                <td className="py-3 pl-4"><StatusBadge status={o.status} />{o.hhc?.status && <p className="mt-1 text-xs text-stone-500">HHC: {o.hhc.status}</p>}</td>
                <td className="py-3 pr-4">
                  {o.hhc && <HhcBadge push={o.hhc.push} orderId={o.hhc.orderId} />}
                  {o.hhc?.tracking && <p className="mt-1 font-mono text-xs text-stone-500">{o.hhc.courier} {o.hhc.tracking}</p>}
                  {o.hhc?.push === "failed" && o.hhc.error && <p className="mt-1 max-w-[220px] text-xs text-red-700">{o.hhc.error}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p className="px-4 py-10 text-center text-sm text-stone-500">No orders match.</p>}
      </div>
    </div>
  );
}

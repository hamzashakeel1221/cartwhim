import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package } from "lucide-react";
import { getCustomer } from "@/lib/auth";
import { formatPKR } from "@/lib/format";
import { listOrders, type OrderStatus } from "@/lib/orders";
import { logout } from "./actions";
import { ProfileForm } from "./forms";

export const metadata: Metadata = { title: "My account", robots: { index: false } };
export const dynamic = "force-dynamic";

const statusStyle: Record<OrderStatus, string> = {
  placed: "bg-amber-50 text-amber-700",
  confirmed: "bg-sky-50 text-sky-700",
  dispatched: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  returned: "bg-rose-50 text-rose-700",
  cancelled: "bg-stone-100 text-stone-500",
};

export default async function AccountPage() {
  const me = await getCustomer();
  if (!me) redirect("/account/login");
  const orders = await listOrders(50, me.id);
  const first = me.name.split(" ")[0];

  return (
    <div className="container-x max-w-4xl pt-6">
      <div className="flex items-center gap-4 rounded-[2rem] bg-gradient-to-br from-brand-500 to-rose-500 p-6 text-white sm:p-8">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl font-extrabold">{first[0]?.toUpperCase()}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold">Salam, {first}!</h1>
          <p className="truncate text-sm text-white/80">{me.email} · {me.phone}</p>
        </div>
        <form action={logout}>
          <button className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Log out</span></button>
        </form>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-extrabold tracking-tight">My orders</h2>
        {orders.length ? (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{o.id}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle[o.status]}`}>{o.status}</span>
                </div>
                <p className="mt-1 text-sm text-stone-500">{new Date(o.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })} · {(() => { const n = o.items.reduce((s, i) => s + i.qty, 0); return `${n} ${n === 1 ? "item" : "items"}`; })()} · {formatPKR(o.total)} COD</p>
                <p className="mt-2 line-clamp-1 text-sm">{o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</p>
                <Link href={`/track-order?id=${o.id}&phone=${encodeURIComponent(o.customer.phone)}`} className="mt-3 inline-block text-sm font-semibold text-brand-600">Track order →</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center rounded-3xl bg-white p-10 text-center ring-1 ring-stone-200/70">
            <Package className="h-10 w-10 text-stone-300" />
            <p className="mt-3 font-semibold">No orders yet</p>
            <Link href="/products" className="btn btn-primary mt-5">Start shopping</Link>
          </div>
        )}
      </section>

      <section className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
        <h2 className="text-xl font-extrabold tracking-tight">Delivery details</h2>
        <p className="mt-1 text-sm text-stone-500">Saved here so checkout is filled in for you.</p>
        <div className="mt-5"><ProfileForm name={me.name} phone={me.phone} city={me.city} address={me.address} /></div>
      </section>
    </div>
  );
}

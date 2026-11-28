import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { findOrder, type OrderStatus } from "@/lib/orders";
import { formatPKR } from "@/lib/format";

export const metadata: Metadata = { title: "Track your order" };
export const dynamic = "force-dynamic";

const steps: OrderStatus[] = ["placed", "confirmed", "dispatched", "delivered"];

export default async function TrackOrder({ searchParams }: { searchParams: Promise<{ id?: string; phone?: string }> }) {
  const { id, phone } = await searchParams;
  const order = id && phone ? await findOrder(id, phone) : undefined;
  const current = order ? steps.indexOf(order.status) : -1;

  return (
    <div className="container-x max-w-2xl pt-12">
      <div className="text-center">
        <PackageSearch className="mx-auto h-12 w-12 text-brand-500" />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Track your order</h1>
        <p className="mt-2 text-stone-500">Enter the order number from your confirmation and the mobile number you ordered with.</p>
      </div>
      <form className="mt-8 grid gap-3 rounded-3xl bg-white p-6 ring-1 ring-stone-200/70 sm:grid-cols-[1fr_1fr_auto]">
        <input name="id" defaultValue={id} placeholder="Order no. e.g. CW-7KQ2MX" className="input" required />
        <input name="phone" defaultValue={phone} placeholder="0300 1234567" className="input" required />
        <button className="btn btn-dark">Track</button>
      </form>

      {id && phone && !order && (
        <p className="mt-6 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-700">We could not find that order. Check the number and phone, or WhatsApp us.</p>
      )}

      {order && (
        <div className="mt-6 rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-bold">Order {order.id}</p>
            <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString("en-PK", { dateStyle: "medium" })}</p>
          </div>
          {order.status === "cancelled" || order.status === "returned" ? (
            <p className="mt-4 font-semibold text-red-600">{order.status === "cancelled" ? "This order was cancelled." : "This order was returned."}</p>
          ) : (
            <ol className="mt-6 grid grid-cols-4 gap-2">
              {steps.map((s, i) => (
                <li key={s} className="text-center">
                  <div className={`h-2 rounded-full ${i <= current ? "bg-brand-500" : "bg-stone-200"}`} />
                  <p className={`mt-2 text-xs font-semibold capitalize ${i <= current ? "text-ink" : "text-stone-400"}`}>{s}</p>
                </li>
              ))}
            </ol>
          )}
          {order.hhc?.tracking && (
            <p className="mt-4 text-sm text-stone-600">
              Courier: <b>{order.hhc.courier ?? "Courier"}</b> · Tracking number: <b className="font-mono">{order.hhc.tracking}</b>
            </p>
          )}
          <ul className="mt-6 space-y-1 border-t border-stone-100 pt-4 text-sm">
            {order.items.map((i) => (
              <li key={i.slug} className="flex justify-between gap-3"><span>{i.qty} × {i.name}</span><span>{formatPKR(i.price * i.qty)}</span></li>
            ))}
            <li className="flex justify-between pt-2 font-bold"><span>Total (Cash on Delivery)</span><span>{formatPKR(order.total)}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ArrowLeft, ExternalLink, Send } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { HhcBadge, StatusBadge, statusMeta } from "@/components/admin/status";
import { orderProfit, pct } from "@/lib/analytics";
import { formatPKR } from "@/lib/format";
import { pushOrderToHhc } from "@/lib/hhc-orders";
import { getOrder, orderStatuses, ordersByPhone, setOrderStatus, type OrderStatus } from "@/lib/orders";
import { getSupplier } from "@/lib/suppliers";

export const metadata = { title: "Order (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

async function updateStatus(form: FormData) {
  "use server";
  const id = String(form.get("id"));
  const status = String(form.get("status")) as OrderStatus;
  if (orderStatuses.includes(status)) await setOrderStatus(id, status);
  revalidatePath(`/admin/orders/${id}`);
}

async function sendToHhc(form: FormData) {
  "use server";
  const id = String(form.get("id"));
  await pushOrderToHhc(id, { manual: true, city: String(form.get("city") ?? "") });
  revalidatePath(`/admin/orders/${id}`);
}

const dt = (iso: string) => new Date(iso).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const history = (await ordersByPhone(order.customer.phone)).filter((o) => o.id !== order.id);
  const delivered = history.filter((o) => o.status === "delivered").length;
  const returned = history.filter((o) => o.status === "returned").length;
  const profit = orderProfit(order);
  const canSend = order.hhc && !order.hhc.orderId && order.status !== "cancelled" && order.items.some((i) => i.supplier === "hhc");
  const c = order.customer;

  return (
    <div className="container-x pb-16 pt-10">
      <AdminNav active="orders" />
      <Link href="/admin/orders" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-stone-500 hover:text-ink"><ArrowLeft className="h-4 w-4" /> All orders</Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{order.id}</h1>
          <p className="mt-1 text-sm text-stone-500">Placed {dt(order.createdAt)}{order.updatedAt && order.updatedAt !== order.createdAt ? ` · updated ${dt(order.updatedAt)}` : ""}</p>
          <div className="mt-2 flex flex-wrap gap-2"><StatusBadge status={order.status} />{order.hhc && <HhcBadge push={order.hhc.push} orderId={order.hhc.orderId} />}</div>
        </div>
        <form action={updateStatus} className="flex gap-2">
          <input type="hidden" name="id" value={order.id} />
          <select name="status" defaultValue={order.status} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm">
            {orderStatuses.map((s) => <option key={s} value={s}>{statusMeta[s].label}</option>)}
          </select>
          <button className="btn btn-dark px-4 py-2 text-sm">Save status</button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
            <h2 className="font-bold">Products</h2>
            <table className="mt-3 w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-stone-500">
                <tr><th className="py-2 font-semibold">Item</th><th className="text-right font-semibold">Qty</th><th className="text-right font-semibold">Price</th><th className="text-right font-semibold">Cost</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((i) => (
                  <tr key={i.slug}>
                    <td className="py-2.5 pr-2"><Link href={`/products/${i.slug}`} className="hover:text-brand-600">{i.name}</Link><p className="text-xs text-stone-500">{getSupplier(i.supplier)?.name ?? i.supplier}</p></td>
                    <td className="text-right tabular-nums">{i.qty}</td>
                    <td className="text-right tabular-nums">{formatPKR(i.price * i.qty)}</td>
                    <td className="text-right tabular-nums text-stone-500">{i.cost != null ? formatPKR(i.cost * i.qty) : "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 space-y-1 border-t border-stone-100 pt-3 text-sm">
              <div className="flex justify-between"><dt className="text-stone-500">Subtotal</dt><dd className="tabular-nums">{formatPKR(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone-500">Delivery charged to customer</dt><dd className="tabular-nums">{order.shipping ? formatPKR(order.shipping) : "Free"}</dd></div>
              <div className="flex justify-between font-bold"><dt>Cash to collect</dt><dd className="tabular-nums">{formatPKR(order.total)}</dd></div>
              {order.hhc?.cost != null && <div className="flex justify-between"><dt className="text-stone-500">HHC charges you</dt><dd className="tabular-nums">{formatPKR(order.hhc.cost)}</dd></div>}
              {profit != null && (
                <div className="flex justify-between font-semibold text-emerald-700">
                  <dt>{order.hhc?.profit != null ? "Your profit (from HHC)" : "Estimated profit"}</dt><dd className="tabular-nums">{formatPKR(profit)}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
            <h2 className="font-bold">HHC fulfilment</h2>
            {order.hhc?.orderId ? (
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <Info label="HHC order number" value={`#${order.hhc.orderId}`} />
                <Info label="HHC status" value={order.hhc.status ?? "–"} />
                <Info label="Courier" value={order.hhc.courier ?? "–"} />
                <Info label="Tracking number" value={order.hhc.tracking ?? "Not booked yet"} mono />
                <a href="https://member.hhcdropshipping.com/en/orders" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 sm:col-span-2">
                  Open my orders on HHC <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </dl>
            ) : (
              <div className="mt-3 text-sm">
                {order.hhc?.push === "failed" && order.hhc.error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-red-800">{order.hhc.error}</p>}
                {(order.hhc?.push === "pending" || order.hhc?.push === "sending") && <p className="text-stone-600">This order is being sent to HHC.</p>}
                {order.hhc?.push === "skipped" && <p className="text-stone-600">This order has no HHC products, or was not sent automatically.</p>}
                {canSend && (
                  <form action={sendToHhc} className="mt-4 flex flex-wrap items-end gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <label className="text-xs font-semibold text-stone-500">
                      City for the courier
                      <input name="city" defaultValue={c.city === "Other" ? "" : c.city} placeholder="e.g. Okara" className="input mt-1 block w-56" />
                    </label>
                    <button className="btn btn-primary px-5 py-2.5 text-sm"><Send className="h-4 w-4" /> Send to HHC</button>
                  </form>
                )}
                {order.hhc && order.hhc.attempts > 0 && <p className="mt-3 text-xs text-stone-500">Tried {order.hhc.attempts} time{order.hhc.attempts === 1 ? "" : "s"}.</p>}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
            <h2 className="font-bold">Customer</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <Info label="Name" value={c.name} />
              <Info label="Phone" value={c.phone} />
              {c.email && <Info label="Email" value={c.email} />}
              <Info label="City" value={c.city} />
              <Info label="Address" value={c.address} />
              {c.notes && <Info label="Notes" value={c.notes} />}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`https://wa.me/92${c.phone.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noreferrer" className="btn btn-ghost px-4 py-2 text-sm">WhatsApp</a>
              <a href={`tel:${c.phone}`} className="btn btn-ghost px-4 py-2 text-sm">Call</a>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
            <h2 className="font-bold">Order history</h2>
            {history.length ? (
              <>
                <p className="mt-1 text-sm text-stone-500">
                  {history.length} other order{history.length === 1 ? "" : "s"} · {delivered} delivered · {returned} returned
                  {delivered + returned > 0 && <> · <b className={returned / (delivered + returned) > 0.3 ? "text-rose-700" : ""}>{pct(returned / (delivered + returned))} returns</b></>}
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {history.slice(0, 8).map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-2">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand-600">{o.id}</Link>
                      <span className="flex items-center gap-2"><span className="tabular-nums text-stone-600">{formatPKR(o.total)}</span><StatusBadge status={o.status} /></span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-1 text-sm text-stone-500">First order from this phone number.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</dt>
      <dd className={`mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

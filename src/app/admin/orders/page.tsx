import { AdminNav } from "@/components/admin/admin-nav";
import { revalidatePath } from "next/cache";
import { getSupplier } from "@/lib/suppliers";
import { formatPKR } from "@/lib/format";
import { groupBySupplier, listOrders, setOrderStatus, type OrderStatus } from "@/lib/orders";

export const metadata = { title: "Orders (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

const statuses: OrderStatus[] = ["placed", "confirmed", "dispatched", "delivered", "cancelled"];

async function updateStatus(form: FormData) {
  "use server";
  await setOrderStatus(String(form.get("id")), String(form.get("status")) as OrderStatus);
  revalidatePath("/admin/orders");
}

export default async function AdminOrders() {
  const orders = await listOrders();
  return (
    <div className="container-x pt-10">
      <AdminNav active="orders" />
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-stone-500">{orders.length} orders. Each order is split by supplier so you know what to forward where.</p>
      <div className="mt-8 space-y-5">
        {orders.map((o) => (
          <div key={o.id} className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold">{o.id} · {formatPKR(o.total)} COD</p>
                <p className="text-sm text-stone-500">{new Date(o.createdAt).toLocaleString("en-PK")}</p>
                <p className="mt-2 text-sm">{o.customer.name} · {o.customer.phone} · {o.customer.city}</p>
                <p className="text-sm text-stone-500">{o.customer.address}{o.customer.notes && ` (${o.customer.notes})`}</p>
              </div>
              <form action={updateStatus} className="flex gap-2">
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} className="rounded-full border border-stone-200 px-3 py-2 text-sm capitalize">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-dark px-4 py-2 text-sm">Save</button>
              </form>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {groupBySupplier(o).map(({ supplier, items }) => (
                <div key={supplier} className="rounded-2xl bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{getSupplier(supplier)?.name ?? supplier}</p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {items.map((i) => <li key={i.slug}>{i.qty} × {i.name}{i.supplierSku && <span className="text-stone-400"> ({i.supplierSku})</span>}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

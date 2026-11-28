import Link from "next/link";
import { revalidatePath } from "next/cache";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { SalesChart } from "@/components/admin/sales-chart";
import { HhcBadge, StatusBadge, statusMeta } from "@/components/admin/status";
import {
  change, daily, pct, previousRangeStart, rangeStart, ranges, summarize, topCities, topProducts, type RangeKey, type Row,
} from "@/lib/analytics";
import { formatPKR } from "@/lib/format";
import { AUTO_SEND_KEY, autoRefresh, autoSendEnabled, lastStatusSync, syncHhcStatuses, pushPendingOrders } from "@/lib/hhc-orders";
import { orderStatuses, ordersSince, setSetting } from "@/lib/orders";

export const metadata = { title: "Dashboard (admin)", robots: { index: false } };
export const dynamic = "force-dynamic";

async function refreshNow() {
  "use server";
  try {
    await pushPendingOrders();
    await syncHhcStatuses();
  } catch (e) {
    console.error("HHC refresh failed", e);
  }
  revalidatePath("/admin");
}

async function toggleAutoSend(form: FormData) {
  "use server";
  await setSetting(AUTO_SEND_KEY, form.get("on") === "1" ? "on" : "off");
  revalidatePath("/admin");
}

function ago(iso: string | null) {
  if (!iso) return "never";
  const m = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h} h ago` : `${Math.round(h / 24)} days ago`;
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const sp = await searchParams;
  const range: RangeKey = sp.range && sp.range in ranges ? (sp.range as RangeKey) : "30d";
  const refresh = await autoRefresh();
  const [all, autoSend, lastSync] = await Promise.all([ordersSince(null), autoSendEnabled(), lastStatusSync()]);

  const start = rangeStart(range);
  const prevStart = previousRangeStart(range);
  const inRange = start ? all.filter((o) => o.createdAt >= start) : all;
  const prev = start && prevStart ? all.filter((o) => o.createdAt >= prevStart && o.createdAt < start) : [];
  const s = summarize(inRange, all);
  const p = summarize(prev, all);
  const showChange = range !== "all";
  const points = daily(inRange, range);
  const products = topProducts(inRange).slice(0, 8);
  const cities = topCities(inRange).slice(0, 8);
  const recent = all.slice(0, 8);

  return (
    <div className="container-x pb-16 pt-10">
      <AdminNav active="dashboard" />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-stone-500">
            Order statuses from HHC updated {ago(lastSync)}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full bg-white p-1 ring-1 ring-stone-200">
            {(Object.keys(ranges) as RangeKey[]).map((k) => (
              <Link
                key={k}
                href={`/admin?range=${k}`}
                className={`rounded-full px-3 py-1 text-sm font-semibold ${k === range ? "bg-ink text-white" : "text-stone-600 hover:text-ink"}`}
              >
                {ranges[k].label}
              </Link>
            ))}
          </div>
          <form action={refreshNow}>
            <button className="btn btn-ghost px-4 py-2 text-sm"><RefreshCw className="h-4 w-4" /> Update from HHC</button>
          </form>
        </div>
      </div>

      {refresh.error && (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{refresh.error}</p>
      )}
      {(s.needsAttention > 0 || s.awaitingDecision > 0) && (
        <div className="mt-4 space-y-2">
          {s.needsAttention > 0 && (
            <Link href="/admin/orders?hhc=failed" className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
              <AlertTriangle className="h-4 w-4" /> {s.needsAttention} order{s.needsAttention === 1 ? "" : "s"} could not be sent to HHC. Open to fix and send.
            </Link>
          )}
          {s.awaitingDecision > 0 && (
            <a href="https://member.hhcdropshipping.com/en/orders" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-200">
              <AlertTriangle className="h-4 w-4" /> {s.awaitingDecision} order{s.awaitingDecision === 1 ? " is" : "s are"} waiting for your re-attempt or return decision on HHC.
            </a>
          )}
        </div>
      )}

      {/* KPI tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Sales" value={formatPKR(s.sales)} delta={showChange ? change(s.sales, p.sales) : null} hint={`${s.units} items sold`} />
        <Tile label="Orders" value={String(s.orders)} delta={showChange ? change(s.orders, p.orders) : null} hint={`${s.open} on the way or new`} />
        <Tile label="Profit earned" value={formatPKR(s.profitEarned)} delta={showChange ? change(s.profitEarned, p.profitEarned) : null} hint="From delivered orders" />
        <Tile label="Profit on the way" value={formatPKR(s.profitExpected)} hint="If open orders are delivered" />
        <Tile label="Average order" value={formatPKR(s.aov)} delta={showChange ? change(s.aov, p.aov) : null} hint="Per order, excluding cancelled" />
        <Tile label="Delivery rate" value={pct(s.deliveryRate)} hint={`${s.delivered} delivered of ${s.delivered + s.returned} completed`} good />
        <Tile label="Return rate" value={pct(s.returnRate)} hint={`${s.returned} returned · ${pct(s.cancelRate)} cancelled`} bad={(s.returnRate ?? 0) > 0.25} />
        <Tile label="Customers" value={String(s.customers)} hint={`${s.newCustomers} new · ${pct(s.repeatRate)} ordered again`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-bold">Sales per day</h2>
            <p className="text-sm text-stone-500">{ranges[range].label}</p>
          </div>
          <div className="mt-4">
            {s.orders ? <SalesChart points={points} /> : <Empty text="No orders in this period yet." />}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
          <h2 className="font-bold">Order status</h2>
          {s.orders ? (
            <>
              <div className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Orders by status">
                {orderStatuses.map((st) => {
                  const n = inRange.filter((o) => o.status === st).length;
                  return n ? <div key={st} style={{ flex: n, background: statusMeta[st].bar }} title={`${statusMeta[st].label}: ${n}`} /> : null;
                })}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {orderStatuses.map((st) => {
                  const n = inRange.filter((o) => o.status === st).length;
                  return (
                    <li key={st} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: statusMeta[st].bar }} />{statusMeta[st].label}</span>
                      <span className="tabular-nums text-stone-600"><b className="text-ink">{n}</b> · {pct(s.orders ? n / s.orders : null)}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <Empty text="Statuses appear once orders come in." />
          )}
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <RowTable title="Best-selling products" rows={products} first="Product" link={(r) => `/products/${r.key}`} />
        <RowTable title="Top cities" rows={cities} first="City" link={(r) => `/admin/orders?city=${encodeURIComponent(r.label)}`} />
      </div>

      <section className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Latest orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand-600">All orders</Link>
        </div>
        {recent.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-stone-500">
                <tr><th className="py-2 font-semibold">Order</th><th className="font-semibold">Customer</th><th className="font-semibold">Total</th><th className="font-semibold">Status</th><th className="font-semibold">HHC</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5"><Link href={`/admin/orders/${o.id}`} className="font-semibold text-brand-600">{o.id}</Link><p className="text-xs text-stone-500">{new Date(o.createdAt).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })}</p></td>
                    <td>{o.customer.name}<p className="text-xs text-stone-500">{o.customer.city}</p></td>
                    <td className="tabular-nums">{formatPKR(o.total)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td>{o.hhc && <HhcBadge push={o.hhc.push} orderId={o.hhc.orderId} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text="Your first order will show up here." />
        )}
      </section>

      <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
        <div>
          <h2 className="font-bold">Send orders to HHC automatically</h2>
          <p className="mt-1 text-sm text-stone-500">
            {autoSend
              ? "On. Every new order is placed on HHC the moment the customer checks out, with the cheapest courier for their city."
              : "Off. New orders wait here until you press Send on the order."}
          </p>
        </div>
        <form action={toggleAutoSend}>
          <input type="hidden" name="on" value={autoSend ? "0" : "1"} />
          <button className={`btn px-5 py-2 text-sm ${autoSend ? "btn-ghost" : "btn-primary"}`}>{autoSend ? "Turn off" : "Turn on"}</button>
        </form>
      </section>
    </div>
  );
}

function Tile({ label, value, hint, delta, good, bad }: { label: string; value: string; hint?: string; delta?: number | null; good?: boolean; bad?: boolean }) {
  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-stone-200/70 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold tabular-nums tracking-tight sm:text-3xl ${bad ? "text-rose-700" : good ? "text-ink" : "text-ink"}`}>{value}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-stone-500">
        {delta != null && (
          <span className={`inline-flex items-center font-semibold ${delta >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(Math.round(delta * 100))}%
          </span>
        )}
        {hint && <span>{hint}</span>}
      </div>
    </div>
  );
}

function RowTable({ title, rows, first, link }: { title: string; rows: Row[]; first: string; link: (r: Row) => string }) {
  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70">
      <h2 className="font-bold">{title}</h2>
      {rows.length ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-stone-500">
              <tr><th className="py-2 font-semibold">{first}</th><th className="text-right font-semibold">Orders</th><th className="text-right font-semibold">Sales</th><th className="text-right font-semibold">Returns</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((r) => (
                <tr key={r.key}>
                  <td className="max-w-[220px] truncate py-2.5 pr-2"><Link href={link(r)} className="hover:text-brand-600">{r.label}</Link></td>
                  <td className="text-right tabular-nums">{r.orders}</td>
                  <td className="text-right tabular-nums">{formatPKR(r.sales)}</td>
                  <td className={`text-right tabular-nums ${(r.returnRate ?? 0) > 0.25 ? "font-semibold text-rose-700" : ""}`}>{pct(r.returnRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty text="Nothing to show for this period yet." />
      )}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="mt-4 rounded-2xl bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">{text}</p>;
}

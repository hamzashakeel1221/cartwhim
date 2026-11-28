import type { Order, OrderStatus } from "./orders";

// Store analytics for the admin dashboard. Everything is computed from the orders table, with HHC's
// reported profit used where HHC has sent it, and (price − cost) as the estimate before that.

const PK_OFFSET = 5 * 3600_000; // Pakistan time, UTC+5, no daylight saving

export const ranges = {
  today: { label: "Today", days: 1 },
  "7d": { label: "7 days", days: 7 },
  "30d": { label: "30 days", days: 30 },
  "90d": { label: "90 days", days: 90 },
  all: { label: "All time", days: 0 },
} as const;
export type RangeKey = keyof typeof ranges;

export const pkDay = (iso: string | number) => new Date(new Date(iso).getTime() + PK_OFFSET).toISOString().slice(0, 10);

/** Start of the range (ISO, UTC) — midnight Pakistan time, `days` days back including today. */
export function rangeStart(key: RangeKey, now = Date.now()): string | null {
  const days = ranges[key].days;
  if (!days) return null;
  const pkMidnight = Date.parse(pkDay(now) + "T00:00:00Z") - PK_OFFSET;
  return new Date(pkMidnight - (days - 1) * 86400_000).toISOString();
}

export function previousRangeStart(key: RangeKey, now = Date.now()): string | null {
  const start = rangeStart(key, now);
  return start ? new Date(Date.parse(start) - ranges[key].days * 86400_000).toISOString() : null;
}

export const isOpen = (s: OrderStatus) => s === "placed" || s === "confirmed" || s === "dispatched";

/** Profit for one order: HHC's figure when known, else the sum of (price − cost) × qty. */
export function orderProfit(o: Order): number | null {
  if (o.hhc?.profit != null) return o.hhc.profit;
  if (o.items.some((i) => i.cost == null)) return null;
  return o.items.reduce((s, i) => s + (i.price - (i.cost ?? 0)) * i.qty, 0);
}

export type Summary = {
  orders: number;
  sales: number; // value of all orders except cancelled
  deliveredSales: number;
  aov: number;
  units: number;
  profitEarned: number; // delivered orders
  profitExpected: number; // orders still on the way
  delivered: number;
  returned: number;
  cancelled: number;
  open: number;
  deliveryRate: number | null; // delivered ÷ (delivered + returned)
  returnRate: number | null;
  cancelRate: number | null;
  customers: number;
  newCustomers: number;
  repeatCustomers: number;
  repeatRate: number | null;
  needsAttention: number; // HHC send failed or held
  awaitingDecision: number;
};

export function summarize(orders: Order[], everyOrder: Order[]): Summary {
  const by = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
  const delivered = by("delivered");
  const returned = by("returned");
  const cancelled = by("cancelled");
  const live = orders.filter((o) => o.status !== "cancelled");
  const sales = live.reduce((s, o) => s + o.total, 0);
  const finished = delivered + returned;

  // A customer is "new" if their first order ever falls in this range.
  const firstOrder = new Map<string, string>();
  for (const o of everyOrder) {
    const k = o.customer.phone.replace(/\D/g, "").slice(-10);
    const prev = firstOrder.get(k);
    if (!prev || o.createdAt < prev) firstOrder.set(k, o.createdAt);
  }
  const phones = new Map<string, number>();
  for (const o of orders) {
    const k = o.customer.phone.replace(/\D/g, "").slice(-10);
    phones.set(k, (phones.get(k) ?? 0) + 1);
  }
  const earliest = orders.length ? orders.reduce((m, o) => (o.createdAt < m ? o.createdAt : m), orders[0].createdAt) : "";
  const newCustomers = [...phones.keys()].filter((k) => (firstOrder.get(k) ?? "") >= earliest).length;
  const totalOrdersByPhone = new Map<string, number>();
  for (const o of everyOrder) {
    const k = o.customer.phone.replace(/\D/g, "").slice(-10);
    totalOrdersByPhone.set(k, (totalOrdersByPhone.get(k) ?? 0) + 1);
  }
  const repeatCustomers = [...phones.keys()].filter((k) => (totalOrdersByPhone.get(k) ?? 0) > 1).length;

  return {
    orders: orders.length,
    sales,
    deliveredSales: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0),
    aov: live.length ? Math.round(sales / live.length) : 0,
    units: live.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0),
    profitEarned: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + (orderProfit(o) ?? 0), 0),
    profitExpected: orders.filter((o) => isOpen(o.status)).reduce((s, o) => s + (orderProfit(o) ?? 0), 0),
    delivered, returned, cancelled,
    open: orders.filter((o) => isOpen(o.status)).length,
    deliveryRate: finished ? delivered / finished : null,
    returnRate: finished ? returned / finished : null,
    cancelRate: orders.length ? cancelled / orders.length : null,
    customers: phones.size,
    newCustomers,
    repeatCustomers,
    repeatRate: phones.size ? repeatCustomers / phones.size : null,
    needsAttention: orders.filter((o) => o.hhc?.push === "failed").length,
    awaitingDecision: orders.filter((o) => /return\s*confirmation\s*pending/i.test(o.hhc?.status ?? "")).length,
  };
}

export type DayPoint = { day: string; orders: number; sales: number };

/** One point per day in the range (Pakistan dates), including days with no orders. */
export function daily(orders: Order[], key: RangeKey, now = Date.now()): DayPoint[] {
  const days = ranges[key].days || Math.min(180, Math.max(7, Math.ceil((now - Date.parse(orders.at(-1)?.createdAt ?? new Date(now).toISOString())) / 86400_000) + 1));
  const map = new Map<string, DayPoint>();
  for (let i = days - 1; i >= 0; i--) {
    const day = pkDay(now - i * 86400_000);
    map.set(day, { day, orders: 0, sales: 0 });
  }
  for (const o of orders) {
    const p = map.get(pkDay(o.createdAt));
    if (!p) continue;
    p.orders++;
    if (o.status !== "cancelled") p.sales += o.total;
  }
  return [...map.values()];
}

export type Row = { key: string; label: string; orders: number; units: number; sales: number; delivered: number; returned: number; returnRate: number | null };

function finish(rows: Map<string, Row>) {
  return [...rows.values()]
    .map((r) => ({ ...r, returnRate: r.delivered + r.returned ? r.returned / (r.delivered + r.returned) : null }))
    .sort((a, b) => b.sales - a.sales || b.orders - a.orders);
}

export function topProducts(orders: Order[]): Row[] {
  const rows = new Map<string, Row>();
  for (const o of orders) {
    for (const i of o.items) {
      const r = rows.get(i.slug) ?? { key: i.slug, label: i.name, orders: 0, units: 0, sales: 0, delivered: 0, returned: 0, returnRate: null };
      r.orders++;
      if (o.status !== "cancelled") {
        r.units += i.qty;
        r.sales += i.price * i.qty;
      }
      if (o.status === "delivered") r.delivered++;
      if (o.status === "returned") r.returned++;
      rows.set(i.slug, r);
    }
  }
  return finish(rows);
}

export function topCities(orders: Order[]): Row[] {
  const rows = new Map<string, Row>();
  for (const o of orders) {
    const k = o.customer.city.trim().toLowerCase();
    const r = rows.get(k) ?? { key: k, label: o.customer.city.trim(), orders: 0, units: 0, sales: 0, delivered: 0, returned: 0, returnRate: null };
    r.orders++;
    if (o.status !== "cancelled") {
      r.units += o.items.reduce((n, i) => n + i.qty, 0);
      r.sales += o.total;
    }
    if (o.status === "delivered") r.delivered++;
    if (o.status === "returned") r.returned++;
    rows.set(k, r);
  }
  return finish(rows);
}

export type CustomerRow = {
  phone: string; name: string; city: string; email?: string; orders: number; spent: number; delivered: number; returned: number; cancelled: number;
  firstOrder: string; lastOrder: string; returnRate: number | null; accountId?: string;
};

export function customers(orders: Order[]): CustomerRow[] {
  const rows = new Map<string, CustomerRow>();
  // Orders come newest first, so the first one seen per phone holds the latest name and address.
  for (const o of orders) {
    const k = o.customer.phone.replace(/\D/g, "").slice(-10);
    const r = rows.get(k) ?? {
      phone: o.customer.phone, name: o.customer.name, city: o.customer.city, email: o.customer.email, orders: 0, spent: 0, delivered: 0, returned: 0, cancelled: 0,
      firstOrder: o.createdAt, lastOrder: o.createdAt, returnRate: null, accountId: o.customerId,
    };
    r.orders++;
    if (o.status === "delivered") { r.delivered++; r.spent += o.total; }
    if (o.status === "returned") r.returned++;
    if (o.status === "cancelled") r.cancelled++;
    if (o.createdAt < r.firstOrder) r.firstOrder = o.createdAt;
    if (o.createdAt > r.lastOrder) r.lastOrder = o.createdAt;
    r.email ??= o.customer.email;
    r.accountId ??= o.customerId;
    rows.set(k, r);
  }
  return [...rows.values()]
    .map((r) => ({ ...r, returnRate: r.delivered + r.returned ? r.returned / (r.delivered + r.returned) : null }))
    .sort((a, b) => b.lastOrder.localeCompare(a.lastOrder));
}

export const pct = (v: number | null, digits = 0) => (v == null ? "–" : `${(v * 100).toFixed(digits)}%`);

/** Change from the previous period, as a fraction; null when there is nothing to compare with. */
export const change = (now: number, before: number) => (before ? (now - before) / before : null);

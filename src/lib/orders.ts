import { db, last10 } from "./db";

// Orders live in Cloudflare D1 (binding "DB" in wrangler.jsonc).
// Schema: migrations/0001_orders.sql, 0002 (customer_id), 0004 (HHC fulfilment and tracking).

export type OrderStatus = "placed" | "confirmed" | "dispatched" | "delivered" | "returned" | "cancelled";
export const orderStatuses: OrderStatus[] = ["placed", "confirmed", "dispatched", "delivered", "returned", "cancelled"];

export type HhcPush = "pending" | "sending" | "sent" | "failed" | "skipped";

export type OrderItem = { slug: string; name: string; price: number; qty: number; supplier: string; supplierSku?: string; cost?: number };

export type HhcInfo = {
  push: HhcPush;
  orderId?: number;
  error?: string;
  status?: string;
  tracking?: string;
  courier?: string;
  cost?: number;
  profit?: number;
  attempts: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string; city: string; address: string; notes?: string };
  payment: "cod";
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  hhc?: HhcInfo;
  updatedAt?: string;
};

type OrderRow = {
  id: string; created_at: string; status: OrderStatus; customer_name: string; phone: string; email: string | null;
  city: string; address: string; notes: string | null; payment: "cod"; subtotal: number; shipping: number; total: number;
  customer_id: string | null; updated_at?: string | null;
  hhc_push?: HhcPush; hhc_order_id?: number | null; hhc_error?: string | null; hhc_status?: string | null; hhc_tracking?: string | null;
  hhc_courier?: string | null; hhc_cost?: number | null; hhc_profit?: number | null; hhc_attempts?: number;
};
type ItemRow = { order_id: string; slug: string; name: string; price: number; qty: number; supplier: string; supplier_sku: string | null; cost?: number | null };

const u = <T,>(v: T | null | undefined) => (v === null ? undefined : v);

function toOrder(row: OrderRow, items: ItemRow[]): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: u(row.updated_at),
    status: row.status,
    customer: {
      name: row.customer_name, phone: row.phone, email: row.email ?? undefined,
      city: row.city, address: row.address, notes: row.notes ?? undefined,
    },
    payment: row.payment,
    customerId: row.customer_id ?? undefined,
    items: items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty, supplier: i.supplier, supplierSku: i.supplier_sku ?? undefined, cost: u(i.cost) })),
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
    hhc: row.hhc_push
      ? {
          push: row.hhc_push, orderId: u(row.hhc_order_id), error: u(row.hhc_error), status: u(row.hhc_status), tracking: u(row.hhc_tracking),
          courier: u(row.hhc_courier), cost: u(row.hhc_cost), profit: u(row.hhc_profit), attempts: row.hhc_attempts ?? 0,
        }
      : undefined,
  };
}

export async function saveOrder(order: Order) {
  const d = await db();
  const c = order.customer;
  const push: HhcPush = order.items.some((i) => i.supplier === "hhc") ? "pending" : "skipped";
  await d.batch([
    d.prepare(
      `INSERT INTO orders (id, created_at, updated_at, status, customer_name, phone, phone_last10, email, city, address, notes, payment, subtotal, shipping, total, customer_id, hhc_push)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(order.id, order.createdAt, order.createdAt, order.status, c.name, c.phone, last10(c.phone), c.email ?? null, c.city, c.address, c.notes ?? null, order.payment, order.subtotal, order.shipping, order.total, order.customerId ?? null, push),
    ...order.items.map((i) =>
      d.prepare(`INSERT INTO order_items (order_id, slug, name, price, qty, supplier, supplier_sku, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(order.id, i.slug, i.name, i.price, i.qty, i.supplier, i.supplierSku ?? null, i.cost ?? null),
    ),
  ]);
}

async function withItems(rows: OrderRow[]): Promise<Order[]> {
  if (!rows.length) return [];
  const d = await db();
  const items: ItemRow[] = [];
  // D1 allows up to 100 bound parameters per query.
  for (let i = 0; i < rows.length; i += 90) {
    const ids = rows.slice(i, i + 90).map((r) => r.id);
    const { results } = await d.prepare(`SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`).bind(...ids).all<ItemRow>();
    items.push(...results);
  }
  const byOrder = new Map<string, ItemRow[]>();
  for (const it of items) byOrder.set(it.order_id, [...(byOrder.get(it.order_id) ?? []), it]);
  return rows.map((r) => toOrder(r, byOrder.get(r.id) ?? []));
}

export async function listOrders(limit = 200, customerId?: string): Promise<Order[]> {
  const d = await db();
  const stmt = customerId
    ? d.prepare(`SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT ?`).bind(customerId, limit)
    : d.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`).bind(limit);
  const { results } = await stmt.all<OrderRow>();
  return withItems(results);
}

/** Orders created at or after `since` (ISO), newest first. Used by the dashboard. */
export async function ordersSince(since: string | null, limit = 5000): Promise<Order[]> {
  const d = await db();
  const stmt = since
    ? d.prepare(`SELECT * FROM orders WHERE created_at >= ? ORDER BY created_at DESC LIMIT ?`).bind(since, limit)
    : d.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`).bind(limit);
  return withItems((await stmt.all<OrderRow>()).results);
}

export async function ordersByPhone(phone: string): Promise<Order[]> {
  const d = await db();
  const { results } = await d.prepare(`SELECT * FROM orders WHERE phone_last10 = ? ORDER BY created_at DESC LIMIT 200`).bind(last10(phone)).all<OrderRow>();
  return withItems(results);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const d = await db();
  const row = await d.prepare(`SELECT * FROM orders WHERE id = ?`).bind(id).first<OrderRow>();
  return row ? (await withItems([row]))[0] : undefined;
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const d = await db();
  await d.prepare(`UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`).bind(status, new Date().toISOString(), id).run();
}

export async function findOrder(id: string, phone: string): Promise<Order | undefined> {
  const d = await db();
  const row = await d
    .prepare(`SELECT * FROM orders WHERE id = ? AND phone_last10 = ?`)
    .bind(id.trim().toUpperCase(), last10(phone))
    .first<OrderRow>();
  if (!row) return undefined;
  return (await withItems([row]))[0];
}

// Splits an order into one shipment per supplier, so each supplier gets only its own items.
export function groupBySupplier(order: Order) {
  const groups = new Map<string, OrderItem[]>();
  for (const item of order.items) {
    groups.set(item.supplier, [...(groups.get(item.supplier) ?? []), item]);
  }
  return [...groups.entries()].map(([supplier, items]) => ({ supplier, items }));
}

export function newOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "CW-" + Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

// ───────────── settings (key/value) ─────────────

export async function getSetting(key: string): Promise<string | null> {
  const d = await db();
  const row = await d.prepare(`SELECT value FROM settings WHERE key = ?`).bind(key).first<{ value: string }>().catch(() => null);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const d = await db();
  await d
    .prepare(`INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, value, new Date().toISOString())
    .run();
}

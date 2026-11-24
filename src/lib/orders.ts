import { getCloudflareContext } from "@opennextjs/cloudflare";

// Orders live in Cloudflare D1 (binding "DB" in wrangler.jsonc).
// Schema: migrations/0001_orders.sql

export type OrderStatus = "placed" | "confirmed" | "dispatched" | "delivered" | "cancelled";

export type OrderItem = { slug: string; name: string; price: number; qty: number; supplier: string; supplierSku?: string };

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string; city: string; address: string; notes?: string };
  payment: "cod";
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
};

type OrderRow = {
  id: string; created_at: string; status: OrderStatus; customer_name: string; phone: string; email: string | null;
  city: string; address: string; notes: string | null; payment: "cod"; subtotal: number; shipping: number; total: number;
};
type ItemRow = { order_id: string; slug: string; name: string; price: number; qty: number; supplier: string; supplier_sku: string | null };

async function db(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

const last10 = (phone: string) => phone.replace(/\D/g, "").slice(-10);

function toOrder(row: OrderRow, items: ItemRow[]): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: {
      name: row.customer_name, phone: row.phone, email: row.email ?? undefined,
      city: row.city, address: row.address, notes: row.notes ?? undefined,
    },
    payment: row.payment,
    items: items.map((i) => ({ slug: i.slug, name: i.name, price: i.price, qty: i.qty, supplier: i.supplier, supplierSku: i.supplier_sku ?? undefined })),
    subtotal: row.subtotal,
    shipping: row.shipping,
    total: row.total,
  };
}

export async function saveOrder(order: Order) {
  const d = await db();
  const c = order.customer;
  await d.batch([
    d.prepare(
      `INSERT INTO orders (id, created_at, status, customer_name, phone, phone_last10, email, city, address, notes, payment, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(order.id, order.createdAt, order.status, c.name, c.phone, last10(c.phone), c.email ?? null, c.city, c.address, c.notes ?? null, order.payment, order.subtotal, order.shipping, order.total),
    ...order.items.map((i) =>
      d.prepare(`INSERT INTO order_items (order_id, slug, name, price, qty, supplier, supplier_sku) VALUES (?, ?, ?, ?, ?, ?, ?)`)
        .bind(order.id, i.slug, i.name, i.price, i.qty, i.supplier, i.supplierSku ?? null),
    ),
  ]);
}

export async function listOrders(limit = 200): Promise<Order[]> {
  const d = await db();
  const { results: rows } = await d.prepare(`SELECT * FROM orders ORDER BY created_at DESC LIMIT ?`).bind(limit).all<OrderRow>();
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const { results: items } = await d
    .prepare(`SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`)
    .bind(...ids)
    .all<ItemRow>();
  return rows.map((r) => toOrder(r, items.filter((i) => i.order_id === r.id)));
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const d = await db();
  await d.prepare(`UPDATE orders SET status = ? WHERE id = ?`).bind(status, id).run();
}

export async function findOrder(id: string, phone: string): Promise<Order | undefined> {
  const d = await db();
  const row = await d
    .prepare(`SELECT * FROM orders WHERE id = ? AND phone_last10 = ?`)
    .bind(id.trim().toUpperCase(), last10(phone))
    .first<OrderRow>();
  if (!row) return undefined;
  const { results } = await d.prepare(`SELECT * FROM order_items WHERE order_id = ?`).bind(row.id).all<ItemRow>();
  return toOrder(row, results);
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

import { promises as fs } from "fs";
import path from "path";

// Simple file-based order store so the site works end to end out of the box.
// Before going live on a serverless host (e.g. Vercel), replace this with a real
// database such as Postgres (Neon / Supabase) since the filesystem is not persistent there.

export type OrderStatus = "placed" | "confirmed" | "dispatched" | "delivered" | "cancelled";

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string; city: string; address: string; notes?: string };
  payment: "cod";
  items: { slug: string; name: string; price: number; qty: number; supplier: string; supplierSku?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
};

const FILE = path.join(process.cwd(), ".data", "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function saveOrder(order: Order) {
  const all = await readAll();
  all.push(order);
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all, null, 2));
}

export async function listOrders() {
  return (await readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const all = await readAll();
  const o = all.find((x) => x.id === id);
  if (!o) return;
  o.status = status;
  await fs.writeFile(FILE, JSON.stringify(all, null, 2));
}

export async function findOrder(id: string, phone: string) {
  const all = await readAll();
  const digits = (s: string) => s.replace(/\D/g, "").slice(-10);
  return all.find((o) => o.id.toUpperCase() === id.trim().toUpperCase() && digits(o.customer.phone) === digits(phone));
}

export function newOrderId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `CW-${s}`;
}

// Splits an order into one shipment per supplier, so each supplier gets only its own items.
export function groupBySupplier(order: Order) {
  const groups = new Map<string, Order["items"]>();
  for (const item of order.items) {
    groups.set(item.supplier, [...(groups.get(item.supplier) ?? []), item]);
  }
  return [...groups.entries()].map(([supplier, items]) => ({ supplier, items }));
}

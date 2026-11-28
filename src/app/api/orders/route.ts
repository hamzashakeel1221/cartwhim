import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { autoSendEnabled, pushOrderToHhc } from "@/lib/hhc-orders";
import { getCustomer } from "@/lib/auth";
import { db } from "@/lib/db";
import { findProduct } from "@/lib/product-store";
import { newOrderId, saveOrder, type Order } from "@/lib/orders";
import { shippingFor } from "@/lib/store-config";
import { checkoutSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const data = parsed.data;

  // Never trust prices from the browser: rebuild the order from the catalog.
  const items: Order["items"] = [];
  for (const line of data.items) {
    const p = await findProduct(line.slug);
    if (!p) return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
    items.push({ slug: p.slug, name: p.name, price: p.price, qty: Math.min(line.qty, p.stock), supplier: p.supplier, supplierSku: p.supplierSku, cost: p.cost });
  }
  const customer = await getCustomer();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);

  const order: Order = {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    status: "placed",
    customer: { name: data.name, phone: data.phone, email: data.email || undefined, city: data.city, address: data.address, notes: data.notes || undefined },
    payment: "cod",
    customerId: customer?.id,
    items, subtotal, shipping, total: subtotal + shipping,
  };

  try {
    await saveOrder(order);
  } catch (e) {
    console.error("Failed to save order", e);
    return NextResponse.json({ error: "We could not place your order right now. Please try again or order on WhatsApp." }, { status: 500 });
  }

  // Place the order on HHC in the background, so the customer doesn't wait for it. If this doesn't finish,
  // the admin dashboard sends it on its next visit.
  if (order.items.some((i) => i.supplier === "hhc")) {
    const send = autoSendEnabled()
      .then((on) => (on ? pushOrderToHhc(order.id) : null))
      .catch((e) => console.error("HHC auto-send failed", order.id, e));
    try {
      (await getCloudflareContext({ async: true })).ctx.waitUntil(send);
    } catch {
      await send;
    }
  }

  // Remember the address for next time if the customer hasn't saved one yet.
  if (customer && !customer.address) {
    await (await db()).prepare(`UPDATE customers SET city = ?, address = ? WHERE id = ?`).bind(data.city, data.address, customer.id).run().catch(() => {});
  }

  return NextResponse.json({ id: order.id, total: order.total });
}

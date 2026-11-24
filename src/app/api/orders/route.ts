import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
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
    const p = getProduct(line.slug);
    if (!p) return NextResponse.json({ error: "A product in your cart is no longer available." }, { status: 400 });
    items.push({ slug: p.slug, name: p.name, price: p.price, qty: Math.min(line.qty, p.stock), supplier: p.supplier, supplierSku: p.supplierSku });
  }
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = shippingFor(subtotal);

  const order: Order = {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    status: "placed",
    customer: { name: data.name, phone: data.phone, email: data.email || undefined, city: data.city, address: data.address, notes: data.notes || undefined },
    payment: "cod",
    items, subtotal, shipping, total: subtotal + shipping,
  };

  try {
    await saveOrder(order);
  } catch (e) {
    console.error("Failed to save order", e);
    return NextResponse.json({ error: "We could not place your order right now. Please try again or order on WhatsApp." }, { status: 500 });
  }

  return NextResponse.json({ id: order.id, total: order.total });
}

import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { getHhcProducts, hhcCostAndStock, HhcError, parseHhcSku } from "@/lib/hhc";
import { listSupplierProducts, updateCostAndStock } from "@/lib/product-store";

// Refresh cost and stock of every product imported from HHC. Prices you set are never changed;
// products whose HHC cost has risen to or above your price are reported so you can reprice them.
export async function POST(req: Request) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  try {
    const linked = (await listSupplierProducts("hhc")).map((l) => ({ ...l, ref: parseHhcSku(l.supplierSku) })).filter((l) => l.ref);
    const hhc = new Map((await getHhcProducts(linked.map((l) => l.ref!.productId))).map((p) => [p.id, p]));
    const updates: { slug: string; cost: number; stock: number }[] = [];
    const unavailable: string[] = [];
    const lossMaking: string[] = [];
    for (const l of linked) {
      const p = hhc.get(l.ref!.productId);
      if (!p) {
        updates.push({ slug: l.slug, cost: l.cost ?? 0, stock: 0 });
        unavailable.push(l.slug);
        continue;
      }
      const { cost, stock, available } = hhcCostAndStock(p, l.ref!.variationId);
      updates.push({ slug: l.slug, cost, stock: available ? stock : 0 });
      if (!available) unavailable.push(l.slug);
      if (l.price - cost < 500) lossMaking.push(l.slug); // margin fell under Rs. 500
    }
    await updateCostAndStock(updates);
    return NextResponse.json({ checked: linked.length, unavailable, lossMaking });
  } catch (e) {
    console.error("HHC sync failed", e);
    return NextResponse.json({ error: e instanceof HhcError ? e.message : "Sync failed" }, { status: e instanceof HhcError ? e.status : 500 });
  }
}

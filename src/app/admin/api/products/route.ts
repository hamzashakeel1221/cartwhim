import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { categories } from "@/lib/catalog";
import { createProduct } from "@/lib/product-store";
import { getSupplier } from "@/lib/suppliers";
import { productInputSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const parsed = productInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product" }, { status: 400 });
  const v = parsed.data;
  if (!categories.some((c) => c.slug === v.category) || !getSupplier(v.supplier)) return NextResponse.json({ error: "Unknown category or supplier" }, { status: 400 });
  try {
    return NextResponse.json({ slug: await createProduct(v) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save. Has the database been updated (npm run db:migrate:remote)?" }, { status: 500 });
  }
}

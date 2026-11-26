import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { categories } from "@/lib/catalog";
import { deleteProduct, updateProduct } from "@/lib/product-store";
import { getSupplier } from "@/lib/suppliers";
import { productInputSchema } from "@/lib/validation";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const parsed = productInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product" }, { status: 400 });
  const v = parsed.data;
  if (!categories.some((c) => c.slug === v.category) || !getSupplier(v.supplier)) return NextResponse.json({ error: "Unknown category or supplier" }, { status: 400 });
  const ok = await updateProduct((await params).slug, v).catch(() => false);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Product not found" }, { status: 404 });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const ok = await deleteProduct((await params).slug).catch(() => false);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Product not found" }, { status: 404 });
}

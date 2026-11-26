import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { deletePhoto, makeMainPhoto } from "@/lib/product-store";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const ok = await deletePhoto((await params).id).catch(() => false);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Photo not found" }, { status: 404 });
}

/** PATCH makes the photo the main (first) one. */
export async function PATCH(req: Request, { params }: Ctx) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const ok = await makeMainPhoto((await params).id).catch(() => false);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Photo not found" }, { status: 404 });
}

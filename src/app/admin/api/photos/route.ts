import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { products as builtIn } from "@/lib/catalog";
import { addPhoto, getAdminProduct, sniffImage } from "@/lib/product-store";

const MAX_BYTES = 1_800_000; // D1 rows are limited to 2 MB; the browser shrinks photos well below this first

export async function POST(req: Request) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  const known = builtIn.some((p) => p.slug === slug) || (await getAdminProduct(slug).catch(() => null));
  if (!known) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  const form = await req.formData().catch(() => null);
  const photo = form?.get("photo");
  const thumb = form?.get("thumb");
  if (!(photo instanceof File)) return NextResponse.json({ error: "No photo" }, { status: 400 });
  const data = await photo.arrayBuffer();
  if (data.byteLength > MAX_BYTES) return NextResponse.json({ error: "Photo is too large" }, { status: 413 });
  const mime = sniffImage(new Uint8Array(data));
  if (!mime) return NextResponse.json({ error: "Use a JPG, PNG or WebP photo" }, { status: 415 });
  let thumbData: ArrayBuffer | null = null;
  if (thumb instanceof File) {
    const t = await thumb.arrayBuffer();
    if (t.byteLength <= 400_000 && sniffImage(new Uint8Array(t))) thumbData = t;
  }
  const res = await addPhoto(slug, mime, data, thumbData).catch((e) => { console.error(e); return { error: "Could not save. Has the database been updated?" }; });
  return "error" in res ? NextResponse.json(res, { status: 400 }) : NextResponse.json(res);
}

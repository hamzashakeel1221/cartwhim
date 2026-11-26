import { readPhoto } from "@/lib/product-store";

// Serves photos uploaded in /admin/products. Photo ids are random and never change content, so browsers can cache them forever.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const thumb = new URL(req.url).searchParams.get("s") === "thumb";
  const photo = await readPhoto(id, thumb).catch(() => null);
  if (!photo) return new Response("Not found", { status: 404 });
  return new Response(photo.data, {
    headers: {
      "Content-Type": photo.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

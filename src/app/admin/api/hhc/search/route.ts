import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { HhcError, searchHhcProducts } from "@/lib/hhc";
import { listSupplierProducts } from "@/lib/product-store";

export async function GET(req: Request) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 80);
  const page = Math.max(1, Math.min(500, Number(url.searchParams.get("page")) || 1));
  const sort = url.searchParams.get("sort");
  try {
    const [list, linked] = await Promise.all([
      searchHhcProducts({ search: q, page, perPage: 24, ...(sort === "price" ? { sort: "price", order: "asc" } : sort === "new" ? { sort: "created_at", order: "desc" } : {}) }),
      listSupplierProducts("hhc").catch(() => []),
    ]);
    // Which HHC products are already in the store, so the admin page can say "Imported".
    const imported: Record<string, string> = {};
    for (const l of linked) if (l.supplierSku) imported[l.supplierSku] = l.slug;
    return NextResponse.json({ page: list.current_page, total: list.total, products: list.data, imported });
  } catch (e) {
    const status = e instanceof HhcError ? e.status : 500;
    console.error("HHC search failed", e);
    return NextResponse.json({ error: e instanceof HhcError ? e.message : "Could not reach HHC" }, { status });
  }
}

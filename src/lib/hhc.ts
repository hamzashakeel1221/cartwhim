import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// HHC Dropshipping developer API (https://member.hhcdropshipping.com/en/public-api).
// The app key is created in HHC under Tools → Integration & Apps → App Keys, and saved in Cloudflare as the
// HHC_APP_KEY secret. It is only ever used on the server, never sent to the browser.

const BASE = "https://api.hhcdropshipping.com/api";
// HHC's firewall answers 403 to requests without a User-Agent, so always send one.
const USER_AGENT = "CartWhim-Integration/1.0";

export type HhcVariation = {
  id: number;
  name: string;
  status: number; // 1 = enabled
  sale_price: number; // the variation's cost to us
  quantity: number;
  sku: string | null;
  product_thumbnail: string | null;
};

export type HhcProduct = {
  id: number;
  name: string;
  description: string | null;
  type: "simple" | "variable";
  wholesalePrice: number; // our cost
  salePrice: number; // HHC's suggested selling price
  pdr: number | null; // delivery ratio, %
  stock_status_name?: string;
  status_name?: string;
  quantity: number;
  weight?: number;
  store_name?: string;
  store_city?: string;
  product_thumbnail: string | null;
  product_galleries?: string[];
  categories?: { id: number; name: string }[];
  variations?: HhcVariation[];
};

type ProductList = { current_page: number; total: number; data: HhcProduct[] };

export class HhcError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

async function appKey(): Promise<string | null> {
  const { env } = await getCloudflareContext({ async: true });
  return env.HHC_APP_KEY?.trim() || null;
}

export async function hhcConfigured() {
  return Boolean(await appKey());
}

async function hhcGet<T>(path: string, params: Record<string, string | number | undefined>): Promise<T> {
  const key = await appKey();
  if (!key) throw new HhcError("HHC is not connected yet: add the HHC_APP_KEY secret in Cloudflare.", 503);
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  const res = await fetch(url, { headers: { "app-key": key, "User-Agent": USER_AGENT, Accept: "application/json" } });
  if (res.status === 403) throw new HhcError("HHC refused the app key. Check that it is active in HHC → Tools → Integration & Apps.", 502);
  if (!res.ok) throw new HhcError(`HHC answered ${res.status}`, 502);
  return (await res.json()) as T;
}

export async function searchHhcProducts(opts: { search?: string; page?: number; perPage?: number; sort?: "price" | "created_at" | "name"; order?: "asc" | "desc" }) {
  return hhcGet<ProductList>("/dropshipper/open/products", {
    search: opts.search?.trim(),
    page: opts.page ?? 1,
    paginate: Math.min(opts.perPage ?? 24, 100),
    sort_by: opts.sort,
    sort_order: opts.sort ? opts.order ?? "asc" : undefined,
  });
}

/** Look up several HHC products by id in one request. */
export async function getHhcProducts(ids: number[]): Promise<HhcProduct[]> {
  const unique = [...new Set(ids.filter((n) => Number.isInteger(n) && n > 0))];
  const out: HhcProduct[] = [];
  for (let i = 0; i < unique.length; i += 25) {
    const chunk = unique.slice(i, i + 25);
    const params: Record<string, string | number> = { paginate: 100 };
    chunk.forEach((id, j) => {
      params[`filters[${j}][field]`] = "id";
      params[`filters[${j}][value]`] = id;
      params[`filters[${j}][operator]`] = "=";
      params[`filters[${j}][type]`] = "or";
    });
    const list = await hhcGet<ProductList>("/dropshipper/open/products", params);
    out.push(...list.data.filter((p) => chunk.includes(p.id)));
  }
  return out;
}

export async function getHhcProduct(id: number) {
  return (await getHhcProducts([id]))[0] ?? null;
}

/** One-time step HHC asks for: tie the app key to the website it is used on. */
export async function activateHhcKey(websiteUrl: string) {
  const key = await appKey();
  if (!key) throw new HhcError("Add the HHC_APP_KEY secret in Cloudflare first.", 503);
  const res = await fetch(BASE + "/dropshipper/open/verify_app_key", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT, Accept: "application/json" },
    body: JSON.stringify({ app_key: key, website_url: websiteUrl }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string; app_name?: string };
  return { ok: res.ok && data.success !== false, message: data.message ?? `HHC answered ${res.status}`, appName: data.app_name };
}

// ───────────── helpers shared by import and sync ─────────────

/** CartWhim stores the HHC link in supplier_sku as "<productId>" or "<productId>-v<variationId>". */
export function hhcSku(productId: number, variationId?: number | null) {
  return variationId ? `${productId}-v${variationId}` : String(productId);
}

export function parseHhcSku(sku: string | null | undefined): { productId: number; variationId: number | null } | null {
  const m = /^(\d+)(?:-v(\d+))?$/.exec(sku?.trim() ?? "");
  return m ? { productId: Number(m[1]), variationId: m[2] ? Number(m[2]) : null } : null;
}

/** Cost and stock for a product, or for one of its variations. */
export function hhcCostAndStock(p: HhcProduct, variationId: number | null): { cost: number; stock: number; available: boolean } {
  const v = variationId ? p.variations?.find((x) => x.id === variationId) : undefined;
  const published = !p.status_name || /publish/i.test(p.status_name);
  const inStock = !p.stock_status_name || /in stock/i.test(p.stock_status_name);
  if (variationId) {
    if (!v) return { cost: Math.round(p.wholesalePrice), stock: 0, available: false };
    return { cost: Math.round(v.sale_price), stock: Math.max(0, v.quantity), available: published && v.status === 1 && v.quantity > 0 };
  }
  return { cost: Math.round(p.wholesalePrice), stock: Math.max(0, p.quantity), available: published && inStock && p.quantity > 0 };
}

export function htmlToText(html: string | null | undefined) {
  return (html ?? "")
    .replace(/<\s*(br|\/p|\/li|\/h\d)\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();
}

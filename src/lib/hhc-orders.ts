import "server-only";
import { db, last10 } from "./db";
import {
  getHhcProductBySlug, hhcCheckoutPreview, HhcError, listBusinessProfiles, listCourierCities, listHhcOrders, parseHhcSku, placeHhcOrder,
  type HhcCourierCity, type HhcOrderLine,
} from "./hhc";
import { getOrder, getSetting, setSetting, type Order, type OrderStatus } from "./orders";

// Sends store orders to HHC Dropshipping automatically, and brings HHC's status, tracking and profit back.
//
// Flow: checkout saves the order (hhc_push = pending) and calls pushOrderToHhc in the background, so the
// customer never waits for HHC. Anything that fails is retried when the admin dashboard is opened, and can
// be retried by hand from the order page (where a different HHC city can be chosen).

export const AUTO_SEND_KEY = "hhc_auto_send"; // "off" turns automatic sending off
const BP_KEY = "hhc_bp_id";
const LAST_SYNC_KEY = "hhc_last_status_sync";

export async function autoSendEnabled() {
  return (await getSetting(AUTO_SEND_KEY)) !== "off";
}

// ───────────── helpers ─────────────

/** HHC wants 03XXXXXXXXX. */
export function hhcPhone(phone: string) {
  const ten = last10(phone);
  return /^3\d{9}$/.test(ten) ? "0" + ten : null;
}

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z]/g, "");

/** Courier-city entries ("CityName-CourierName") that match a city name, best match first. */
export function matchCourierCities(cities: HhcCourierCity[], city: string): HhcCourierCity[] {
  const want = norm(city.replace(/\(.*?\)/g, ""));
  if (!want) return [];
  const name = (c: HhcCourierCity) => norm(c.cityName.replace(/-[^-]*$/, ""));
  const exact = cities.filter((c) => name(c) === want);
  if (exact.length) return exact;
  return cities.filter((c) => name(c).startsWith(want) || want.startsWith(name(c)));
}

/** Picks the cheapest courier for the city, using HHC's checkout preview; falls back to the first match. */
async function chooseDestination(lines: HhcOrderLine[], candidates: HhcCourierCity[]): Promise<HhcCourierCity> {
  if (candidates.length === 1) return candidates[0];
  try {
    const preview = await hhcCheckoutPreview(lines, candidates[0].id);
    const lowest = (preview.estimatedShipping ?? []).find((e) => e.is_lowest === true || e.is_lowest === 1);
    const cid = lowest && (lowest.courier_id ?? lowest.courierID ?? lowest.courierId ?? lowest.id);
    const hit = cid !== undefined ? candidates.find((c) => c.id.startsWith(`${cid}-`)) : undefined;
    if (hit) return hit;
  } catch {
    // The preview is only used to pick a courier; the order itself reports real errors.
  }
  return candidates[0];
}

async function businessProfileId(): Promise<number> {
  const saved = Number(await getSetting(BP_KEY));
  if (saved > 0) return saved;
  const profiles = (await listBusinessProfiles()).filter((p) => p.isVerified === true || p.isVerified === 1);
  const bp = profiles.find((p) => p.bpDefault === true || p.bpDefault === 1) ?? profiles[0];
  if (!bp) throw new HhcError("Your HHC account has no verified business profile. Add one in HHC → Business Profiles, then press Send again.", 422);
  await setSetting(BP_KEY, String(bp.id));
  return bp.id;
}

async function hhcLines(order: Order): Promise<HhcOrderLine[]> {
  const lines: HhcOrderLine[] = [];
  for (const item of order.items.filter((i) => i.supplier === "hhc")) {
    const ref = parseHhcSku(item.supplierSku);
    if (ref) {
      lines.push({ product_id: ref.productId, variation_id: ref.variationId, quantity: item.qty });
      continue;
    }
    if (!item.supplierSku) throw new HhcError(`"${item.name}" has no HHC product code.`, 422);
    const p = await getHhcProductBySlug(item.supplierSku);
    if (!p) throw new HhcError(`"${item.name}" is no longer listed on HHC.`, 422);
    if (p.type === "variable") {
      const enabled = (p.variations ?? []).filter((v) => v.status === 1);
      if (enabled.length !== 1) throw new HhcError(`"${item.name}" comes in several options on HHC. Place this order on HHC by hand.`, 422);
      lines.push({ product_id: p.id, variation_id: enabled[0].id, quantity: item.qty });
    } else {
      lines.push({ product_id: p.id, quantity: item.qty });
    }
  }
  return lines;
}

async function markFailed(id: string, message: string) {
  await (await db())
    .prepare(`UPDATE orders SET hhc_push = 'failed', hhc_error = ?, updated_at = ? WHERE id = ?`)
    .bind(message.slice(0, 500), new Date().toISOString(), id)
    .run();
}

/** An order from the same phone with the same items in the last 6 hours that already went to HHC. */
async function findDuplicate(order: Order): Promise<string | null> {
  const since = new Date(Date.parse(order.createdAt) - 6 * 3600_000).toISOString();
  const { results } = await (await db())
    .prepare(`SELECT id FROM orders WHERE phone_last10 = ? AND id != ? AND created_at >= ? AND hhc_push IN ('sent', 'sending') AND status != 'cancelled'`)
    .bind(last10(order.customer.phone), order.id, since)
    .all<{ id: string }>();
  const key = (o: Order) => o.items.map((i) => `${i.slug}x${i.qty}`).sort().join(",");
  for (const r of results) {
    const other = await getOrder(r.id);
    if (other && key(other) === key(order)) return other.id;
  }
  return null;
}

// ───────────── sending ─────────────

export type PushResult = { ok: true; hhcOrderId: number } | { ok: false; error: string };

/**
 * Places the order on HHC. Safe to call more than once: only one call can claim an order, and an order that
 * already has an HHC order id is never sent again.
 * `manual` skips the duplicate check (the admin pressed Send); `city` overrides the city used to find the courier.
 */
export async function pushOrderToHhc(id: string, opts: { manual?: boolean; city?: string } = {}): Promise<PushResult> {
  const d = await db();
  const now = new Date().toISOString();
  const staleSending = new Date(Date.now() - 5 * 60_000).toISOString();
  const claim = await d
    .prepare(
      `UPDATE orders SET hhc_push = 'sending', hhc_attempts = hhc_attempts + 1, hhc_error = NULL, updated_at = ?
       WHERE id = ? AND hhc_order_id IS NULL AND status != 'cancelled'
         AND (hhc_push IN ('pending', 'failed') OR (hhc_push = 'skipped' AND ? = 1) OR (hhc_push = 'sending' AND updated_at < ?))`,
    )
    .bind(now, id, opts.manual ? 1 : 0, staleSending)
    .run();
  if (!claim.meta.changes) return { ok: false, error: "This order is already sent, cancelled, or being sent." };

  const order = await getOrder(id);
  if (!order) return { ok: false, error: "Order not found." };
  try {
    if (!order.items.some((i) => i.supplier === "hhc")) throw new HhcError("This order has no HHC products.", 422);
    if (!opts.manual) {
      const dup = await findDuplicate(order);
      if (dup) throw new HhcError(`Held: looks like a repeat of order ${dup} (same phone and products). Press Send if it is a real second order.`, 422);
    }
    const phone = hhcPhone(order.customer.phone);
    if (!phone) throw new HhcError("The phone number is not a Pakistani mobile number (03XXXXXXXXX).", 422);

    const lines = await hhcLines(order);
    const city = opts.city?.trim() || order.customer.city;
    const candidates = matchCourierCities(await listCourierCities(), city);
    if (!candidates.length) throw new HhcError(`HHC couriers don't list the city "${city}". Type the nearest city HHC delivers to and press Send.`, 422);
    const destination = await chooseDestination(lines, candidates);

    const hhcItemsTotal = order.items.filter((i) => i.supplier === "hhc").reduce((s, i) => s + i.price * i.qty, 0);
    const sellPrice = hhcItemsTotal + order.shipping; // the COD amount the courier collects
    const placed = await placeHhcOrder({
      products: lines, fullName: order.customer.name, address: order.customer.address, destinationCity: destination.id, phone,
      bpId: await businessProfileId(), sellPrice,
    });
    if (!placed?.id) throw new HhcError("HHC did not return an order number.", 502);

    await d
      .prepare(
        `UPDATE orders SET hhc_push = 'sent', hhc_order_id = ?, hhc_error = NULL, hhc_status = ?, hhc_courier = ?, hhc_cost = ?, hhc_profit = ?,
           status = CASE WHEN status = 'placed' THEN 'confirmed' ELSE status END, updated_at = ? WHERE id = ?`,
      )
      .bind(
        placed.id, placed.order_status_name ?? "Pending", placed.courier_name ?? destination.cityName.replace(/^.*-/, ""),
        placed.total != null ? Math.round(placed.total) : null, placed.profit != null ? Math.round(placed.profit) : null, new Date().toISOString(), id,
      )
      .run();
    return { ok: true, hhcOrderId: placed.id };
  } catch (e) {
    const message = e instanceof HhcError ? e.message : "Could not reach HHC. It will be retried.";
    console.error("HHC order push failed", id, e);
    await markFailed(id, message);
    return { ok: false, error: message };
  }
}

/** Sends orders still waiting (checkout's background send did not finish, or HHC was down). */
export async function pushPendingOrders(max = 10) {
  if (!(await autoSendEnabled())) return 0;
  const before = new Date(Date.now() - 2 * 60_000).toISOString();
  const { results } = await (await db())
    .prepare(
      `SELECT id FROM orders WHERE hhc_order_id IS NULL AND status != 'cancelled' AND created_at < ?
         AND (hhc_push = 'pending' OR (hhc_push = 'failed' AND hhc_attempts < 3 AND hhc_error LIKE 'Could not reach HHC%'))
       ORDER BY created_at LIMIT ?`,
    )
    .bind(before, max)
    .all<{ id: string }>();
  for (const r of results) await pushOrderToHhc(r.id);
  return results.length;
}

// ───────────── status sync ─────────────

/** Maps HHC's order status to the store's own status. Returns null for statuses that don't change it. */
export function storeStatusFor(hhcStatus: string | undefined | null): OrderStatus | null {
  const s = norm(hhcStatus ?? "");
  if (!s) return null;
  if (["delivered", "completed"].includes(s)) return "delivered";
  if (["cancelled", "canceled", "cancelledbysupplier"].includes(s)) return "cancelled";
  if (s.startsWith("return") && s !== "returnconfirmationpending") return "returned"; // Return, Return In Transit, Return Received
  if (["dispatched", "intransit", "arrivedathhc", "dispatchedfromhhc", "returnconfirmationpending", "reattemptrequest", "outfordelivery"].includes(s)) return "dispatched";
  if (["pending", "processing", "booked", "preparing", "pickupready", "readyforpickup", "onhold", "pendingpayment"].includes(s)) return "confirmed";
  return null;
}

/** HHC statuses where HHC is waiting for you to choose re-attempt or return. */
export const needsDecision = (hhcStatus?: string) => norm(hhcStatus ?? "") === "returnconfirmationpending";

export async function lastStatusSync() {
  return getSetting(LAST_SYNC_KEY);
}

/** Pulls status, tracking, courier and profit for every order sent to HHC in the last 90 days. */
export async function syncHhcStatuses(): Promise<{ updated: number; checked: number }> {
  const d = await db();
  const { results: mine } = await d
    .prepare(`SELECT id, hhc_order_id, status, created_at FROM orders WHERE hhc_order_id IS NOT NULL ORDER BY created_at LIMIT 5000`)
    .all<{ id: string; hhc_order_id: number; status: OrderStatus; created_at: string }>();
  if (!mine.length) {
    await setSetting(LAST_SYNC_KEY, new Date().toISOString());
    return { updated: 0, checked: 0 };
  }
  const oldest = new Date(Math.max(Date.parse(mine[0].created_at) - 86400_000, Date.now() - 90 * 86400_000)).toISOString().slice(0, 10);
  const remote = new Map((await listHhcOrders({ dateFrom: oldest, pages: 10 })).map((o) => [o.id, o]));
  const now = new Date().toISOString();
  const stmts: D1PreparedStatement[] = [];
  for (const m of mine) {
    const r = remote.get(m.hhc_order_id);
    if (!r) continue;
    const mapped = storeStatusFor(r.order_status_name);
    stmts.push(
      d.prepare(
        `UPDATE orders SET hhc_status = ?, hhc_tracking = COALESCE(?, hhc_tracking), hhc_courier = COALESCE(?, hhc_courier),
           hhc_cost = COALESCE(?, hhc_cost), hhc_profit = COALESCE(?, hhc_profit), status = COALESCE(?, status), updated_at = ? WHERE id = ?`,
      ).bind(
        r.order_status_name ?? null, r.tracking_no ?? null, r.courier_name ?? null,
        r.total != null ? Math.round(r.total) : null, r.profit != null ? Math.round(r.profit) : null, mapped, now, m.id,
      ),
    );
  }
  for (let i = 0; i < stmts.length; i += 50) await d.batch(stmts.slice(i, i + 50));
  await setSetting(LAST_SYNC_KEY, now);
  return { updated: stmts.length, checked: mine.length };
}

/** Runs when the dashboard opens: sends waiting orders and refreshes statuses at most every 10 minutes. */
export async function autoRefresh(): Promise<{ error?: string }> {
  try {
    await pushPendingOrders();
    const last = await lastStatusSync();
    if (!last || Date.now() - Date.parse(last) > 10 * 60_000) await syncHhcStatuses();
    return {};
  } catch (e) {
    return { error: e instanceof HhcError ? e.message : "Could not reach HHC to refresh order statuses." };
  }
}

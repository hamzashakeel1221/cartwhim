import type { HhcPush, OrderStatus } from "@/lib/orders";

export const statusMeta: Record<OrderStatus, { label: string; badge: string; bar: string }> = {
  placed: { label: "New", badge: "bg-amber-50 text-amber-800 ring-amber-200", bar: "#f59e0b" },
  confirmed: { label: "Confirmed", badge: "bg-sky-50 text-sky-800 ring-sky-200", bar: "#0ea5e9" },
  dispatched: { label: "On the way", badge: "bg-indigo-50 text-indigo-800 ring-indigo-200", bar: "#6366f1" },
  delivered: { label: "Delivered", badge: "bg-emerald-50 text-emerald-800 ring-emerald-200", bar: "#10b981" },
  returned: { label: "Returned", badge: "bg-rose-50 text-rose-800 ring-rose-200", bar: "#e11d48" },
  cancelled: { label: "Cancelled", badge: "bg-stone-100 text-stone-600 ring-stone-200", bar: "#a8a29e" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const m = statusMeta[status];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${m.badge}`}>{m.label}</span>;
}

const pushMeta: Record<HhcPush, { label: string; cls: string }> = {
  pending: { label: "Sending to HHC", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  sending: { label: "Sending to HHC", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  sent: { label: "On HHC", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  failed: { label: "Needs attention", cls: "bg-red-50 text-red-700 ring-red-200" },
  skipped: { label: "Not on HHC", cls: "bg-stone-100 text-stone-600 ring-stone-200" },
};

export function HhcBadge({ push, orderId }: { push: HhcPush; orderId?: number }) {
  const m = pushMeta[push];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${m.cls}`}>
      {m.label}
      {orderId ? ` #${orderId}` : ""}
    </span>
  );
}

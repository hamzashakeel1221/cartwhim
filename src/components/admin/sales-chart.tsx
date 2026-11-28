"use client";

import { useState } from "react";
import type { DayPoint } from "@/lib/analytics";

const pkr = (n: number) => "Rs. " + new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(n);
const short = (n: number) => (n >= 100000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));
const dayLabel = (d: string, opts: Intl.DateTimeFormatOptions) => new Date(d + "T12:00:00Z").toLocaleDateString("en-PK", { ...opts, timeZone: "UTC" });

/** Sales per day, one bar per day, with a hover tooltip showing orders and sales. */
export function SalesChart({ points }: { points: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 220;
  const pad = { l: 44, r: 8, t: 12, b: 26 };
  const max = Math.max(1, ...points.map((p) => p.sales));
  const step = niceStep(max / 4);
  const top = Math.ceil(max / step) * step;
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const slot = plotW / points.length;
  const barW = Math.max(2, Math.min(28, slot - 2));
  const y = (v: number) => pad.t + plotH - (v / top) * plotH;
  const labelEvery = Math.ceil(points.length / 8);
  const p = hover != null ? points[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Sales per day" onMouseLeave={() => setHover(null)}>
        {Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#e7e5e4" strokeWidth={1} />
            <text x={pad.l - 6} y={y(v) + 4} textAnchor="end" fontSize={11} fill="#78716c">{short(v)}</text>
          </g>
        ))}
        {points.map((pt, i) => {
          const x = pad.l + i * slot + (slot - barW) / 2;
          const h = pad.t + plotH - y(pt.sales);
          return (
            <g key={pt.day}>
              {h > 0 && (
                <path
                  d={roundedTop(x, y(pt.sales), barW, h, Math.min(4, barW / 2))}
                  fill={hover === i ? "#b73c12" : "#f2622e"}
                />
              )}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#78716c">
                  {dayLabel(pt.day, { day: "numeric", month: "short" })}
                </text>
              )}
              {/* Hit target: the whole column, wider than the bar */}
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} />
            </g>
          );
        })}
      </svg>
      {p && hover != null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: `${((pad.l + hover * slot + slot / 2) / W) * 100}%` }}
        >
          <p className="font-semibold">{dayLabel(p.day, { weekday: "short", day: "numeric", month: "short" })}</p>
          <p>{p.orders} order{p.orders === 1 ? "" : "s"} · {pkr(p.sales)}</p>
        </div>
      )}
    </div>
  );
}

function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(Math.max(raw, 1)));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
}

function roundedTop(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}

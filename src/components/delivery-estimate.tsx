"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { pakistanCities } from "@/lib/store-config";

// Courier days from HHC's warehouses (pickup to first delivery attempt, Sundays and holidays not counted),
// using the fastest courier on each route. Source: HHC "RouteWise Delivery Time", platform-wide data, Nov 2026.
const COURIER_DAYS: Record<"Karachi" | "Lahore", Record<string, number>> = {
  Karachi: { Karachi: 1, Hyderabad: 1, Faisalabad: 2, Sialkot: 2, Lahore: 3, Islamabad: 3, Rawalpindi: 3, Multan: 3, Peshawar: 3, Quetta: 3, Gujranwala: 3 },
  Lahore: { Lahore: 1, Sialkot: 1, Karachi: 2, Islamabad: 2, Rawalpindi: 2, Faisalabad: 2, Multan: 2, Peshawar: 2, Gujranwala: 2, Hyderabad: 3, Quetta: 4 },
};
const OTHER_CITY_DAYS = 4; // smaller cities: HHC's median is 3 days, 90% arrive within 5
const DISPATCH_DAYS = 1; // the supplier packs and hands over to the courier

/** Working days until delivery, as [earliest, latest]. When the warehouse is unknown, the slower of Karachi and Lahore is used. */
export function deliveryDays(city: string, shipsFrom?: "Karachi" | "Lahore"): [number, number] {
  const origins = shipsFrom ? [shipsFrom] : (["Karachi", "Lahore"] as const);
  const courier = Math.max(...origins.map((o) => COURIER_DAYS[o][city] ?? OTHER_CITY_DAYS));
  return [DISPATCH_DAYS + courier, DISPATCH_DAYS + courier + 1];
}

function addWorkingDays(d: Date, n: number) {
  const r = new Date(d);
  while (n > 0) {
    r.setDate(r.getDate() + 1);
    if (r.getDay() !== 0) n--; // couriers don't deliver on Sunday
  }
  return r;
}

const fmt = (d: Date) => d.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });

export function DeliveryEstimate({ shipsFrom }: { shipsFrom?: "Karachi" | "Lahore" }) {
  const [city, setCity] = useState("Lahore");
  const [range, setRange] = useState<string | null>(null);

  useEffect(() => {
    try { const c = localStorage.getItem("cartwhim-city"); if (c) setCity(c); } catch {}
  }, []);

  useEffect(() => {
    const now = new Date();
    const [a, b] = deliveryDays(city, shipsFrom);
    setRange(`${fmt(addWorkingDays(now, a))} to ${fmt(addWorkingDays(now, b))} (${a} to ${b} working days)`);
  }, [city, shipsFrom]);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
      <MapPin className="h-4 w-4 shrink-0" />
      <span>Deliver to</span>
      <select
        aria-label="Your city"
        value={city}
        onChange={(e) => { setCity(e.target.value); try { localStorage.setItem("cartwhim-city", e.target.value); } catch {} }}
        className="rounded-lg bg-white/80 px-2 py-1 font-semibold outline-none ring-1 ring-emerald-200"
      >
        {pakistanCities.filter((c) => c !== "Other").map((c) => <option key={c}>{c}</option>)}
      </select>
      {range && <span>· arrives <b>{range}</b></span>}
    </div>
  );
}

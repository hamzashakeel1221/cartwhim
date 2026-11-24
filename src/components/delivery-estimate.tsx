"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { pakistanCities } from "@/lib/store-config";

const fast = new Set(["Karachi", "Lahore", "Islamabad", "Rawalpindi"]);

function addWorkingDays(d: Date, n: number) {
  const r = new Date(d);
  while (n > 0) {
    r.setDate(r.getDate() + 1);
    if (r.getDay() !== 0) n--; // couriers don't deliver on Sunday
  }
  return r;
}

const fmt = (d: Date) => d.toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" });

export function DeliveryEstimate() {
  const [city, setCity] = useState("Lahore");
  const [range, setRange] = useState<string | null>(null);

  useEffect(() => {
    try { const c = localStorage.getItem("cartwhim-city"); if (c) setCity(c); } catch {}
  }, []);

  useEffect(() => {
    const now = new Date();
    const [a, b] = fast.has(city) ? [2, 3] : [3, 5];
    setRange(`${fmt(addWorkingDays(now, a))} to ${fmt(addWorkingDays(now, b))}`);
  }, [city]);

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

"use client";

import { useEffect, useState } from "react";

// Counts down to midnight Pakistan time (UTC+5), when daily deals reset.
function msToMidnightPKT() {
  const now = Date.now();
  const pkt = new Date(now + 5 * 3600_000);
  const next = Date.UTC(pkt.getUTCFullYear(), pkt.getUTCMonth(), pkt.getUTCDate() + 1) - 5 * 3600_000;
  return next - now;
}

export function Countdown() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    setMs(msToMidnightPKT());
    const t = setInterval(() => setMs(msToMidnightPKT()), 1000);
    return () => clearInterval(t);
  }, []);
  const parts = ms === null ? ["--", "--", "--"] : [ms / 3600_000, (ms / 60_000) % 60, (ms / 1000) % 60].map((n) => String(Math.floor(n)).padStart(2, "0"));
  return (
    <div className="flex items-center gap-1 font-mono text-sm font-bold tabular-nums" aria-label="Time left for today's deals">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-md bg-ink px-1.5 py-1 text-white">{p}</span>
          {i < 2 && <span className="text-ink">:</span>}
        </span>
      ))}
    </div>
  );
}

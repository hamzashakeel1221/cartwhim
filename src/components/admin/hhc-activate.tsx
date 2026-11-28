"use client";

import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;

// HHC links an app key to the website that uses it. This only needs to be done once per key.
export function HhcActivate() {
  const [state, setState] = useState<{ busy?: boolean; ok?: boolean; text?: string }>({});
  async function activate() {
    setState({ busy: true });
    const res = await fetch("/admin/api/hhc/activate", { method: "POST", headers: { "x-cartwhim-admin": "1" } });
    const body = (await res.json().catch(() => ({}))) as Loose;
    setState({ ok: res.ok, text: res.ok ? `Key linked to ${body.site}${body.appName ? ` (${body.appName})` : ""}.` : body.message ?? body.error ?? "HHC did not accept the key" });
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-stone-200/70">
      <span className="text-stone-600">First time with this key? Link it to this website once.</span>
      <button onClick={activate} disabled={state.busy} className="font-semibold text-brand-600">{state.busy ? "Linking…" : "Link key to website"}</button>
      {state.text && <span className={state.ok ? "text-emerald-700" : "text-red-600"}>{state.text}</span>}
    </div>
  );
}

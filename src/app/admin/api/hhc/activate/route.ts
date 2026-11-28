import { NextResponse } from "next/server";
import { guardAdmin } from "@/lib/admin-guard";
import { activateHhcKey, HhcError } from "@/lib/hhc";

// HHC ties each app key to one website. Run once after saving the key.
export async function POST(req: Request) {
  const denied = guardAdmin(req);
  if (denied) return denied;
  try {
    const site = new URL(req.url).origin;
    const res = await activateHhcKey(site);
    return NextResponse.json({ ...res, site }, { status: res.ok ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof HhcError ? e.message : "Could not reach HHC" }, { status: 502 });
  }
}

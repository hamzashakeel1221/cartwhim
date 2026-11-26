import { NextResponse } from "next/server";

// /admin is behind Basic Auth (middleware.ts). Browsers attach Basic Auth to every request, so state-changing
// admin API calls also need a custom header (which other websites cannot send) and must not be cross-site.
export function guardAdmin(req: Request): NextResponse | null {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (req.headers.get("x-cartwhim-admin") !== "1") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

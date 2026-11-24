import { NextResponse } from "next/server";
import { getCustomer } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Used by checkout to pre-fill the form for logged-in customers.
export async function GET() {
  const me = await getCustomer();
  if (!me) return NextResponse.json({ customer: null }, { headers: { "Cache-Control": "no-store" } });
  const { name, email, phone, city, address } = me;
  return NextResponse.json({ customer: { name, email, phone, city, address } }, { headers: { "Cache-Control": "no-store" } });
}

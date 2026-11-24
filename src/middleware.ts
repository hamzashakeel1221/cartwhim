import { NextResponse, type NextRequest } from "next/server";

// Protects /admin with HTTP Basic Auth. Set ADMIN_PASSWORD in your environment (.env.local).
export function middleware(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse("Admin is disabled: set ADMIN_PASSWORD.", { status: 503 });
  const header = req.headers.get("authorization") ?? "";
  const [, encoded] = header.split(" ");
  const supplied = encoded ? atob(encoded).split(":").slice(1).join(":") : "";
  if (supplied === password) return NextResponse.next();
  return new NextResponse("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="CartWhim admin"' } });
}

export const config = { matcher: ["/admin/:path*"] };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GUEST_COOKIE } from "@/lib/guest";

const YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(GUEST_COOKIE)?.value;
  if (existing) return NextResponse.next();

  const guestId = crypto.randomUUID();

  // Forward the new cookie on the request headers too, so it's readable
  // via cookies() during this same request (SSR pages, route handlers).
  const requestHeaders = new Headers(request.headers);
  const cookieHeader = requestHeaders.get("cookie");
  requestHeaders.set(
    "cookie",
    cookieHeader ? `${cookieHeader}; ${GUEST_COOKIE}=${guestId}` : `${GUEST_COOKIE}=${guestId}`
  );

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.cookies.set(GUEST_COOKIE, guestId, {
    maxAge: YEAR,
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

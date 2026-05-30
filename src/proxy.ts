import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Checks if the redirect URL is safe to prevent open redirect vulnerabilities.
 * A URL is safe if it is a relative path (starts with '/') but not relative-protocol (does not start with '//').
 */
function isSafeRedirectUrl(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}

export function proxy(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;
  const hasFlaskSession = request.cookies.has("session");

  const isAuthRoute = path.startsWith("/auth");
  const isAdminRoute = path.startsWith("/admin");
  const isClientRoute = path.startsWith("/client");

  if (isAuthRoute && hasFlaskSession) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  if ((isAdminRoute || isClientRoute) && !hasFlaskSession) {
    const rawCallback = request.nextUrl.searchParams.get("next") ?? path;
    const callbackUrl = isSafeRedirectUrl(rawCallback) ? rawCallback : "/";
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/auth/:path*"],
};

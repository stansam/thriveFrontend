import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasFlaskSession = request.cookies.has("session");

  const isAuthRoute = path.startsWith("/auth");
  const isAdminRoute = path.startsWith("/admin");
  const isClientRoute = path.startsWith("/client");

  if (isAuthRoute && hasFlaskSession) {
    return NextResponse.redirect(new URL("/client", request.url));
  }

  if ((isAdminRoute || isClientRoute) && !hasFlaskSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/auth/:path*"],
};

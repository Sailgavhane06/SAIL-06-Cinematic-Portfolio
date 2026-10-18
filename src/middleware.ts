import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const COOKIE_NAME = "sail06_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and subroutes, but allow /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Inspect token structure and expiration
    try {
      const parts = sessionCookie.value.split(".");
      if (parts.length !== 2) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(COOKIE_NAME);
        return response;
      }

      // Check timestamp expiration from data chunk
      const json = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(json);
      const now = Math.floor(Date.now() / 1000);

      const isValidRole = payload.role === "admin" || payload.role === "owner";
      if (!payload.exp || payload.exp < now || !isValidRole) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(COOKIE_NAME);
        return response;
      }
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAuthPage = path === "/login";
  const isAdminRoute = path.startsWith("/admin");

  // Get auth cookie
  const authCookie = request.cookies.get("admin_auth");

  // If trying to access admin routes without auth, redirect to login
  if (isAdminRoute && (!authCookie || authCookie.value !== "true")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If already authenticated and trying to access login page, redirect to admin
  if (isAuthPage && authCookie && authCookie.value === "true") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

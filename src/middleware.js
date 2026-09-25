// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { routeAccess } from "@/constants/middleware/WiddelwareAuth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Never handle NextAuth internal API routes in middleware.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Skip all API routes.
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Skip Next.js internals and static assets.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  for (const route of routeAccess) {
    const match =
      pathname === route.path ||
      pathname.startsWith(route.path + "/");

    if (!match) {
      continue;
    }

    // Redirect authenticated users away from guest-only pages.
    if (route.guestOnly && token) {
      return NextResponse.redirect(new URL(route.redirect, req.url));
    }

    // Protect role-based routes.
    if (route.roles) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      if (!route.roles.includes(token.role)) {
        return NextResponse.redirect(new URL(route.redirect, req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};

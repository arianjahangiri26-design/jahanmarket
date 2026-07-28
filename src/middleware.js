import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { routeAccess } from "@/constants/middleware/WiddelwareAuth"

export async function middleware(req) {
  const { pathname } = req.nextUrl

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  for (const route of routeAccess) {
    const match =
      pathname === route.path ||
      pathname.startsWith(route.path + "/")

    if (!match) continue

    if (route.guestOnly && token) {
      return NextResponse.redirect(new URL(route.redirect, req.url))
    }

    if (route.roles) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }

      if (!route.roles.includes(token.role)) {
        return NextResponse.redirect(new URL(route.redirect, req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [ "/admin/:path* /auth/:path*"],
}

import { NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "./src/lib/auth/core"

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"])
const PUBLIC_ADMIN_API_PATHS = new Set(["/api/admin/auth/login", "/api/admin/auth/logout"])

export async function proxy(request) {
  const { pathname } = request.nextUrl
  const session = await getAdminSessionFromRequest(request)
  const isAuthenticated = Boolean(session)

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  if (PUBLIC_ADMIN_API_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Debes iniciar sesion para continuar." }, { status: 401 })
    }

    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

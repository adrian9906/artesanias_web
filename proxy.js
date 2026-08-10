import { NextResponse } from "next/server"
import { getAdminSessionFromRequest } from "./src/lib/auth/core"

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"])
const PUBLIC_ADMIN_API_PATHS = new Set(["/api/admin/auth/login", "/api/admin/auth/logout"])

function isAdminPagePath(pathname) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

function isAdminApiPath(pathname) {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/")
}

export async function proxy(request) {
  const { pathname } = request.nextUrl

  if (!isAdminPagePath(pathname) && !isAdminApiPath(pathname)) {
    return NextResponse.next()
  }

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
    if (isAdminApiPath(pathname)) {
      return NextResponse.json(
        { error: "Debes iniciar sesion para continuar." },
        { status: 401 },
      )
    }

    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Include bare /admin and /api/admin; :path* alone can miss the root segment.
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
}

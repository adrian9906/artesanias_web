import { jsonError, jsonOk } from "@/lib/cms/store"
import { setAdminSessionCookie, validateAdminCredentials } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const username = String(body?.username || "").trim()
  const password = String(body?.password || "")

  if (!username || !password) {
    return jsonError("Escribe tu usuario y contrasena.")
  }

  const result = validateAdminCredentials(username, password)
  if (!result.ok) {
    return jsonError(result.error, result.error.startsWith("Faltan") ? 500 : 401)
  }

  await setAdminSessionCookie()

  return jsonOk({
    ok: true,
    user: {
      username,
      role: "admin",
    },
  })
}

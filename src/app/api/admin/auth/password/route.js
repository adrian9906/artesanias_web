import { jsonError, jsonOk } from "@/lib/cms/store"
import { getAdminSecurityStatus, updateAdminPassword } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export async function GET() {
  const status = await getAdminSecurityStatus()
  return jsonOk(status)
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const currentPassword = String(body?.currentPassword || "")
  const nextPassword = String(body?.nextPassword || "")
  const confirmPassword = String(body?.confirmPassword || "")

  if (!currentPassword || !nextPassword || !confirmPassword) {
    return jsonError("Completa todos los campos.")
  }

  if (nextPassword !== confirmPassword) {
    return jsonError("La confirmación no coincide con la nueva contraseña.")
  }

  const result = await updateAdminPassword(currentPassword, nextPassword)
  if (!result.ok) {
    return jsonError(result.error)
  }

  const status = await getAdminSecurityStatus()
  return jsonOk({
    ok: true,
    message: "Contraseña actualizada correctamente.",
    status,
  })
}

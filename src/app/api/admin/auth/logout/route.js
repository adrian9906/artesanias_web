import { clearAdminSessionCookie } from "@/lib/auth/session"
import { jsonOk } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function POST() {
  await clearAdminSessionCookie()
  return jsonOk({ ok: true })
}

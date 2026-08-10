import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"
import { ANALYTICS_COOKIE_MAX_AGE, ANALYTICS_COOKIE_NAME, EVENT_KINDS, recordAnalyticsEvent } from "@/lib/analytics/events"
import { jsonError, jsonOk } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

function readIp(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || ""
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos invalidos.")

  const kind = EVENT_KINDS.includes(body.kind) ? body.kind : ""
  if (!kind) return jsonError("Tipo de evento invalido.", 400)

  const cookieStore = await cookies()
  const ip = readIp(request)
  const visitorId =
    String(body.visitor || "").slice(0, 80) ||
    cookieStore.get(ANALYTICS_COOKIE_NAME)?.value ||
    ""

  const sessionId = visitorId || `${ip}-${Math.random().toString(36).slice(2, 10)}`

  await recordAnalyticsEvent({
    kind,
    path: body.path,
    productId: body.productId,
    product: body.product,
    referrer: body.referrer,
    sessionId,
  })

  const response = jsonOk({ ok: true })
  if (!visitorId) {
    const token = randomUUID()
    response.headers.set(
      "Set-Cookie",
      `${ANALYTICS_COOKIE_NAME}=${token}; Path=/; Max-Age=${ANALYTICS_COOKIE_MAX_AGE}; SameSite=Lax`,
    )
  }

  return response
}
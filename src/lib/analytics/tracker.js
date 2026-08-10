const TRACK_URL = "/api/analytics/track"
const VISITOR_KEY = "thay_visitor"
const TRACK_SECONDS = 45

const lastSentByPath = new Map()

function getVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const created = crypto.randomUUID()
    window.localStorage.setItem(VISITOR_KEY, created)
    return created
  } catch {
    return ""
  }
}

function send(payload) {
  const visitor = getVisitorId()
  const body = visitor ? { ...payload, visitor } : payload

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        TRACK_URL,
        new Blob([JSON.stringify(body)], { type: "application/json" }),
      )
      return
    }
  } catch {
    // sendBeacon falla en algunos navegadores con datos grandes
  }

  fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {})
}

export function trackPageview(path, referrer) {
  if (typeof window === "undefined") return

  const now = Date.now()
  const lastSent = lastSentByPath.get(path) || 0
  if (now - lastSent < TRACK_SECONDS * 1000) return
  lastSentByPath.set(path, now)

  send({ kind: "pageview", path, referrer: referrer || "" })
}

export function trackWhatsApp({ productId, product }) {
  if (typeof window === "undefined") return
  send({ kind: "whatsapp", productId, product, path: window.location.pathname })
}
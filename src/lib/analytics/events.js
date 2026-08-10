import { prisma } from "@/lib/prisma"

export const ANALYTICS_COOKIE_NAME = "thay_visit"
export const ANALYTICS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const EVENT_KINDS = ["pageview", "whatsapp"]

function clampRange(value) {
  const parsed = Number.parseInt(String(value || ""), 10)
  if (Number.isNaN(parsed)) return 30
  return Math.min(90, Math.max(3, parsed))
}

function percentChange(current, previous) {
  if (!previous || previous === 0) return null
  return Math.round(((current - previous) / previous) * 100)
}

function referrerDomain(value) {
  if (!value) return ""
  try {
    return new URL(value).hostname.replace(/^www\./, "")
  } catch {
    return ""
  }
}

function dayKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function toLocalDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export async function recordAnalyticsEvent({ kind, path, productId, product, referrer, sessionId }) {
  return prisma.analyticsEvent.create({
    data: {
      kind,
      path: String(path || "").slice(0, 200) || "/",
      productId: String(productId || "").slice(0, 120) || null,
      product: String(product || "").slice(0, 160) || null,
      referrer: String(referrer || "").slice(0, 500) || "",
      sessionId: String(sessionId || "").slice(0, 80) || null,
    },
  })
}

export async function queryAnalytics(rawRange) {
  const range = clampRange(rawRange)
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)
  const startDate = toLocalDate(endDate)
  startDate.setDate(startDate.getDate() - (range - 1))
  startDate.setHours(0, 0, 0, 0)

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: startDate, lte: endDate } },
    orderBy: { createdAt: "desc" },
    select: {
      kind: true,
      path: true,
      productId: true,
      product: true,
      referrer: true,
      sessionId: true,
      createdAt: true,
    },
  })

  const previousStart = new Date(startDate)
  previousStart.setDate(previousStart.getDate() - range)
  const previousEvents = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: previousStart, lt: startDate } },
    select: { kind: true, sessionId: true },
  })

  const totals = {
    pageviews: 0,
    uniqueVisits: 0,
    whatsappClicks: 0,
    consultedProducts: 0,
  }

  const previous = { pageviews: 0, uniqueVisits: 0, whatsappClicks: 0 }

  const pageviewsByDay = new Map()
  const uniqueSessionsByDay = new Map()
  const whatsappByDay = new Map()
  const productClicks = new Map()
  const pathCounts = new Map()
  const referrerCounts = new Map()

  const previousSessions = new Set()
  for (const event of previousEvents) {
    if (event.sessionId) previousSessions.add(event.sessionId)
    if (event.kind === "pageview") previous.pageviews += 1
    else if (event.kind === "whatsapp") previous.whatsappClicks += 1
  }
  previous.uniqueVisits = previousSessions.size

  let directTraffic = 0

  for (const event of events) {
    const key = dayKey(event.createdAt)

    if (event.kind === "pageview") {
      totals.pageviews += 1
      pageviewsByDay.set(key, (pageviewsByDay.get(key) || 0) + 1)

      const sessions = uniqueSessionsByDay.get(key) || new Set()
      if (event.sessionId) sessions.add(event.sessionId)
      uniqueSessionsByDay.set(key, sessions)

      const p = pathCounts.get(event.path) || { path: event.path, count: 0 }
      p.count += 1
      pathCounts.set(event.path, p)

      const domain = referrerDomain(event.referrer)
      if (event.referrer && domain) {
        const entry = referrerCounts.get(domain) || { referrer: domain, count: 0 }
        entry.count += 1
        referrerCounts.set(domain, entry)
      } else if (!event.referrer) {
        directTraffic += 1
      }
    } else if (event.kind === "whatsapp") {
      totals.whatsappClicks += 1
      whatsappByDay.set(key, (whatsappByDay.get(key) || 0) + 1)

      const identity = event.productId || event.product
      if (identity) {
        const entry = productClicks.get(identity) || {
          productId: event.productId || "",
          product: event.product || identity,
          count: 0,
        }
        entry.count += 1
        productClicks.set(identity, entry)
      }
    }
  }

  for (const sessions of uniqueSessionsByDay.values()) {
    totals.uniqueVisits += sessions.size
  }
  totals.consultedProducts = productClicks.size

  const series = []
  const whatsappSeries = []
  for (let index = 0; index < range; index += 1) {
    const cursor = new Date(startDate)
    cursor.setDate(cursor.getDate() + index)
    const key = dayKey(cursor)
    series.push({
      date: key,
      label: new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(cursor),
      pageviews: pageviewsByDay.get(key) || 0,
      uniqueVisits: uniqueSessionsByDay.get(key)?.size || 0,
    })
    whatsappSeries.push({
      date: key,
      label: series[series.length - 1].label,
      clicks: whatsappByDay.get(key) || 0,
    })
  }

  const topReferrers = [
    { referrer: "Directo", count: directTraffic },
    ...[...referrerCounts.values()].sort((a, b) => b.count - a.count).slice(0, 4),
  ].filter((entry) => entry.count > 0)

  return {
    range,
    totals,
    deltas: {
      pageviews: percentChange(totals.pageviews, previous.pageviews),
      uniqueVisits: percentChange(totals.uniqueVisits, previous.uniqueVisits),
      whatsappClicks: percentChange(totals.whatsappClicks, previous.whatsappClicks),
    },
    series,
    whatsappSeries,
    topProducts: [...productClicks.values()].sort((a, b) => b.count - a.count).slice(0, 8),
    topPages: [...pathCounts.values()].sort((a, b) => b.count - a.count).slice(0, 6),
    topReferrers,
    recent: events
      .slice(0, 8)
      .map((event) => ({
        kind: event.kind,
        path: event.path,
        productId: event.productId || "",
        product: event.product || "",
        createdAt: event.createdAt.toISOString(),
      })),
  }
}
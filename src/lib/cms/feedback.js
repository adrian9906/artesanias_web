import { FEEDBACK_STATUSES, FEEDBACK_TYPES } from "@/lib/cms/constants"
import { uniqueId } from "@/lib/cms/store"

const feedbackTypeIds = FEEDBACK_TYPES.map((item) => item.id)
const feedbackStatusIds = FEEDBACK_STATUSES.map((item) => item.id)

export function sortByNewest(left, right) {
  return String(right.createdAt || "").localeCompare(String(left.createdAt || ""))
}

export function normalizeFeedback(body, existingIds, previous = null, overrides = {}) {
  const type = String(body.type || overrides.type || "opinion").trim()
  if (!feedbackTypeIds.includes(type)) {
    return { error: "Selecciona un tipo valido: opinion, experiencia o testimonio." }
  }

  const text = String(body.text || body.message || "").trim()
  if (!text) return { error: "El mensaje es obligatorio." }

  const rawName = String(body.name || "").trim()
  const allowAnonymous = body.allowAnonymous !== false
  const name = rawName || (allowAnonymous ? "Anonimo" : "")
  if (!name) return { error: "Indica el nombre de la persona o permite anonimo." }

  const status = String(body.status || overrides.status || "published").trim()
  if (!feedbackStatusIds.includes(status)) {
    return { error: "Estado invalido." }
  }

  const origin = String(body.origin || overrides.origin || "admin").trim() || "admin"
  const now = new Date().toISOString()

  return {
    entry: {
      id: previous?.id || uniqueId(body.id || `${type}-${name}`, existingIds),
      type,
      name,
      text,
      status,
      origin,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
    },
  }
}

export function groupFeedbackEntries(items) {
  const sorted = (items || []).slice().sort(sortByNewest)
  const grouped = {
    opinions: [],
    experiences: [],
    testimonials: [],
    all: sorted,
  }

  sorted.forEach((item) => {
    if (item.type === "opinion") grouped.opinions.push(item)
    if (item.type === "experience") grouped.experiences.push(item)
    if (item.type === "testimonial") grouped.testimonials.push(item)
  })

  return grouped
}

export function visibleFeedback(items) {
  return (items || []).filter((item) => item.status === "published")
}

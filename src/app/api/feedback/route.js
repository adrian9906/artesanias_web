import { groupFeedbackEntries, normalizeFeedback, sortByNewest, visibleFeedback } from "@/lib/cms/feedback"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const items = visibleFeedback(store.feedback).slice().sort(sortByNewest)
  const grouped = groupFeedbackEntries(items)
  return jsonOk({
    items,
    grouped,
    testimonials: grouped.testimonials,
  })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos invalidos.")

  const store = await readStore()
  const result = normalizeFeedback(body, store.feedback.map((item) => item.id), null, {
    origin: "public",
    status: "published",
  })
  if (result.error) return jsonError(result.error)

  store.feedback.unshift(result.entry)
  await writeStore(store)
  return jsonOk({ item: result.entry }, { status: 201 })
}

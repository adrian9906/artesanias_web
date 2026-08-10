import { groupFeedbackEntries, normalizeFeedback, sortByNewest } from "@/lib/cms/feedback"
import { FEEDBACK_STATUSES, FEEDBACK_TYPES } from "@/lib/cms/constants"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const items = (store.feedback || []).slice().sort(sortByNewest)
  return jsonOk({
    items,
    grouped: groupFeedbackEntries(items),
    types: FEEDBACK_TYPES,
    statuses: FEEDBACK_STATUSES,
  })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos invalidos.")

  const store = await readStore()
  const result = normalizeFeedback(body, store.feedback.map((item) => item.id), null, {
    origin: "admin",
    status: body.status || "published",
  })
  if (result.error) return jsonError(result.error)

  store.feedback.unshift(result.entry)
  await writeStore(store)
  return jsonOk({ item: result.entry }, { status: 201 })
}

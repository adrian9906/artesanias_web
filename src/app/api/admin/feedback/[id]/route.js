import { normalizeFeedback } from "@/lib/cms/feedback"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos inválidos.")

  const store = await readStore()
  const index = (store.feedback || []).findIndex((item) => item.id === id)
  if (index === -1) return jsonError("Mensaje no encontrado.", 404)

  const current = store.feedback[index]
  const result = normalizeFeedback(body, store.feedback.map((item) => item.id), current, {
    origin: body.origin || current.origin || "admin",
    status: body.status || current.status || "published",
  })
  if (result.error) return jsonError(result.error)

  store.feedback[index] = result.entry
  await writeStore(store)
  return jsonOk({ item: store.feedback[index] })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = (store.feedback || []).some((item) => item.id === id)
  if (!exists) return jsonError("Mensaje no encontrado.", 404)

  store.feedback = (store.feedback || []).filter((item) => item.id !== id)
  await writeStore(store)
  return jsonOk({ ok: true })
}

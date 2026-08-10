import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const image = (store.gallery || []).find((item) => item.id === id)
  if (!image) return jsonError("Imagen no encontrada.", 404)
  return jsonOk({ image })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || !String(body.image || body.src || "").trim()) {
    return jsonError("La URL de la imagen es obligatoria.")
  }

  const store = await readStore()
  const index = (store.gallery || []).findIndex((item) => item.id === id)
  if (index === -1) return jsonError("Imagen no encontrada.", 404)

  const current = store.gallery[index]
  store.gallery[index] = {
    ...current,
    image: String(body.image || body.src).trim(),
    portrait: [true, "true", 1, "1"].includes(body.portrait),
    alt: String(body.alt || "").trim(),
    updatedAt: new Date().toISOString(),
  }

  await writeStore(store)
  return jsonOk({ image: store.gallery[index] })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = (store.gallery || []).some((item) => item.id === id)
  if (!exists) return jsonError("Imagen no encontrada.", 404)

  store.gallery = (store.gallery || []).filter((item) => item.id !== id)
  await writeStore(store)
  return jsonOk({ ok: true })
}
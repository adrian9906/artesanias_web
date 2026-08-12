import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const section = store.sections.find((item) => item.id === id)
  if (!section) return jsonError("Sección no encontrada.", 404)
  return jsonOk({
    section: {
      ...section,
      productCount: store.products.filter((p) => p.sectionId === section.id).length,
    },
  })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || !String(body.name || "").trim()) {
    return jsonError("El nombre de la sección es obligatorio.")
  }

  const store = await readStore()
  const index = store.sections.findIndex((item) => item.id === id)
  if (index === -1) return jsonError("Sección no encontrada.", 404)

  store.sections[index] = {
    ...store.sections[index],
    name: String(body.name).trim(),
    description: String(body.description || "").trim(),
    homeVisible: body.homeVisible !== false,
    homeImage: String(body.homeImage || "").trim(),
    homeStory: String(body.homeStory || "").trim(),
    homeCta: String(body.homeCta || "Ver colección").trim(),
    homeOrder: Math.max(0, Math.trunc(Number(body.homeOrder) || 0)),
    updatedAt: new Date().toISOString(),
  }

  await writeStore(store)
  return jsonOk({ section: store.sections[index] })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = store.sections.some((item) => item.id === id)
  if (!exists) return jsonError("Sección no encontrada.", 404)

  const linked = store.products.filter((p) => p.sectionId === id)
  if (linked.length > 0) {
    return jsonError(
      `No se puede eliminar: hay ${linked.length} producto(s) en esta sección. Mueve o elimina los productos primero.`,
    )
  }

  store.sections = store.sections.filter((item) => item.id !== id)
  await writeStore(store)
  return jsonOk({ ok: true })
}

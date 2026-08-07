import { jsonError, jsonOk, readStore, uniqueId, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const sections = store.sections.map((section) => ({
    ...section,
    productCount: store.products.filter((p) => p.sectionId === section.id).length,
  }))
  return jsonOk({ sections })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body || !String(body.name || "").trim()) {
    return jsonError("El nombre de la sección es obligatorio.")
  }

  const store = await readStore()
  const now = new Date().toISOString()
  const section = {
    id: uniqueId(body.id || body.name, store.sections.map((s) => s.id)),
    name: String(body.name).trim(),
    description: String(body.description || "").trim(),
    createdAt: now,
    updatedAt: now,
  }

  store.sections.unshift(section)
  await writeStore(store)
  return jsonOk({ section }, { status: 201 })
}

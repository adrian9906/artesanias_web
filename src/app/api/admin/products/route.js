import { jsonError, jsonOk, readStore, uniqueId, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

function normalizeProduct(body, existingIds, previous = null) {
  const name = String(body.name || "").trim()
  if (!name) return { error: "El nombre del producto es obligatorio." }

  const sectionId = String(body.sectionId || "").trim()
  if (!sectionId) return { error: "Selecciona la sección del producto." }

  const price = Number(body.price)
  if (Number.isNaN(price) || price < 0) {
    return { error: "El precio debe ser un número válido." }
  }

  const inStock = body.inStock === true || body.inStock === "true"
  const stockRaw = Number(body.stockQty)
  const stockQty = Number.isNaN(stockRaw) ? 0 : Math.max(0, Math.floor(stockRaw))

  const variants = Array.isArray(body.variants)
    ? body.variants
        .filter((variant) => variant && (String(variant.name || "").trim() || !Number.isNaN(Number(variant.price))))
        .map((variant, index) => ({
          id: String(variant.id || `variante-${Date.now()}-${index}`),
          name: String(variant.name || "").trim(),
          price: Number(variant.price),
          photo: String(variant.photo || "").trim(),
        }))
        .filter((variant) => !Number.isNaN(variant.price))
    : []

  const photos = Array.isArray(body.photos)
    ? body.photos.map((photo) => String(photo || "").trim()).filter(Boolean)
    : []

  const now = new Date().toISOString()
  return {
    product: {
      id: previous?.id || uniqueId(body.id || name, existingIds),
      name,
      description: String(body.description || "").trim(),
      price,
      currency: String(body.currency || "USD").trim() || "USD",
      elaborationTime: String(body.elaborationTime || "").trim(),
      photo: photos[0] || String(body.photo || "").trim(),
      photos,
      sectionId,
      inStock,
      stockQty,
      variants,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
    },
  }
}

export async function GET() {
  const store = await readStore()
  const products = store.products.map((product) => ({
    ...product,
    sectionName: store.sections.find((s) => s.id === product.sectionId)?.name || "Sin sección",
  }))
  return jsonOk({ products, sections: store.sections })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos inválidos.")

  const store = await readStore()
  if (!store.sections.some((s) => s.id === body.sectionId)) {
    return jsonError("La sección seleccionada no existe.")
  }

  const result = normalizeProduct(
    body,
    store.products.map((p) => p.id),
  )
  if (result.error) return jsonError(result.error)

  store.products.unshift(result.product)
  await writeStore(store)
  return jsonOk({ product: result.product }, { status: 201 })
}

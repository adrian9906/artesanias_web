import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const product = store.products.find((item) => item.id === id)
  if (!product) return jsonError("Producto no encontrado.", 404)
  return jsonOk({
    product: {
      ...product,
      sectionName: store.sections.find((s) => s.id === product.sectionId)?.name || "Sin sección",
    },
    sections: store.sections,
  })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos inválidos.")

  const store = await readStore()
  const index = store.products.findIndex((item) => item.id === id)
  if (index === -1) return jsonError("Producto no encontrado.", 404)

  if (!store.sections.some((s) => s.id === body.sectionId)) {
    return jsonError("La sección seleccionada no existe.")
  }

  const name = String(body.name || "").trim()
  if (!name) return jsonError("El nombre del producto es obligatorio.")

  const price = Number(body.price)
  if (Number.isNaN(price) || price < 0) {
    return jsonError("El precio debe ser un número válido.")
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

  store.products[index] = {
    ...store.products[index],
    name,
    description: String(body.description || "").trim(),
    price,
    currency: String(body.currency || "USD").trim() || "USD",
    elaborationTime: String(body.elaborationTime || "").trim(),
    photo: photos[0] || String(body.photo || "").trim(),
    photos,
    sectionId: String(body.sectionId).trim(),
    inStock,
    stockQty,
    variants,
    updatedAt: new Date().toISOString(),
  }

  await writeStore(store)
  return jsonOk({ product: store.products[index] })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = store.products.some((item) => item.id === id)
  if (!exists) return jsonError("Producto no encontrado.", 404)

  store.products = store.products.filter((item) => item.id !== id)
  await writeStore(store)
  return jsonOk({ ok: true })
}

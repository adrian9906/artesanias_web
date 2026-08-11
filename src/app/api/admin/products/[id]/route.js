import { enrichProduct, normalizeProduct } from "@/lib/cms/products"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const product = store.products.find((item) => item.id === id)
  if (!product) return jsonError("Producto no encontrado.", 404)

  return jsonOk({
    product: enrichProduct(product, store.sections),
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

  if (!store.sections.some((section) => section.id === body.sectionId)) {
    return jsonError("La sección seleccionada no existe.")
  }

  const result = normalizeProduct(body, store.products.map((item) => item.id), store.products[index])
  if (result.error) return jsonError(result.error)

  store.products[index] = result.product
  await writeStore(store)
  return jsonOk({ product: enrichProduct(store.products[index], store.sections) })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = store.products.some((item) => item.id === id)
  if (!exists) return jsonError("Producto no encontrado.", 404)

  store.products = store.products.filter((item) => item.id !== id)
  store.promotions = (store.promotions || []).map((promotion) =>
    promotion.productId === id
      ? {
          ...promotion,
          productId: "",
          updatedAt: new Date().toISOString(),
        }
      : promotion,
  )
  await writeStore(store)
  return jsonOk({ ok: true })
}

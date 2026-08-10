import { enrichProduct } from "@/lib/cms/products"
import { enrichPromotions, normalizePromotion } from "@/lib/cms/promotion"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const promotion = store.promotions.find((item) => item.id === id)
  if (!promotion) return jsonError("Promocion no encontrada.", 404)

  const products = store.products.map((product) => enrichProduct(product, store.sections))
  return jsonOk({ promotion: enrichPromotions([promotion], products)[0], products })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos invalidos.")

  const store = await readStore()
  const index = store.promotions.findIndex((item) => item.id === id)
  if (index === -1) return jsonError("Promocion no encontrada.", 404)

  const result = normalizePromotion(
    body,
    store.products,
    store.promotions.map((promotion) => promotion.id),
    store.promotions[index],
  )
  if (result.error) return jsonError(result.error)

  store.promotions[index] = result.promotion
  await writeStore(store)

  const products = store.products.map((product) => enrichProduct(product, store.sections))
  return jsonOk({ promotion: enrichPromotions([store.promotions[index]], products)[0] })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = store.promotions.some((item) => item.id === id)
  if (!exists) return jsonError("Promocion no encontrada.", 404)

  store.promotions = store.promotions.filter((item) => item.id !== id)
  await writeStore(store)
  return jsonOk({ ok: true })
}

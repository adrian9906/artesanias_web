import { enrichProduct } from "@/lib/cms/products"
import { enrichPromotions, normalizePromotion } from "@/lib/cms/promotion"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const products = store.products.map((product) => enrichProduct(product, store.sections))

  return jsonOk({
    promotions: enrichPromotions(store.promotions, products),
    products,
  })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos invalidos.")

  const store = await readStore()
  const result = normalizePromotion(body, store.products, store.promotions.map((promotion) => promotion.id))
  if (result.error) return jsonError(result.error)

  store.promotions.unshift(result.promotion)
  await writeStore(store)

  const products = store.products.map((product) => enrichProduct(product, store.sections))
  return jsonOk({ promotion: enrichPromotions([result.promotion], products)[0] }, { status: 201 })
}

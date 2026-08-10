import { enrichProduct } from "@/lib/cms/products"
import { getActivePromotion } from "@/lib/cms/promotion"
import { jsonOk, readStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const products = store.products.map((product) => enrichProduct(product, store.sections))
  const promotion = getActivePromotion(store.promotions, products)

  return jsonOk({
    promotion,
  })
}

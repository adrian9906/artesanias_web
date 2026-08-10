import { enrichProduct, normalizeProduct } from "@/lib/cms/products"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const products = store.products.map((product) => enrichProduct(product, store.sections))
  return jsonOk({ products, sections: store.sections })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos invalidos.")

  const store = await readStore()
  if (!store.sections.some((section) => section.id === body.sectionId)) {
    return jsonError("La seccion seleccionada no existe.")
  }

  const result = normalizeProduct(body, store.products.map((product) => product.id))
  if (result.error) return jsonError(result.error)

  store.products.unshift(result.product)
  await writeStore(store)
  return jsonOk({ product: enrichProduct(result.product, store.sections) }, { status: 201 })
}

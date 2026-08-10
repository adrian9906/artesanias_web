import { queryAnalytics } from "@/lib/analytics/events"
import { jsonError, jsonOk } from "@/lib/cms/store"
import { prisma } from "@/lib/prisma"
import { getAdminSession } from "@/lib/auth/session"

export const dynamic = "force-dynamic"

export async function GET(request) {
  const session = await getAdminSession()
  if (!session) {
    return jsonError("No autorizado.", 401)
  }

  const range = new URL(request.url).searchParams.get("range") || "30"
  const result = await queryAnalytics(range)

  const productIds = result.topProducts
    .map((entry) => entry.productId)
    .filter(Boolean)
  const productPhotos =
    productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, photo: true, name: true },
        })
      : []

  const photoById = new Map(productPhotos.map((product) => [product.id, product]))

  const topProducts = result.topProducts.map((entry) => ({
    ...entry,
    name: entry.product || photoById.get(entry.productId)?.name || entry.productId || "Pieza",
    photo: photoById.get(entry.productId)?.photo || "",
  }))

  return jsonOk({
    ...result,
    topProducts,
  })
}
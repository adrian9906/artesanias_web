import { DEFAULT_PROMOTION } from "@/lib/cms/defaults"
import { uniqueId } from "@/lib/cms/store"

function hasRenderableFields(promotion) {
  return Boolean(
    promotion?.productId &&
      promotion?.title &&
      promotion?.message &&
      promotion?.image,
  )
}

export function normalizePromotion(body, products = [], existingIds = [], previous = null) {
  const enabled = body?.enabled === true || body?.enabled === "true"
  const productId = String(body?.productId || "").trim()
  const title = String(body?.title || "").trim()
  const message = String(body?.message || "").trim()
  const image = String(body?.image || "").trim()
  const ctaLabel = String(body?.ctaLabel || "Visitar").trim() || "Visitar"

  if (productId && !products.some((product) => product.id === productId)) {
    return { error: "El producto seleccionado no existe." }
  }

  if (enabled && !hasRenderableFields({ productId, title, message, image })) {
    return { error: "Para activar una promoción debes completar el producto, la foto, el titular y el mensaje." }
  }

  const now = new Date().toISOString()

  return {
    promotion: {
      ...DEFAULT_PROMOTION,
      ...previous,
      id: previous?.id || uniqueId(body?.id || title || productId || `promocion-${Date.now()}`, existingIds),
      enabled,
      productId,
      title,
      message,
      image,
      ctaLabel,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
    },
  }
}

export function enrichPromotion(promotion, products = []) {
  const product = products.find((item) => item.id === promotion?.productId)

  return {
    ...DEFAULT_PROMOTION,
    ...(promotion || {}),
    isRenderable: hasRenderableFields(promotion),
    product: product
      ? {
          id: product.id,
          name: product.name,
          photo: product.photo || product.photos?.[0] || "",
        }
      : null,
  }
}

export function sortPromotions(promotions = []) {
  return promotions
    .slice()
    .sort((left, right) => String(right.updatedAt || right.createdAt || "").localeCompare(String(left.updatedAt || left.createdAt || "")))
}

export function enrichPromotions(promotions = [], products = []) {
  return sortPromotions(promotions).map((promotion) => enrichPromotion(promotion, products))
}

export function getActivePromotion(promotions = [], products = []) {
  const [activePromotion] = enrichPromotions(promotions, products).filter(
    (promotion) => promotion.enabled && promotion.isRenderable,
  )

  return activePromotion || null
}

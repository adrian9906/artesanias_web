import { uniqueId } from "@/lib/cms/store"

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean)
  }

  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeProduct(body, existingIds, previous = null) {
  const name = String(body.name || "").trim()
  if (!name) return { error: "El nombre del producto es obligatorio." }

  const sectionId = String(body.sectionId || "").trim()
  if (!sectionId) return { error: "Selecciona la seccion del producto." }

  const price = Number(body.price)
  if (Number.isNaN(price) || price < 0) {
    return { error: "El precio debe ser un numero valido." }
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

  const materials = normalizeStringList(body.materials)
  const now = new Date().toISOString()

  return {
    product: {
      id: previous?.id || uniqueId(body.id || name, existingIds),
      name,
      eyebrow: String(body.eyebrow || "").trim(),
      description: String(body.description || "").trim(),
      materials,
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

export function enrichProduct(product, sections) {
  const section = (sections || []).find((item) => item.id === product.sectionId)
  return {
    ...product,
    eyebrow: product.eyebrow || section?.name || "",
    materials: Array.isArray(product.materials) ? product.materials : [],
    sectionName: section?.name || "Sin seccion",
    sectionDescription: section?.description || "",
  }
}

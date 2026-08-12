import { promises as fs } from "fs"
import path from "path"
import { DEFAULT_FEEDBACK, DEFAULT_PROMOTION } from "@/lib/cms/defaults"
import { prisma } from "@/lib/prisma"

const LEGACY_DATA_PATH = path.join(process.cwd(), "data", "cms.json")

const emptyStore = () => ({
  sections: [],
  products: [],
  posts: [],
  gallery: [],
  feedback: DEFAULT_FEEDBACK.map((item) => ({ ...item })),
  promotions: [],
})

let initializationPromise = null

function hasLegacyPromotion(promotion) {
  if (!promotion || typeof promotion !== "object") return false
  return Boolean(
    promotion.productId ||
      promotion.title ||
      promotion.message ||
      promotion.image ||
      promotion.enabled,
  )
}

function normalizeLegacyStore(parsed) {
  const empty = emptyStore()
  const promotions = Array.isArray(parsed?.promotions)
    ? parsed.promotions
    : hasLegacyPromotion(parsed?.promotionBanner)
      ? [{
          ...DEFAULT_PROMOTION,
          ...parsed.promotionBanner,
          id: parsed.promotionBanner?.id || "promotion-banner",
        }]
      : empty.promotions

  return {
    sections: Array.isArray(parsed?.sections) ? parsed.sections : empty.sections,
    products: Array.isArray(parsed?.products) ? parsed.products : empty.products,
    posts: Array.isArray(parsed?.posts) ? parsed.posts : empty.posts,
    gallery: Array.isArray(parsed?.gallery) ? parsed.gallery : empty.gallery,
    feedback: Array.isArray(parsed?.feedback) ? parsed.feedback : empty.feedback,
    promotions: promotions.map((promotion) => ({
      ...DEFAULT_PROMOTION,
      ...promotion,
    })),
  }
}

function toDate(value) {
  if (!value) return new Date()
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function toIso(value) {
  if (!value) return ""
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

async function readLegacyStore() {
  try {
    const raw = await fs.readFile(LEGACY_DATA_PATH, "utf8")
    return normalizeLegacyStore(JSON.parse(raw))
  } catch (error) {
    if (error?.code === "ENOENT") return emptyStore()
    throw error
  }
}

async function isDatabaseEmpty() {
  const [
    sectionsCount,
    productsCount,
    postsCount,
    galleryCount,
    feedbackCount,
    promotionsCount,
  ] = await Promise.all([
    prisma.section.count(),
    prisma.product.count(),
    prisma.post.count(),
    prisma.galleryImage.count(),
    prisma.feedback.count(),
    prisma.promotion.count(),
  ])

  return (
    sectionsCount === 0 &&
    productsCount === 0 &&
    postsCount === 0 &&
    galleryCount === 0 &&
    feedbackCount === 0 &&
    promotionsCount === 0
  )
}

async function persistStore(store) {
  const safeStore = {
    sections: Array.isArray(store?.sections) ? store.sections : [],
    products: Array.isArray(store?.products) ? store.products : [],
    posts: Array.isArray(store?.posts) ? store.posts : [],
    gallery: Array.isArray(store?.gallery) ? store.gallery : [],
    feedback: Array.isArray(store?.feedback) ? store.feedback : [],
    promotions: Array.isArray(store?.promotions) ? store.promotions : [],
  }

  const productIds = new Set(safeStore.products.map((product) => product.id))
  const normalizedPromotions = safeStore.promotions.map((promotion) => ({
    ...promotion,
    productId: promotion?.productId && productIds.has(promotion.productId) ? promotion.productId : "",
  }))

  await prisma.$transaction(async (tx) => {
    await tx.promotion.deleteMany()
    await tx.feedback.deleteMany()
    await tx.galleryImage.deleteMany()
    await tx.post.deleteMany()
    await tx.product.deleteMany()
    await tx.section.deleteMany()

    if (safeStore.sections.length > 0) {
      await tx.section.createMany({
        data: safeStore.sections.map((section) => ({
          id: section.id,
          name: section.name,
          description: section.description || "",
          homeVisible: section.homeVisible !== false,
          homeImage: section.homeImage || "",
          homeStory: section.homeStory || "",
          homeCta: section.homeCta || "Ver colección",
          homeOrder: Number(section.homeOrder) || 0,
          createdAt: toDate(section.createdAt),
          updatedAt: toDate(section.updatedAt),
        })),
      })
    }

    if (safeStore.products.length > 0) {
      await tx.product.createMany({
        data: safeStore.products.map((product) => ({
          id: product.id,
          name: product.name,
          eyebrow: product.eyebrow || "",
          description: product.description || "",
          materials: Array.isArray(product.materials) ? product.materials : [],
          price: Number(product.price) || 0,
          currency: product.currency || "USD",
          elaborationTime: product.elaborationTime || "",
          photo: product.photo || "",
          photos: Array.isArray(product.photos) ? product.photos : [],
          sectionId: product.sectionId,
          inStock: product.inStock !== false,
          stockQty: Number(product.stockQty) || 0,
          variants: Array.isArray(product.variants) ? product.variants : [],
          createdAt: toDate(product.createdAt),
          updatedAt: toDate(product.updatedAt),
        })),
      })
    }

    if (safeStore.posts.length > 0) {
      await tx.post.createMany({
        data: safeStore.posts.map((post) => ({
          id: post.id,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt || "",
          coverImage: post.coverImage || "",
          body: post.body || "",
          author: post.author || "Equipo Thay Art",
          status: post.status,
          publishedAt: post.publishedAt ? toDate(post.publishedAt) : null,
          createdAt: toDate(post.createdAt),
          updatedAt: toDate(post.updatedAt),
        })),
      })
    }

    if (safeStore.gallery.length > 0) {
      await tx.galleryImage.createMany({
        data: safeStore.gallery.map((image) => ({
          id: image.id,
          image: image.image,
          portrait: Boolean(image.portrait),
          alt: image.alt || "",
          createdAt: toDate(image.createdAt),
          updatedAt: toDate(image.updatedAt),
        })),
      })
    }

    if (safeStore.feedback.length > 0) {
      await tx.feedback.createMany({
        data: safeStore.feedback.map((item) => ({
          id: item.id,
          type: item.type,
          name: item.name,
          location: item.location || "",
          photo: item.photo || "",
          text: item.text,
          status: item.status,
          origin: item.origin || "admin",
          featuredOnHome: item.featuredOnHome !== false,
          homeOrder: Number(item.homeOrder) || 0,
          createdAt: toDate(item.createdAt),
          updatedAt: toDate(item.updatedAt),
        })),
      })
    }

    if (normalizedPromotions.length > 0) {
      await tx.promotion.createMany({
        data: normalizedPromotions.map((promotion) => ({
          id: promotion.id,
          enabled: promotion.enabled === true,
          productId: promotion.productId || null,
          title: promotion.title || "",
          message: promotion.message || "",
          image: promotion.image || "",
          ctaLabel: promotion.ctaLabel || "Visitar",
          createdAt: toDate(promotion.createdAt),
          updatedAt: toDate(promotion.updatedAt),
        })),
      })
    }
  })

  return safeStore
}

async function ensureDatabaseInitialized() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      if (await isDatabaseEmpty()) {
        const legacyStore = await readLegacyStore()
        await persistStore(legacyStore)
      }
    })().catch((error) => {
      initializationPromise = null
      throw error
    })
  }

  await initializationPromise
}

export function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)
}

export function uniqueId(base, existingIds) {
  const root = slugify(base) || `item-${Date.now()}`
  let candidate = root
  let i = 2
  while (existingIds.includes(candidate)) {
    candidate = `${root}-${i}`
    i += 1
  }
  return candidate
}

export async function readStore() {
  await ensureDatabaseInitialized()

  const [sections, products, posts, gallery, feedback, promotions] = await Promise.all([
    prisma.section.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.feedback.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.promotion.findMany({ orderBy: { createdAt: "desc" } }),
  ])

  return {
    sections: sections.map((section) => ({
      id: section.id,
      name: section.name,
      description: section.description,
      homeVisible: section.homeVisible,
      homeImage: section.homeImage,
      homeStory: section.homeStory,
      homeCta: section.homeCta,
      homeOrder: section.homeOrder,
      createdAt: toIso(section.createdAt),
      updatedAt: toIso(section.updatedAt),
    })),
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      eyebrow: product.eyebrow,
      description: product.description,
      materials: Array.isArray(product.materials) ? product.materials : [],
      price: product.price,
      currency: product.currency,
      elaborationTime: product.elaborationTime,
      photo: product.photo,
      photos: Array.isArray(product.photos) ? product.photos : [],
      sectionId: product.sectionId,
      inStock: product.inStock,
      stockQty: product.stockQty,
      variants: Array.isArray(product.variants) ? product.variants : [],
      createdAt: toIso(product.createdAt),
      updatedAt: toIso(product.updatedAt),
    })),
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      body: post.body,
      author: post.author,
      status: post.status,
      publishedAt: toIso(post.publishedAt),
      createdAt: toIso(post.createdAt),
      updatedAt: toIso(post.updatedAt),
    })),
    gallery: gallery.map((image) => ({
      id: image.id,
      image: image.image,
      portrait: image.portrait,
      alt: image.alt,
      createdAt: toIso(image.createdAt),
      updatedAt: toIso(image.updatedAt),
    })),
    feedback: feedback.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      location: item.location,
      photo: item.photo,
      text: item.text,
      status: item.status,
      origin: item.origin,
      featuredOnHome: item.featuredOnHome,
      homeOrder: item.homeOrder,
      createdAt: toIso(item.createdAt),
      updatedAt: toIso(item.updatedAt),
    })),
    promotions: promotions.map((promotion) => ({
      id: promotion.id,
      enabled: promotion.enabled,
      productId: promotion.productId || "",
      title: promotion.title,
      message: promotion.message,
      image: promotion.image,
      ctaLabel: promotion.ctaLabel,
      createdAt: toIso(promotion.createdAt),
      updatedAt: toIso(promotion.updatedAt),
    })),
  }
}

export async function writeStore(store) {
  await ensureDatabaseInitialized()
  return persistStore(store)
}

export function jsonOk(data, init = {}) {
  return Response.json(data, {
    status: 200,
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers || {}),
    },
  })
}

export function jsonError(message, status = 400) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } })
}

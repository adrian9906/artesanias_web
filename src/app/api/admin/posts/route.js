import { POST_CATEGORIES, POST_STATUSES } from "@/lib/cms/constants"
import { jsonError, jsonOk, readStore, uniqueId, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

const categoryIds = POST_CATEGORIES.map((c) => c.id)
const statusIds = POST_STATUSES.map((s) => s.id)

function normalizePost(body, existingIds, previous = null) {
  const title = String(body.title || "").trim()
  if (!title) return { error: "El título es obligatorio." }

  const category = String(body.category || "").trim()
  if (!categoryIds.includes(category)) {
    return { error: "Selecciona una categoría válida (blog, noticia o taller)." }
  }

  const status = String(body.status || "draft").trim()
  if (!statusIds.includes(status)) {
    return { error: "Estado inválido." }
  }

  const now = new Date().toISOString()
  const publishedAt =
    status === "published"
      ? previous?.publishedAt || body.publishedAt || now
      : previous?.publishedAt || null

  return {
    post: {
      id: previous?.id || uniqueId(body.id || title, existingIds),
      title,
      category,
      excerpt: String(body.excerpt || "").trim(),
      coverImage: String(body.coverImage || "").trim(),
      body: String(body.body || ""),
      author: String(body.author || "Equipo Thay Art").trim() || "Equipo Thay Art",
      status,
      publishedAt,
      createdAt: previous?.createdAt || now,
      updatedAt: now,
    },
  }
}

export async function GET() {
  const store = await readStore()
  return jsonOk({ posts: store.posts, categories: POST_CATEGORIES, statuses: POST_STATUSES })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos inválidos.")

  const store = await readStore()
  const result = normalizePost(
    body,
    store.posts.map((p) => p.id),
  )
  if (result.error) return jsonError(result.error)

  store.posts.unshift(result.post)
  await writeStore(store)
  return jsonOk({ post: result.post }, { status: 201 })
}

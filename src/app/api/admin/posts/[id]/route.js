import { POST_CATEGORIES, POST_STATUSES } from "@/lib/cms/constants"
import { jsonError, jsonOk, readStore, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

const categoryIds = POST_CATEGORIES.map((c) => c.id)
const statusIds = POST_STATUSES.map((s) => s.id)

export async function GET(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const post = store.posts.find((item) => item.id === id)
  if (!post) return jsonError("Publicación no encontrada.", 404)
  return jsonOk({ post, categories: POST_CATEGORIES, statuses: POST_STATUSES })
}

export async function PUT(request, { params }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body) return jsonError("Datos inválidos.")

  const store = await readStore()
  const index = store.posts.findIndex((item) => item.id === id)
  if (index === -1) return jsonError("Publicación no encontrada.", 404)

  const title = String(body.title || "").trim()
  if (!title) return jsonError("El título es obligatorio.")

  const category = String(body.category || "").trim()
  if (!categoryIds.includes(category)) {
    return jsonError("Selecciona una categoría válida (blog, noticia o taller).")
  }

  const status = String(body.status || "draft").trim()
  if (!statusIds.includes(status)) return jsonError("Estado inválido.")

  const previous = store.posts[index]
  const now = new Date().toISOString()

  store.posts[index] = {
    ...previous,
    title,
    category,
    excerpt: String(body.excerpt || "").trim(),
    coverImage: String(body.coverImage || "").trim(),
    body: String(body.body || ""),
    author: String(body.author || "Equipo Thay Art").trim() || "Equipo Thay Art",
    status,
    publishedAt:
      status === "published" ? previous.publishedAt || body.publishedAt || now : previous.publishedAt,
    updatedAt: now,
  }

  await writeStore(store)
  return jsonOk({ post: store.posts[index] })
}

export async function DELETE(_request, { params }) {
  const { id } = await params
  const store = await readStore()
  const exists = store.posts.some((item) => item.id === id)
  if (!exists) return jsonError("Publicación no encontrada.", 404)

  store.posts = store.posts.filter((item) => item.id !== id)
  await writeStore(store)
  return jsonOk({ ok: true })
}

import { jsonError, jsonOk, readStore, uniqueId, writeStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

function normalizeImage(body, existingIds, previous = null) {
  const image = String(body.image || body.src || "").trim()
  if (!image) return { error: "La URL de la imagen es obligatoria." }

  const now = new Date().toISOString()
  return {
    image: {
      id: previous?.id || uniqueId(body.id || "imagen", existingIds),
      image,
      portrait: [true, "true", 1, "1"].includes(body.portrait),
      alt: String(body.alt || "").trim(),
      createdAt: previous?.createdAt || now,
      updatedAt: now,
    },
  }
}

export async function GET() {
  const store = await readStore()
  const gallery = (store.gallery || []).map((img) => ({
    id: img.id,
    image: img.image,
    portrait: img.portrait,
    alt: img.alt || "",
    createdAt: img.createdAt,
    updatedAt: img.updatedAt,
  }))
  return jsonOk({ gallery })
}

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const result = normalizeImage(body || {}, [])
  if (result.error) return jsonError(result.error)

  const store = await readStore()
  const existing = (store.gallery || []).map((a) => a.id)
  const normalized = normalizeImage(body || {}, existing)
  const image = normalized.image

  store.gallery = store.gallery || []
  store.gallery.push(image)
  await writeStore(store)
  return jsonOk({ image }, { status: 201 })
}
import { promises as fs } from "fs"
import path from "path"

const DATA_PATH = path.join(process.cwd(), "data", "cms.json")

const emptyStore = () => ({
  sections: [],
  products: [],
  posts: [],
})

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
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8")
    const parsed = JSON.parse(raw)
    return {
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
    }
  } catch (error) {
    if (error && error.code === "ENOENT") {
      const store = emptyStore()
      await writeStore(store)
      return store
    }
    throw error
  }
}

export async function writeStore(store) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify(store, null, 2), "utf8")
  return store
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

import { promises as fs } from "fs"
import path from "path"
import { jsonError, jsonOk, slugify } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || typeof file === "string") {
      return jsonError("No se recibió ningún archivo.")
    }

    if (!ALLOWED.has(file.type)) {
      return jsonError("Solo se permiten imágenes JPG, PNG, WEBP o GIF.")
    }

    if (file.size > MAX_BYTES) {
      return jsonError("La imagen no puede superar 5 MB.")
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const original = file.name || "upload.jpg"
    const ext = path.extname(original).toLowerCase() || ".jpg"
    const base = slugify(path.basename(original, ext)) || "imagen"
    const filename = `${base}-${Date.now()}${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads")

    await fs.mkdir(uploadDir, { recursive: true })
    await fs.writeFile(path.join(uploadDir, filename), bytes)

    return jsonOk({ url: `/uploads/${filename}`, filename })
  } catch (error) {
    console.error("Upload error:", error)
    return jsonError("No se pudo subir la imagen.", 500)
  }
}

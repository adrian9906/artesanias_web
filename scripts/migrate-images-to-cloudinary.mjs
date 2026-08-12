import "dotenv/config"
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { PrismaPg } from "@prisma/adapter-pg"
import { v2 as cloudinary } from "cloudinary"
import { PrismaClient } from "../src/generated/prisma/client.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = path.join(root, "public")
const cloudFolder = process.env.CLOUDINARY_FOLDER || "thay-art"
const imagePattern = /\.(?:avif|gif|jpe?g|png|webp)$/i
const localOnlyImages = new Set([
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/apple-touch-icon.png",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-48x48.png",
  "/maskable-icon-192x192.png",
  "/maskable-icon-512x512.png",
  "/mstile-150x150.png",
])

if (!process.env.CLOUDINARY_URL) throw new Error("Falta CLOUDINARY_URL en .env.")
if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL en .env.")

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})
const migrated = new Map()

function isLocalImage(value) {
  return typeof value === "string" && value.startsWith("/") && imagePattern.test(value) && !localOnlyImages.has(value)
}

function publicIdFor(value) {
  return value
    .replace(/^\/+/, "")
    .replace(imagePattern, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
}

async function migrateUrl(value) {
  if (!isLocalImage(value)) return value
  if (migrated.has(value)) return migrated.get(value)

  const filePath = path.join(publicDir, ...value.slice(1).split("/"))
  if (!existsSync(filePath)) {
    console.warn(`No se encontró ${value}; se conserva la referencia.`)
    return value
  }

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "image",
    folder: cloudFolder,
    public_id: publicIdFor(value),
    overwrite: true,
    use_filename: false,
  })
  migrated.set(value, result.secure_url)
  console.log(`${value} -> ${result.secure_url}`)
  return result.secure_url
}

async function migrateDatabase() {
  const [sections, products, posts, gallery, feedback, promotions] = await Promise.all([
    prisma.section.findMany({ select: { id: true, homeImage: true } }),
    prisma.product.findMany({ select: { id: true, photo: true, photos: true } }),
    prisma.post.findMany({ select: { id: true, coverImage: true } }),
    prisma.galleryImage.findMany({ select: { id: true, image: true } }),
    prisma.feedback.findMany({ select: { id: true, photo: true } }),
    prisma.promotion.findMany({ select: { id: true, image: true } }),
  ])

  const operations = []
  for (const item of sections) {
    const homeImage = await migrateUrl(item.homeImage)
    if (homeImage !== item.homeImage) operations.push(prisma.section.update({ where: { id: item.id }, data: { homeImage } }))
  }
  for (const item of products) {
    const photo = await migrateUrl(item.photo)
    const photos = await Promise.all(item.photos.map(migrateUrl))
    if (photo !== item.photo || photos.some((url, index) => url !== item.photos[index])) {
      operations.push(prisma.product.update({ where: { id: item.id }, data: { photo, photos } }))
    }
  }
  for (const item of posts) {
    const coverImage = await migrateUrl(item.coverImage)
    if (coverImage !== item.coverImage) operations.push(prisma.post.update({ where: { id: item.id }, data: { coverImage } }))
  }
  for (const item of gallery) {
    const image = await migrateUrl(item.image)
    if (image !== item.image) operations.push(prisma.galleryImage.update({ where: { id: item.id }, data: { image } }))
  }
  for (const item of feedback) {
    const photo = await migrateUrl(item.photo)
    if (photo !== item.photo) operations.push(prisma.feedback.update({ where: { id: item.id }, data: { photo } }))
  }
  for (const item of promotions) {
    const image = await migrateUrl(item.image)
    if (image !== item.image) operations.push(prisma.promotion.update({ where: { id: item.id }, data: { image } }))
  }

  if (operations.length) await prisma.$transaction(operations)
}

async function migrateSourceReferences() {
  const sourceRoot = path.join(root, "src")
  const files = []
  const collect = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name)
      if (entry.isDirectory() && entry.name !== "generated") collect(absolutePath)
      else if (entry.isFile() && /\.(?:js|jsx|ts|tsx)$/.test(entry.name)) files.push(absolutePath)
    }
  }
  collect(sourceRoot)

  for (const filePath of files) {
    let source = readFileSync(filePath, "utf8")
    const references = [...new Set(source.match(/\/[A-Za-z0-9_.,%()@+\-/ ]+\.(?:avif|gif|jpe?g|png|webp)/gi) || [])]
    for (const reference of references) {
      const url = await migrateUrl(reference)
      source = source.split(reference).join(url)
    }
    writeFileSync(filePath, source)
  }
}

try {
  await migrateSourceReferences()
  await migrateDatabase()
  console.log(`Migración completada: ${migrated.size} imágenes subidas.`)
} finally {
  await prisma.$disconnect()
}

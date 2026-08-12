import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../src/generated/prisma/client.ts"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const local = []
const inspect = (model, id, field, value) => {
  const values = Array.isArray(value) ? value : [value]
  for (const url of values) {
    if (typeof url === "string" && url.startsWith("/")) local.push({ model, id, field, url })
  }
}

try {
  const [sections, products, posts, gallery, feedback, promotions] = await Promise.all([
    prisma.section.findMany({ select: { id: true, homeImage: true } }),
    prisma.product.findMany({ select: { id: true, photo: true, photos: true } }),
    prisma.post.findMany({ select: { id: true, coverImage: true } }),
    prisma.galleryImage.findMany({ select: { id: true, image: true } }),
    prisma.feedback.findMany({ select: { id: true, photo: true } }),
    prisma.promotion.findMany({ select: { id: true, image: true } }),
  ])

  for (const item of sections) inspect("Section", item.id, "homeImage", item.homeImage)
  for (const item of products) {
    inspect("Product", item.id, "photo", item.photo)
    inspect("Product", item.id, "photos", item.photos)
  }
  for (const item of posts) inspect("Post", item.id, "coverImage", item.coverImage)
  for (const item of gallery) inspect("GalleryImage", item.id, "image", item.image)
  for (const item of feedback) inspect("Feedback", item.id, "photo", item.photo)
  for (const item of promotions) inspect("Promotion", item.id, "image", item.image)

  console.log(JSON.stringify({ localReferences: local.length, local }, null, 2))
} finally {
  await prisma.$disconnect()
}

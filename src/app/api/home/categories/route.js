import { jsonOk, readStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const categories = (store.sections || [])
    .filter((section) => section.homeVisible !== false)
    .sort((left, right) => {
      const orderDifference = (left.homeOrder || 0) - (right.homeOrder || 0)
      if (orderDifference !== 0) return orderDifference
      return String(left.createdAt || "").localeCompare(String(right.createdAt || ""))
    })
    .map((section) => ({
      id: section.id,
      title: section.name,
      description: section.description,
      story: section.homeStory || section.description,
      image: section.homeImage,
      cta: section.homeCta || "Ver colección",
      order: section.homeOrder || 0,
    }))

  return jsonOk({ categories })
}

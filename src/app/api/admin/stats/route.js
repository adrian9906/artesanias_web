import { visibleFeedback } from "@/lib/cms/feedback"
import { getActivePromotion } from "@/lib/cms/promotion"
import { jsonOk, readStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  const publishedFeedback = visibleFeedback(store.feedback)
  const activePromotion = getActivePromotion(store.promotions, store.products)

  return jsonOk({
    sections: store.sections.length,
    products: store.products.length,
    posts: store.posts.length,
    feedback: store.feedback.length,
    promotions: store.promotions.length,
    promotionEnabled: Boolean(activePromotion),
    promotionTitle: activePromotion?.title || "",
    publishedFeedback: publishedFeedback.length,
    publishedPosts: store.posts.filter((post) => post.status === "published").length,
    draftPosts: store.posts.filter((post) => post.status === "draft").length,
    recentProducts: store.products.slice(0, 5),
    recentPosts: store.posts.slice(0, 5),
    recentFeedback: store.feedback
      .slice()
      .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")))
      .slice(0, 5),
  })
}

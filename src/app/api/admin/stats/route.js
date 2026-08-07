import { jsonOk, readStore } from "@/lib/cms/store"

export const dynamic = "force-dynamic"

export async function GET() {
  const store = await readStore()
  return jsonOk({
    sections: store.sections.length,
    products: store.products.length,
    posts: store.posts.length,
    publishedPosts: store.posts.filter((p) => p.status === "published").length,
    draftPosts: store.posts.filter((p) => p.status === "draft").length,
    recentProducts: store.products.slice(0, 5),
    recentPosts: store.posts.slice(0, 5),
  })
}

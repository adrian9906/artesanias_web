import BlogClient from "../blog-client"

export default async function BlogArticlePage({ params }) {
  const { id } = await params
  return <BlogClient key={id} articleId={id} />
}

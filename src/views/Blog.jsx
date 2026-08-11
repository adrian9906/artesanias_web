import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "../i18n"
import { productImages } from "../data/productCatalog"
import { api } from "@/lib/cms/client"
import { formatDate } from "@/lib/cms/constants"

const relatedImages = [productImages.jarras[1], productImages.aretes[1], productImages.funkos[0]]

export default function Blog({ articleId }) {
  const router = useRouter()
  const { t } = useI18n()
  const [cmsPost, setCmsPost] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!articleId) return
    let mounted = true
    api(`/api/admin/posts/${articleId}`)
      .then((data) => {
        if (!mounted) return
        setCmsPost(data?.post || null)
      })
      .catch(() => {
        if (!mounted) return
        setCmsPost(null)
      })
      .finally(() => {
        if (mounted) setReady(true)
      })
    return () => {
      mounted = false
    }
  }, [articleId])

  const fallbackArticle = useMemo(() => {
    const fb = t('blog.fallbackArticle')
    return { ...fb, image: productImages.funkos[0] }
  }, [t])

  const relatedArticles = useMemo(() => {
    const data = t('blog.relatedArticles')
    return data.map((item, i) => ({ ...item, image: relatedImages[i] }))
  }, [t])

  const article = useMemo(() => {
    if (cmsPost) {
      return {
        id: cmsPost.id,
        category: cmsPost.category,
        date: formatDate(cmsPost.publishedAt || cmsPost.createdAt),
        title: cmsPost.title,
        excerpt: cmsPost.excerpt || "",
        author: cmsPost.author || t('news.author'),
        image: cmsPost.coverImage || productImages.funkos[0],
        readTime: t('news.readTime'),
        body: cmsPost.body || "",
      }
    }

    if (!articleId) return { ...fallbackArticle, id: articleId }

    if (!ready) return null

    const primary = t('newsArticlesData.articles')
    const secondary = t('newsArticlesData.carouselArticles')
    const primaryImages = [productImages.funkos[2], productImages.jarras[0], productImages.jarras[1], productImages.aretes[1], productImages.jarras[2]]
    const secondaryImages = [productImages.funkos[0], productImages.jarras[0], productImages.funkos[1]]
    const allArticles = [
      ...primary.map((item, index) => ({ ...item, image: primaryImages[index] })),
      ...secondary.map((item, index) => ({ ...item, image: secondaryImages[index] })),
    ]
    const selected = allArticles.find((item) => String(item.id) === String(articleId))
    return selected ? { ...selected, author: t('news.author'), readTime: t('news.readTime') } : fallbackArticle
  }, [articleId, ready, cmsPost, fallbackArticle, t])

  return (
    <div className="relative min-h-screen antialiased bg-forest-dark animate-blurred-fade-in">
      <div className="fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 pb-20 pt-24 sm:pt-28 md:pt-32">
        <section className="container mx-auto px-4 pb-6 pt-6 sm:px-5 md:px-6 md:pb-8 md:pt-8">
          <button
            type="button"
            onClick={() => router.push("/noticias")}
            className="inline-flex items-center gap-2 rounded-full border border-gold-accent/40 px-4 py-2 text-sm text-gold-light transition-colors hover:bg-gold-accent hover:text-forest-dark sm:px-5"
          >
            <span aria-hidden>←</span>
            {t("common.backToNews")}
          </button>
        </section>

        {!article && (
          <section className="container mx-auto max-w-4xl px-4 sm:px-5 md:px-6">
            <div className="space-y-4">
              <div className="h-10 w-2/3 animate-pulse rounded-xl bg-white/10" />
              <div className="h-6 w-1/3 animate-pulse rounded-xl bg-white/5" />
            </div>
            <div className="mt-10 aspect-[16/9] animate-pulse rounded-2xl border border-white/10 bg-white/5" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded-lg bg-white/5" />
              <div className="h-4 w-5/6 animate-pulse rounded-lg bg-white/5" />
              <div className="h-4 w-2/3 animate-pulse rounded-lg bg-white/5" />
            </div>
          </section>
        )}

        {article && (
        <>
        <section className="container mx-auto px-4 pb-10 pt-4 text-center sm:px-5 md:px-6 md:pb-14 md:pt-6">
          <h1 className="mx-auto max-w-5xl font-display text-[clamp(2.7rem,10vw,4.4rem)] font-bold leading-[1.02] text-cream drop-shadow-lg md:text-7xl">
            {article.title}
          </h1>
        </section>

        <section className="container relative mx-auto max-w-4xl px-4 sm:px-5">
          <div
            className="relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-12"
            style={{
              background: "rgba(38, 59, 34, 0.76)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(249, 172, 162, 0.3)",
              boxShadow: "inset 0 0 40px rgba(200, 228, 157, 0.08), 0 22px 55px rgba(15, 29, 12, 0.2)",
            }}
          >
            <div className="mb-6 flex flex-col gap-4 border-b border-cream/20 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:pb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-11 w-11 rounded-full border border-cream/20 bg-gradient-to-br from-gold-accent/30 to-gold-accent/10 sm:h-12 sm:w-12" />
                <div>
                  <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">{t('blog.writtenBy')}</p>
                  <p className="text-base font-medium text-cream sm:text-lg">{article.author ?? "Equipo Thay Art"}</p>
                </div>
              </div>
              <div className="text-left text-xs uppercase tracking-[0.18em] text-cream/40 sm:text-right sm:text-sm">
                {article.date} · {article.readTime ?? "6 min de lectura"}
              </div>
            </div>

            <div className="my-6 sm:my-8">
              <img
                alt={article.title}
                className="h-auto max-h-[420px] w-full rounded-xl border border-white/5 object-cover shadow-2xl"
                src={article.image}
              />
            </div>

            <article className="text-cream/70 font-light leading-relaxed">
              <p className="mb-5 text-lg italic leading-8 sm:mb-6 sm:text-xl">{article.excerpt}</p>
              {article.body ? (
                <div className="cms-body space-y-4 text-[1rem] leading-8 sm:text-[1.05rem]" dangerouslySetInnerHTML={{ __html: article.body }} />
              ) : (
                <>
                  <p className="mb-6">
                    {t('blog.creativeJournal')}
                  </p>
                  <p className="mb-6">
                    {t('blog.customNote')}
                  </p>
                </>
              )}
            </article>

            <div className="mt-10 flex flex-wrap gap-2.5 border-t border-cream/20 pt-6 sm:mt-12 sm:gap-3 sm:pt-8">
              {[`#${article.category?.toUpperCase() ?? "DESTACADO"}`, "#ARTESANÍA", "#NATURALEZA"].map((tag) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full border border-cream/20 px-3 py-1.5 text-[11px] uppercase tracking-wider text-cream/60 transition-colors hover:bg-cream/10 sm:px-4 sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto mt-16 max-w-6xl px-4 sm:px-5 md:mt-24 md:px-6">
          <h3 className="mb-6 font-display text-2xl text-cream sm:text-3xl md:mb-8">{t('blog.relatedStories')}</h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {relatedArticles.map((related, i) => (
              <article
                key={i}
                className="rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 group"
                style={{
                  background: "rgba(38, 59, 34, 0.76)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(249, 172, 162, 0.3)",
                  boxShadow: "inset 0 0 40px rgba(200, 228, 157, 0.08), 0 22px 55px rgba(15, 29, 12, 0.2)",
                }}
              >
                <div className="h-44 overflow-hidden sm:h-48">
                  <img
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={related.image}
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className={`text-[10px] uppercase tracking-widest font-semibold mb-2 ${related.categoryColor}`}>
                    {related.category}
                  </p>
                  <h4 className="text-xl font-semibold text-cream mb-3 font-display">{related.title}</h4>
                  <p className="text-sm text-cream/40 line-clamp-2">{related.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        </>
        )}
      </div>
    </div>
  )
}






import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "../i18n"
import { productImages } from "../data/productCatalog"

const relatedImages = [productImages.jarras[1], productImages.aretes[1], productImages.funkos[0]]

export default function Blog({ articleId }) {
  const router = useRouter()
  const { t } = useI18n()

  const fallbackArticle = useMemo(() => {
    const fb = t('blog.fallbackArticle')
    return { ...fb, image: productImages.funkos[0] }
  }, [t])

  const relatedArticles = useMemo(() => {
    const data = t('blog.relatedArticles')
    return data.map((item, i) => ({ ...item, image: relatedImages[i] }))
  }, [t])

  const article = useMemo(() => {
    if (!articleId) return fallbackArticle

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
  }, [articleId, fallbackArticle, t])

  return (
    <div className="relative min-h-screen antialiased bg-forest-dark animate-blurred-fade-in">
      <div className="fixed inset-0 z-0 pointer-events-none" />

      <div className="relative z-10 pt-32 pb-24">
        <section className="container mx-auto px-6 pt-8 pb-8">
          <button
            type="button"
            onClick={() => router.push("/noticias")}
            className="inline-flex items-center gap-2 rounded-full border border-gold-accent/40 px-5 py-2 text-sm text-gold-light hover:bg-gold-accent hover:text-forest-dark transition-colors"
          >
            <span aria-hidden>←</span>
            {t("common.backToNews")}
          </button>
        </section>

        <section className="container mx-auto px-6 text-center pt-6 pb-14">
          <h1 className="text-5xl md:text-7xl font-bold text-cream leading-tight drop-shadow-lg max-w-5xl mx-auto font-display">
            {article.title}
          </h1>
        </section>

        <section className="container mx-auto px-4 max-w-4xl relative">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "rgba(38, 59, 34, 0.76)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(249, 172, 162, 0.3)",
              boxShadow: "inset 0 0 40px rgba(200, 228, 157, 0.08), 0 22px 55px rgba(15, 29, 12, 0.2)",
            }}
          >
            <div className="flex items-center justify-between border-b border-cream/20 pb-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full object-cover border border-cream/20 bg-gradient-to-br from-gold-accent/30 to-gold-accent/10" />
                <div>
                  <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">{t('blog.writtenBy')}</p>
                  <p className="text-lg font-medium text-cream">{article.author ?? "Equipo Thay Art"}</p>
                </div>
              </div>
              <div className="text-right text-sm text-cream/40 uppercase tracking-widest">
                {article.date} · {article.readTime ?? "6 min de lectura"}
              </div>
            </div>

            <div className="my-8">
              <img
                alt={article.title}
                className="w-full h-auto max-h-[420px] rounded-lg shadow-2xl object-cover border border-white/5"
                src={article.image}
              />
            </div>

            <article className="text-cream/70 font-light leading-relaxed">
              <p className="text-xl mb-6 italic">{article.excerpt}</p>
              <p className="mb-6">
                {t('blog.creativeJournal')}
              </p>
              <p className="mb-6">
                {t('blog.customNote')}
              </p>
            </article>

            <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-cream/20">
              {[`#${article.category?.toUpperCase() ?? "DESTACADO"}`, "#ARTESANÍA", "#NATURALEZA"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-cream/20 text-xs text-cream/60 hover:bg-cream/10 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl mt-24">
          <h3 className="text-3xl font-display text-cream mb-8">{t('blog.relatedStories')}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="h-48 overflow-hidden">
                  <img
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={related.image}
                  />
                </div>
                <div className="p-6">
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
      </div>
    </div>
  )
}






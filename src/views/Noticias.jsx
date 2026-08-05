import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { productImages } from "../data/productCatalog"
import { useI18n } from "../i18n"

function CardReveal({ children, index }) {
  const revealRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100)
          obs.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return <div ref={revealRef} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>{children}</div>
}

function BentoCard({ article, index, className, onOpenArticle, t }) {
  const isFeature = article.span === "feature"

  return (
    <CardReveal index={index}>
      <button type="button" onClick={() => onOpenArticle(article)}>
        <article
          className={`group relative overflow-hidden rounded-2xl ${className ?? ""}`}
          style={{
            background: "rgba(38, 59, 34, 0.78)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <img alt={article.title} className={`size-full object-cover transition-all duration-700 group-hover:scale-105 ${isFeature ? "opacity-40" : "opacity-30"}`} src={article.image} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(5,10,7,0.95)]" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ background: "rgba(249, 172, 162, 0.16)", color: "#FFD5CF", border: "1px solid rgba(249, 172, 162, 0.28)" }}>
                {article.category}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-cream/40">{article.date}</span>
            </div>

            <h3 className={`font-display font-semibold text-cream leading-tight text-left mb-2 ${isFeature ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>{article.title}</h3>
            <p className={`text-cream/60 font-light leading-relaxed text-left ${isFeature ? "text-sm md:text-base line-clamp-3" : "text-xs md:text-sm line-clamp-2"}`}>{article.excerpt}</p>

            <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/50 transition-colors duration-300 hover:text-gold-accent w-fit">
              {isFeature ? t('news.readChronicle') : t('news.readMore')}
            </div>
          </div>
        </article>

      </button>
    </CardReveal>
  )
}

function CarouselCard({ article, onOpenArticle, t }) {
  return (
    <>
      <button type="button" onClick={() => onOpenArticle(article)} >
        <article
          data-carousel-card
          className="group relative flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] overflow-hidden rounded-xl snap-start"
          style={{
            background: "rgba(38, 59, 34, 0.74)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div className="relative h-40 overflow-hidden">
            <img alt={article.title} className="size-full object-cover transition-all duration-500 group-hover:scale-105" src={article.image} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,10,7,0.9)] via-transparent to-transparent" />
          </div>

          <div className="p-4 flex flex-col items-start mx-auto text-left">
            <span className="text-[9px] uppercase tracking-[0.15em] text-cream/40">{article.date}</span>
            <h4 className="mt-1.5 font-display text-base font-semibold text-cream leading-snug line-clamp-2">{article.title}</h4>
            <p className="mt-2 text-xs leading-relaxed text-cream/50 line-clamp-2 font-light">{article.excerpt}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 transition-colors duration-300 hover:text-gold-accent">
              {t('news.read')}
            </div>
          </div>
        </article>
      </button>
    </>
  )
}

export default function Noticias() {
  const { t } = useI18n()
  const router = useRouter()
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const articles = useMemo(() => {
    const data = t('newsArticlesData.articles')
    const images = [productImages.funkos[2], productImages.jarras[0], productImages.jarras[1], productImages.aretes[1], productImages.jarras[2]]
    const spans = ["feature", "side-top", "side-bottom", "medium", "wide"]
    return data.map((item, i) => ({ ...item, image: images[i], span: spans[i] }))
  }, [t])

  const carouselArticles = useMemo(() => {
    const data = t('newsArticlesData.carouselArticles')
    const images = [productImages.funkos[0], productImages.jarras[0], productImages.funkos[1]]
    return data.map((item, i) => ({ ...item, image: images[i] }))
  }, [t])

  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const handler = () => updateScrollButtons()
    handler()
    el.addEventListener("scroll", handler, { passive: true })
    window.addEventListener("resize", handler)
    return () => {
      el.removeEventListener("scroll", handler)
      window.removeEventListener("resize", handler)
    }
  }, [updateScrollButtons])

  const openArticle = (article) => router.push(`/blog/${article.id}`)

  const scrollCarousel = (dir) => {
    const el = carouselRef.current
    if (!el) return
    const card = el.querySelector("[data-carousel-card]")
    if (!card) return
    const gap = 24
    const step = card.getBoundingClientRect().width + gap
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  const gridClass = (span) => {
    switch (span) {
      case "feature":
        return "md:col-span-7 md:row-span-2 min-h-[420px] md:min-h-[520px]"
      case "side-top":
      case "side-bottom":
        return "md:col-span-5 md:row-span-1 min-h-[200px] md:min-h-[248px]"
      case "medium":
        return "md:col-span-4 md:row-span-1 min-h-[220px] md:min-h-[260px]"
      case "wide":
        return "md:col-span-8 md:row-span-1 min-h-[220px] md:min-h-[260px]"
      default:
        return "md:col-span-4 min-h-[220px]"
    }
  }

  return (
    <div className="relative min-h-screen bg-forest-dark animate-blurred-fade-in">
      <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <section className="text-center mb-16 mt-4">
          <span className="inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] mb-6" style={{ background: "#F9ACA2", color: "#1B2918", border: "1px solid rgba(255, 213, 207, 0.7)" }}>
            {t('news.badge')}
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-cream mb-6 leading-tight tracking-tight">{t('news.title')}</h1>
          <p className="text-base md:text-lg text-cream/50 max-w-2xl mx-auto font-light leading-relaxed">{t('news.subtitle')}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
          {articles.map((article, i) => (
            <div key={article.id} className={gridClass(article.span)}>
              <BentoCard article={article} index={i} className="h-full" onOpenArticle={openArticle} t={t} />
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-cream">{t('news.sectionTitle')}</h2>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => scrollCarousel(-1)} disabled={!canScrollLeft} className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-20" aria-label={t('news.prev')}>◀</button>
              <button onClick={() => scrollCarousel(1)} disabled={!canScrollRight} className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-20" aria-label={t('news.next')}>▶</button>
            </div>
          </div>

          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {carouselArticles.map((article) => (
              <CarouselCard key={article.id} article={article} onOpenArticle={openArticle} t={t} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}



import { useRef, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { productImages } from "../data/productCatalog"
import { useI18n } from "../i18n"
import { api } from "@/lib/cms/client"
import { categoryLabel, formatDate, POST_CATEGORIES } from "@/lib/cms/constants"

const FALLBACK_SPREAD = [
  productImages.funkos[2],
  productImages.jarras[0],
  productImages.jarras[1],
  productImages.aretes[1],
  productImages.jarras[2],
  productImages.funkos[0],
  productImages.aretes[0],
  productImages.funkos[1],
]

const BENTO = [
  { span: "md:col-span-7 md:row-span-2", featured: true },
  { span: "md:col-span-5", featured: false },
  { span: "md:col-span-5", featured: false },
  { span: "md:col-span-4", featured: false },
  { span: "md:col-span-4", featured: false },
  { span: "md:col-span-4", featured: false },
  { span: "md:col-span-6", featured: false },
  { span: "md:col-span-6", featured: false },
]

const TABS = [{ id: "all", label: "Todas" }, ...POST_CATEGORIES]

function CardReveal({ children, index, className }) {
  const revealRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 90)
          obs.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={revealRef}
      className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function BentoTile({ article, index, span, featured, onOpen, t }) {
  return (
    <CardReveal index={index} className={`${span} aspect-[4/3] md:aspect-auto`}>
      <button
        type="button"
        onClick={onOpen}
        className="group relative block h-full w-full overflow-hidden rounded-3xl text-left"
        style={{
          background: "rgba(38, 59, 34, 0.82)",
          border: "1px solid rgba(249, 172, 162, 0.22)",
          boxShadow: "0 22px 55px rgba(10, 18, 9, 0.5)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt={article.title}
            className={`size-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110 ${
              featured ? "opacity-50" : "opacity-40"
            }`}
            src={article.image}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-[rgba(5,9,5,0.98)]" />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(120% 90% at 20% 0%, rgba(249,172,162,0.18), transparent 55%), radial-gradient(100% 100% at 90% 100%, rgba(200,228,157,0.12), transparent 50%)",
            }}
          />
        </div>

        {featured && (
          <span className="absolute left-[18px] top-[18px] rounded-full border border-gold-light/30 bg-[#1b2918]/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-gold-light backdrop-blur-sm">
            {t("news.featured")}
          </span>
        )}

        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-7">
          <div className="flex items-center gap-3">
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ background: "rgba(249, 172, 162, 0.16)", color: "#FFD5CF", border: "1px solid rgba(249, 172, 162, 0.3)" }}
            >
              {article.category}
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-cream/40">{article.date}</span>
          </div>

          <h3 className={`mt-3 font-display font-semibold leading-tight text-cream ${featured ? "text-2xl md:text-4xl" : "text-lg md:text-2xl"}`}>
            {article.title}
          </h3>
          <p className={`mt-2 font-light leading-relaxed text-cream/60 ${featured ? "max-w-2xl text-sm md:text-base line-clamp-3" : "line-clamp-2 text-sm"}`}>
            {article.excerpt}
          </p>

          <div className="mt-5 inline-flex w-fit items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/50 transition-colors duration-300 group-hover:text-gold-light">
            {featured ? t("news.readChronicle") : t("news.readMore")}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </button>
    </CardReveal>
  )
}

export default function Noticias() {
  const { t } = useI18n()
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    let mounted = true
    api("/api/admin/posts")
      .then((data) => {
        const published = (data.posts || [])
          .filter((post) => post.status === "published")
          .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
        if (mounted) setPosts(published)
      })
      .catch(() => {
        if (mounted) setPosts([])
      })
      .finally(() => {
        if (mounted) setLoaded(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  const allPost = useMemo(
    () =>
      posts.map((post, i) => ({
        id: post.id,
        category: categoryLabel(post.category),
        catId: post.category,
        date: formatDate(post.publishedAt || post.createdAt),
        title: post.title,
        excerpt: post.excerpt || "",
        image: post.coverImage || FALLBACK_SPREAD[i % FALLBACK_SPREAD.length],
      })),
    [posts],
  )

  const visible = useMemo(
    () => (activeTab === "all" ? allPost : allPost.filter((p) => p.catId === activeTab)),
    [allPost, activeTab],
  )

  const openArticle = (article) => router.push(`/blog/${article.id}`)

  return (
    <div className="relative min-h-screen bg-forest-dark animate-blurred-fade-in">
      <div className="relative z-10 px-6 pb-24 pt-32 max-w-7xl mx-auto">
        <section className="mb-12 mt-4 text-center">
          <span
            className="mb-6 inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]"
            style={{ background: "#F9ACA2", color: "#1B2918", border: "1px solid rgba(255, 213, 207, 0.7)" }}
          >
            {t("news.badge")}
          </span>
          <h1 className="mb-6 font-display text-5xl font-semibold leading-tight tracking-tight text-cream md:text-7xl">
            {t("news.title")}
          </h1>
          <p className="mx-auto max-w-2xl font-light leading-relaxed text-cream/50 md:text-lg">
            {t("news.subtitle")}
          </p>
        </section>

        <div className="mb-10 flex items-center gap-6 overflow-x-auto border-b border-white/10" style={{ scrollbarWidth: "none" }} role="tablist" aria-label="Categorías de noticias">
          {TABS.map((tab) => {
            const active = activeTab === tab.id
            const count = tab.id === "all" ? allPost.length : allPost.filter((p) => p.catId === tab.id).length
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 pb-3 pt-1 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
                  active ? "text-gold-light" : "text-cream/45 hover:text-cream/70"
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-[10px] tabular-nums ${active ? "text-gold-accent/70" : "text-cream/30"}`}>{count}</span>
                {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gold-accent" />}
              </button>
            )
          })}
        </div>

        {!loaded && (
          <div className="grid grid-cols-1 gap-5 md:auto-rows-[220px] md:grid-cols-12">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`aspect-[4/3] animate-pulse rounded-3xl border border-white/10 bg-white/5 ${i === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"}`}
              />
            ))}
          </div>
        )}

        {loaded && visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-base font-medium text-cream">Sin publicaciones en esta categoría</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-cream/50">
              Selecciona «Todas» para ver el resto de las crónicas del bosque.
            </p>
          </div>
        )}

        {loaded && visible.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:auto-rows-[220px] md:grid-cols-12">
            {visible.map((article, i) => {
              const slot = BENTO[i % BENTO.length]
              return (
                <BentoTile
                  key={article.id}
                  article={article}
                  index={i}
                  span={slot.span}
                  featured={slot.featured}
                  onOpen={() => openArticle(article)}
                  t={t}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
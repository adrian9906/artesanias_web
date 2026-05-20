import { useRef, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { productImages } from "../data/productCatalog"

const articles = [
  {
    id: 1,
    category: "Destacado",
    date: "12 de octubre, 2024",
    title: "El despertar de las hadas de invierno",
    excerpt:
      "Descubre nuestra nueva colección de figuras místicas inspiradas en el folclore invernal. Cada pieza ha sido modelada a mano con porcelana fría y pigmentos minerales.",
    image: productImages.funkos[2],
    span: "feature",
  },
  {
    id: 2,
    category: "Taller y proceso",
    date: "05 de octubre, 2024",
    title: "Secretos de la botánica prensada",
    excerpt: "La técnica de impresión botánica directa sobre arcilla polimérica para preservar la belleza de los helechos locales.",
    image: productImages.aretes[0],
    span: "side-top",
  },
  {
    id: 3,
    category: "Inspiración",
    date: "28 de septiembre, 2024",
    title: "Amuletos de la tierra firme",
    excerpt: "Las bellotas y piñas dominan nuestra estética este trimestre. Un viaje por el simbolismo de la protección.",
    image: productImages.jarras[1],
    span: "side-bottom",
  },
  {
    id: 4,
    category: "Detrás de escena",
    date: "20 de septiembre, 2024",
    title: "La paciencia de lo translúcido",
    excerpt: "El reto de trabajar con pastas cerámicas de alta transparencia y cómo logramos ese acabado de hielo eterno.",
    image: productImages.aretes[1],
    span: "medium",
  },
  {
    id: 5,
    category: "Sostenibilidad",
    date: "10 de septiembre, 2024",
    title: "Compromiso con el bosque",
    excerpt: "Por cada pieza mística que viaja a un nuevo hogar, plantamos un brote de roble en las colinas que nos vieron nacer.",
    image: productImages.jarras[2],
    span: "wide",
  },
]

const carouselArticles = [
  {
    id: 6,
    category: "Entrevistas",
    date: "15 de septiembre, 2024",
    title: "El arte de la paciencia",
    excerpt: "Conversamos con Elena sobre las horas de silencio que requiere cada pieza.",
    image: productImages.funkos[0],
  },
  {
    id: 7,
    category: "Materiales",
    date: "8 de septiembre, 2024",
    title: "Arcillas del mundo",
    excerpt: "Un recorrido por las distintas tierras que usamos y su textura única.",
    image: productImages.jarras[0],
  },
  {
    id: 8,
    category: "Eventos",
    date: "1 de septiembre, 2024",
    title: "Feria de artesanos 2024",
    excerpt: "Nos preparamos para la feria anual con piezas inéditas.",
    image: productImages.funkos[1],
  },
]

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

function BentoCard({ article, index, className, onOpenArticle }) {
  const isFeature = article.span === "feature"

  return (
    <CardReveal index={index}>
      <button type="button" onClick={() => onOpenArticle(article)}>
        <article
          className={`group relative overflow-hidden rounded-2xl ${className ?? ""}`}
          style={{
            background: "rgba(10, 15, 12, 0.75)",
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
              <span className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ background: "rgba(197, 160, 89, 0.18)", color: "#C5A059", border: "1px solid rgba(197, 160, 89, 0.25)" }}>
                {article.category}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-cream/40">{article.date}</span>
            </div>

            <h3 className={`font-display font-semibold text-cream leading-tight text-left mb-2 ${isFeature ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>{article.title}</h3>
            <p className={`text-cream/60 font-light leading-relaxed text-left ${isFeature ? "text-sm md:text-base line-clamp-3" : "text-xs md:text-sm line-clamp-2"}`}>{article.excerpt}</p>

            <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/50 transition-colors duration-300 hover:text-gold-accent w-fit">
              {isFeature ? "Leer crónica" : "Ver más"}
            </div>
          </div>
        </article>

      </button>
    </CardReveal>
  )
}

function CarouselCard({ article, onOpenArticle }) {
  return (
    <>
      <button type="button" onClick={() => onOpenArticle(article)} >
        <article
          data-carousel-card
          className="group relative flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] overflow-hidden rounded-xl snap-start"
          style={{
            background: "rgba(10, 15, 12, 0.7)",
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
              Leer
            </div>
          </div>
        </article>
      </button>
    </>
  )
}

export default function Noticias() {
  const navigate = useNavigate()
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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

  const openArticle = (article) => {
    navigate("/blog", {
      state: {
        article: {
          ...article,
          author: "Equipo Evergreen",
          readTime: "6 min de lectura",
        },
      },
    })
  }

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
          <span className="inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] mb-6" style={{ background: "rgba(197, 160, 89, 0.12)", color: "#C5A059", border: "1px solid rgba(197, 160, 89, 0.2)" }}>
            Bitácora del bosque
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-cream mb-6 leading-tight tracking-tight">Crónicas de la <br /><span style={{ color: "#C5A059" }}>Tierra Fría</span></h1>
          <p className="text-base md:text-lg text-cream/50 max-w-2xl mx-auto font-light leading-relaxed">Relatos de barro, botánica y la magia que habita en las manos de la artesana.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
          {articles.map((article, i) => (
            <div key={article.id} className={gridClass(article.span)}>
              <BentoCard article={article} index={i} className="h-full" onOpenArticle={openArticle} />
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-cream">Noticias y Novedades</h2>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => scrollCarousel(-1)} disabled={!canScrollLeft} className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-20" aria-label="Anterior">◀</button>
              <button onClick={() => scrollCarousel(1)} disabled={!canScrollRight} className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-20" aria-label="Siguiente">▶</button>
            </div>
          </div>

          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {carouselArticles.map((article) => (
              <CarouselCard key={article.id} article={article} onOpenArticle={openArticle} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}



import { useRef, useState, useEffect, useCallback } from "react"

const articles = [
  {
    id: 1,
    category: "Destacado",
    date: "12 de octubre, 2024",
    title: "El despertar de las hadas de invierno",
    excerpt:
      "Descubre nuestra nueva colección de figuras místicas inspiradas en el folclore invernal. Cada pieza ha sido modelada a mano con porcelana fría y pigmentos minerales que capturan la esencia del bosque dormido.",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&q=85&auto=format&fit=crop",
    span: "feature",
  },
  {
    id: 2,
    category: "Taller y proceso",
    date: "05 de octubre, 2024",
    title: "Secretos de la botánica prensada",
    excerpt:
      "La técnica de impresión botánica directa sobre arcilla polimérica para preservar la belleza de los helechos locales.",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=85&auto=format&fit=crop",
    span: "side-top",
  },
  {
    id: 3,
    category: "Inspiración",
    date: "28 de septiembre, 2024",
    title: "Amuletos de la tierra firme",
    excerpt:
      "Las bellotas y piñas dominan nuestra estética este trimestre. Un viaje por el simbolismo de la protección.",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=85&auto=format&fit=crop",
    span: "side-bottom",
  },
  {
    id: 4,
    category: "Detrás de escena",
    date: "20 de septiembre, 2024",
    title: "La paciencia de lo translúcido",
    excerpt:
      "El reto de trabajar con pastas cerámicas de alta transparencia y cómo logramos ese acabado de hielo eterno.",
    image:
      "https://images.unsplash.com/photo-1534501437156-c3bb4ae0e45f?w=600&q=85&auto=format&fit=crop",
    span: "medium",
  },
  {
    id: 5,
    category: "Sostenibilidad",
    date: "10 de septiembre, 2024",
    title: "Compromiso con el bosque",
    excerpt:
      "Por cada pieza mística que viaja a un nuevo hogar, plantamos un brote de roble en las colinas que nos vieron nacer.",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=900&q=85&auto=format&fit=crop",
    span: "wide",
  },
]

const carouselArticles = [
  {
    id: 6,
    category: "Entrevistas",
    date: "15 de Septiembre, 2024",
    title: "El Arte de la Paciencia",
    excerpt:
      "Conversamos con Elena sobre las horas de silencio que requiere cada pieza antes de estar lista para su nuevo hogar.",
    image:
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 7,
    category: "Materiales",
    date: "8 de Septiembre, 2024",
    title: "Arcillas del Mundo",
    excerpt:
      "Un recorrido por las distintas tierras que usamos y cómo cada una aporta una textura y temperatura única.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 8,
    category: "Eventos",
    date: "1 de Septiembre, 2024",
    title: "Feria de Artesanos 2024",
    excerpt:
      "Nos preparamos para la feria anual donde presentaremos nuestra colección de invierno con piezas inéditas.",
    image:
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 9,
    category: "Colaboraciones",
    date: "25 de Agosto, 2024",
    title: "Tejedoras del Sur",
    excerpt:
      "Una alianza con artesanas textiles del sur para crear piezas que fusionan barro y fibra natural en una sola voz.",
    image:
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 10,
    category: "Historia",
    date: "18 de Agosto, 2024",
    title: "Raíces de Porcelana",
    excerpt:
      "Cómo una tradición familiar de tres generaciones encontró su voz en la porcelana fría del bosque.",
    image:
      "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e96?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: 11,
    category: "Técnica",
    date: "10 de Agosto, 2024",
    title: "Pigmentos Naturales",
    excerpt:
      "Extraemos colores de cortezas, líquenes y minerales para crear una paleta que solo la tierra puede ofrecer.",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=85&auto=format&fit=crop",
  },
]

function CardReveal({ children, index, className }) {
  const revealRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return
    let timer = null
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setIsVisible(true), index * 120)
          obs.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (timer) clearTimeout(timer)
    }
  }, [index])

  return (
    <div
      ref={revealRef}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function BentoCard({ article, index, className }) {
  const isFeature = article.span === "feature"

  return (
    <CardReveal index={index}>
      <article
        className={`group relative overflow-hidden rounded-2xl ${className ?? ""}`}
        style={{
          background: "rgba(10, 15, 12, 0.75)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <img
            alt={article.title}
            className={`size-full object-cover transition-all duration-700 group-hover:scale-105 ${isFeature ? "opacity-40" : "opacity-30"}`}
            src={article.image}
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background: isFeature
                ? "linear-gradient(180deg, rgba(5,10,7,0.3) 0%, rgba(5,10,7,0.85) 50%, rgba(5,10,7,0.95) 100%)"
                : "linear-gradient(180deg, rgba(5,10,7,0.1) 0%, rgba(5,10,7,0.8) 60%, rgba(5,10,7,0.95) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-7">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{
                background: "rgba(197, 160, 89, 0.18)",
                color: "#C5A059",
                border: "1px solid rgba(197, 160, 89, 0.25)",
              }}
            >
              {article.category}
            </span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-cream/40">{article.date}</span>
          </div>

          <h3
            className={`font-display font-semibold text-cream leading-tight mb-2 ${isFeature ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}
          >
            {article.title}
          </h3>

          <p
            className={`text-cream/60 font-light leading-relaxed ${isFeature ? "text-sm md:text-base line-clamp-3" : "text-xs md:text-sm line-clamp-2"}`}
          >
            {article.excerpt}
          </p>

          <a
            href="#"
            className="mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/50 transition-colors duration-300 hover:text-gold-accent w-fit"
          >
            {isFeature ? "Leer crónica" : "Ver más"}
            <svg className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </a>
        </div>
      </article>
    </CardReveal>
  )
}

function CarouselCard({ article, index }) {
  return (
    <article
      data-carousel-card
      className="group relative flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] overflow-hidden rounded-xl snap-start"
      style={{
        background: "rgba(10, 15, 12, 0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          alt={article.title}
          className="size-full object-cover transition-all duration-500 group-hover:scale-105"
          src={article.image}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,10,7,0.9)] via-transparent to-transparent" />
        <span
          className="absolute left-3 top-3 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em]"
          style={{
            background: "rgba(197, 160, 89, 0.18)",
            color: "#C5A059",
            border: "1px solid rgba(197, 160, 89, 0.25)",
          }}
        >
          {article.category}
        </span>
      </div>

      <div className="p-4">
        <span className="text-[9px] uppercase tracking-[0.15em] text-cream/40">{article.date}</span>
        <h4 className="mt-1.5 font-display text-base font-semibold text-cream leading-snug line-clamp-2">{article.title}</h4>
        <p className="mt-2 text-xs leading-relaxed text-cream/50 line-clamp-2 font-light">{article.excerpt}</p>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-cream/40 transition-colors duration-300 hover:text-gold-accent"
        >
          Leer
          <svg className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default function Noticias() {
  const carouselRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

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

  const scrollCarousel = (dir) => {
    const el = carouselRef.current
    if (!el) return
    const card = el.querySelector("[data-carousel-card]")
    if (!card) return
    const gap = 24
    const step = card.getBoundingClientRect().width + gap
    el.scrollBy({ left: dir * step, behavior: "smooth" })
  }

  const handleDragStart = (e) => {
    setIsDragging(true)
    const el = carouselRef.current
    if (!el) return
    const x = e.type.startsWith("touch") ? e.touches[0].pageX : e.pageX
    dragStart.current = { x, scrollLeft: el.scrollLeft }
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    const el = carouselRef.current
    if (!el) return
    e.preventDefault()
    const x = e.type.startsWith("touch") ? e.touches[0].pageX : e.pageX
    const walk = (dragStart.current.x - x) * 1.2
    el.scrollLeft = dragStart.current.scrollLeft + walk
  }

  const handleDragEnd = () => setIsDragging(false)

  const gridClass = (span) => {
    switch (span) {
      case "feature":
        return "md:col-span-7 md:row-span-2 min-h-[420px] md:min-h-[520px]"
      case "side-top":
        return "md:col-span-5 md:row-span-1 min-h-[200px] md:min-h-[248px]"
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
      <div
        className="fixed inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <section className="text-center mb-16 mt-4">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] mb-6"
            style={{
              background: "rgba(197, 160, 89, 0.12)",
              color: "#C5A059",
              border: "1px solid rgba(197, 160, 89, 0.2)",
            }}
          >
            Bitácora del bosque
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-cream mb-6 leading-tight tracking-tight">
            Crónicas de la
            <br />
            <span style={{ color: "#C5A059" }}>Tierra Fría</span>
          </h1>
          <p className="text-base md:text-lg text-cream/50 max-w-2xl mx-auto font-light leading-relaxed">
            Relatos de barro, botánica y la magia que habita en las manos de la artesana.
          </p>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-auto">
          {articles.map((article, i) => (
            <div key={article.id} className={gridClass(article.span)}>
              <BentoCard article={article} index={i} className="h-full" />
            </div>
          ))}
        </section>

        {/* Carousel */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span
                className="inline-block rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] mb-3"
                style={{
                  background: "rgba(197, 160, 89, 0.12)",
                  color: "#C5A059",
                  border: "1px solid rgba(197, 160, 89, 0.2)",
                }}
              >
                Más relatos
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-cream">
                Noticias y Novedades
              </h2>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollCarousel(-1)}
                disabled={!canScrollLeft}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                style={{
                  borderColor: canScrollLeft ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  color: canScrollLeft ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
                }}
                aria-label="Anterior"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                disabled={!canScrollRight}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed"
                style={{
                  borderColor: canScrollRight ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                  color: canScrollRight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)",
                }}
                aria-label="Siguiente"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Gradient fades on edges */}
            {canScrollLeft && (
              <div
                className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden md:block"
                style={{
                  background: "linear-gradient(to right, #070a08 0%, transparent 100%)",
                }}
              />
            )}
            {canScrollRight && (
              <div
                className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none hidden md:block"
                style={{
                  background: "linear-gradient(to left, #070a08 0%, transparent 100%)",
                }}
              />
            )}

            <div
              ref={carouselRef}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
              className={`flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
              role="region"
              aria-label="Carrusel de noticias"
            >
              {carouselArticles.map((article, i) => (
                <CarouselCard key={article.id} article={article} index={i} />
              ))}
            </div>
          </div>

          {/* Mobile pagination dots */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {carouselArticles.map((article, dotIdx) => (
              <button
                key={article.id}
                onClick={() => {
                  const el = carouselRef.current
                  if (!el) return
                  const card = el.querySelector("[data-carousel-card]")
                  if (!card) return
                  const gap = 24
                  const w = card.getBoundingClientRect().width + gap
                  el.scrollTo({ left: dotIdx * w, behavior: "smooth" })
                }}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: "20px",
                  background: "rgba(197, 160, 89, 0.3)",
                }}
                aria-label={`Ir a noticia ${dotIdx + 1}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

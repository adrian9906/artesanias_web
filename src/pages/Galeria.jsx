import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const catalogo = [
  {
    id: "funkos",
    nombre: "Funkos Pop personalizados",
    precio: "30 USD",
    historia:
      "Cada Funko nace de una historia real: profesiones, bandas favoritas y personajes que marcaron momentos importantes. Modelamos rasgos, colores y detalles para que cada pieza sea un recuerdo vivo.",
    casosExito: [
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=900&q=80",
      "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e96?w=900&q=80",
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=900&q=80",
    ],
  },
  {
    id: "jarras",
    nombre: "Jarras artesanales",
    precio: "15 USD",
    historia:
      "Nuestras jarras se inspiran en mesas familiares y cafecitos de domingo. Cada pieza se termina a mano, con acabados orgÃ¡nicos y tonos cÃ¡lidos para que cada bebida tenga su propio ritual.",
    casosExito: [
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&q=80",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=900&q=80",
    ],
  },
  {
    id: "aretes",
    nombre: "Aretes artesanales",
    precio: "5 USD",
    historia:
      "Los aretes son nuestra colecciÃ³n mÃ¡s juguetona: pequeÃ±os acentos de color para usar todos los dÃ­as. Livianos, resistentes y hechos para combinar con estilos casuales o elegantes.",
    casosExito: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80",
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=900&q=80",
    ],
  },
]

function PolaroidStack({ fotos, titulo }) {
  return (
    <div className="relative md:h-[520px] h-auto w-full max-w-3xl mx-auto overflow-visible" data-photo-stage>
      {fotos.map((foto, index) => (
        <figure
          key={foto}
          data-photo-card
          className="md:absolute md:left-1/2 relative mx-auto w-[78%] sm:w-[60%] md:w-[42%] bg-cream p-3 pb-10 shadow-2xl md:mt-0 mt-6"
          style={{ zIndex: 10 - index }}
        >
          <img src={foto} alt={`${titulo} caso ${index + 1}`} className="h-44 w-full object-cover" />
          <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-forest-dark/75">
            Caso de éxito #{index + 1}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function Galeria() {
  const sectionRefs = useRef([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const sections = sectionRefs.current.filter(Boolean)
    if (!sections.length) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        const firstSection = sections[0]
        if (firstSection) {
          gsap.set(firstSection, { autoAlpha: 1, yPercent: 0 })
          const firstContent = firstSection.querySelector("[data-catalog-content]")
          const firstPhotos = firstSection.querySelector("[data-catalog-photos]")
          gsap.set([firstContent, firstPhotos], { autoAlpha: 1, yPercent: 0 })
        }

        sections.forEach((section, index) => {
          const content = section.querySelector("[data-catalog-content]")
          const photos = section.querySelector("[data-catalog-photos]")
          const cards = photos?.querySelectorAll("[data-photo-card]")
          const previous = sections[index - 1]
          if (!content || !photos || !cards?.length) return

          const cardArray = Array.from(cards)

          // Visible stack at the top of the card
          gsap.set(cardArray, {
            xPercent: -50,
            y: (i) => i * 34,
            rotate: (i) => (i - 1) * 7,
            scale: 1,
          })

          // Content fades in for sections after the first
          if (index > 0) {
            gsap.fromTo(
              [content, photos],
              { yPercent: 14, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  end: "top 46%",
                  scrub: 1,
                },
              }
            )
          }

          const startPos = index === 0 ? "top top" : "top 50%"
          const dropY = Math.min(Math.max(section.offsetHeight * 0.68, 280), 420)
          const spreadY = dropY + 200
          const spreadX = [-260, 0, 260]
          const carouselStep1 = [-520, -140, 240]
          const carouselStep2 = [-760, -380, 0]
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: startPos,
              end: "bottom 12%",
              scrub: 1,
            },
            defaults: { ease: "power3.out" },
          })

          // Phase 1: Stack breathes a bit to mark the start of the transition.
          tl.to(cardArray, {
            y: (i) => i * 40,
            rotate: (i) => (i - 1) * 5,
            duration: 0.16,
            stagger: 0.02,
          }, 0)
            // Phase 2: Stack drops below the section card.
            .to(cardArray, {
              y: dropY,
              rotate: 0,
              scale: 0.95,
              duration: 0.2,
              stagger: 0.03,
            }, 0.16)
            // Phase 3: Spread into a horizontal carousel below the card.
            .to(cardArray, {
              x: (i) => spreadX[i] ?? 0,
              y: spreadY,
              scale: 1,
              duration: 0.22,
            }, 0.36)
            // Phase 4: Carousel shifts with scroll.
            .to(cardArray, {
              x: (i) => carouselStep1[i] ?? 0,
              duration: 0.28,
            }, 0.58)
            .to(cardArray, {
              x: (i) => carouselStep2[i] ?? 0,
              duration: 0.28,
            }, 0.82)

          if (previous) {
            tl.to(previous, {
              autoAlpha: 0.4,
              yPercent: -5,
              duration: 0.4,
            }, 0.04)
          }
        })
      })
      return () => mm.revert()
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-forest-dark relative animate-blurred-fade-in">
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-cream mb-6">Catálogo</h1>
          <p className="text-cream/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Secciones con precio fijo, historia real de cada línea y casos de éxito presentados en polaroids apiladas.
          </p>
        </section>

        <section>
          {catalogo.map((item, idx) => (
            <article
              key={item.id}
              ref={(node) => {
                sectionRefs.current[idx] = node
              }}
              className="rounded-3xl p-8 md:p-10 mb-96 border border-gold-accent/30 bg-[linear-gradient(145deg,rgba(14,21,16,0.82),rgba(28,35,30,0.9))] overflow-visible"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div data-catalog-content className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-gold-accent uppercase tracking-[0.26em] text-xs mb-3">Sección destacada</p>
                  <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">{item.nombre}</h2>
                  <div className="inline-flex items-center rounded-full border border-gold-accent/40 px-4 py-2 mb-6">
                    <span className="text-gold-accent text-sm uppercase tracking-[0.2em]">Precio: {item.precio}</span>
                  </div>
                  <p className="text-cream/70 leading-relaxed mb-6">{item.historia}</p>
                  <p className="text-cream/50 text-sm">Fotos reales de clientes satisfechos en formato polaroid stack.</p>
                </div>

                <div data-catalog-photos className={idx % 2 === 1 ? "lg:order-1" : ""}>
                  <PolaroidStack fotos={item.casosExito} titulo={item.nombre} />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-24 text-center">
          <div
            className="glass-card rounded-3xl p-12 max-w-3xl mx-auto"
            style={{
              background: "linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)",
              border: "1px solid rgba(197, 160, 89, 0.3)",
            }}
          >
            <h2 className="font-display text-3xl text-cream mb-4">¿Quieres tu pieza personalizada?</h2>
            <p className="text-cream/60 mb-8 max-w-xl mx-auto">
              Cuéntanos tu idea y te ayudamos a convertirla en una pieza artesanal con identidad propia.
            </p>
            <a
              href="/encargos"
              className="inline-block bg-gold-accent text-forest-dark px-8 py-3 rounded-full font-semibold hover:bg-gold-light transition-colors duration-300"
            >
              Crear Tu Pieza
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}


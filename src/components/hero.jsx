import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowDown } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'

const gallerySlides = [
  {
    title: 'Trabajo Realizado: Jarras Organicas',
    subtitle: 'Serie de piezas para mesa ritual con texturas naturales.',
    background: 'radial-gradient(circle at 20% 20%, rgba(189,156,92,0.35), rgba(10,26,15,0.95) 60%)',
    accent: '#d5b06b',
    images: [
      { src: '/jarra.jpeg', alt: 'Jarra artesanal', className: 'left-[8%] top-[16%] h-44 w-36 md:h-60 md:w-48 rotate-[-8deg]' },
      { src: '/hero.png', alt: 'Detalle de pieza artesanal', className: 'left-[35%] top-[34%] h-40 w-32 md:h-52 md:w-40 rotate-[5deg]' },
      { src: '/fondo2.jpeg', alt: 'Ambiente del taller', className: 'right-[9%] top-[14%] h-48 w-38 md:h-64 md:w-52 rotate-[10deg]' },
    ],
  },
  {
    title: 'Trabajo Realizado: Joyería Botánica',
    subtitle: 'Composiciones ligeras inspiradas en hojas y flores preservadas.',
    background: 'radial-gradient(circle at 80% 30%, rgba(102,152,94,0.32), rgba(10,26,15,0.95) 58%)',
    accent: '#7cb879',
    images: [
      { src: '/hero.png', alt: 'Pieza botánica', className: 'left-[10%] top-[26%] h-48 w-36 md:h-64 md:w-48 rotate-[6deg]' },
      { src: '/fondo2.jpeg', alt: 'Proceso artesanal', className: 'left-[40%] top-[12%] h-40 w-34 md:h-52 md:w-44 rotate-[-10deg]' },
    ],
  },
  {
    title: 'Trabajo Realizado: Colección Personalizada',
    subtitle: 'Pedido especial con narrativa visual para evento privado.',
    background: 'radial-gradient(circle at 55% 80%, rgba(174,126,82,0.33), rgba(10,26,15,0.96) 62%)',
    accent: '#d18d60',
    images: [
      { src: '/jarra.jpeg', alt: 'Colección personalizada', className: 'left-[12%] top-[14%] h-40 w-32 md:h-52 md:w-40 rotate-[-12deg]' },
      { src: '/fondo2.jpeg', alt: 'Mesa con piezas', className: 'left-[34%] top-[38%] h-44 w-38 md:h-60 md:w-48 rotate-[4deg]' },
      { src: '/hero.png', alt: 'Acabado final de obra', className: 'right-[9%] top-[20%] h-48 w-36 md:h-64 md:w-48 rotate-[12deg]' },
    ],
  },
]

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHeroImageReady, setIsHeroImageReady] = useState(false)
  const intervalRef = useRef(null)
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const slideRefs = useRef([])
  const heroSectionRef = useRef(null)
  const titleRef = useRef(null)

  const activeSlide = useMemo(() => gallerySlides[activeIndex], [activeIndex])

  useEffect(() => {
    const floatTweens = slideRefs.current.flatMap((slide) => {
      if (!slide) return []
      const items = slide.querySelectorAll('.floating-item')
      return Array.from(items).map((item, i) =>
        gsap.to(item, {
          y: i % 2 === 0 ? '-=18' : '+=14',
          x: i % 2 === 0 ? '+=8' : '-=6',
          duration: 2.8 + i * 0.45,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }),
      )
    })

    return () => {
      floatTweens.forEach((tw) => tw.kill())
    }
  }, [])

  useEffect(() => {
    if (!isHeroImageReady) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        },
      )
      gsap.fromTo(
        '.hero-main-image',
        { autoAlpha: 0, scale: 1.08, filter: 'blur(10px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power3.out' },
      )

      gsap.fromTo(
        '.hero-text-reveal',
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.2,
          stagger: 0.12,
        },
      )
    }, heroSectionRef)

    return () => ctx.revert()
  }, [isHeroImageReady])

  useEffect(() => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return

      if (i === activeIndex) {
        gsap.to(slide, { autoAlpha: 1, scale: 1, duration: 0.65, ease: 'power3.out' })
        gsap.fromTo(
          slide.querySelectorAll('.floating-item'),
          { autoAlpha: 0, y: 30, scale: 0.86 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
          },
        )
      } else {
        gsap.to(slide, { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: 'power2.out' })
      }
    })

    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundImage: activeSlide.background,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    }
  }, [activeIndex, activeSlide.background])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gallerySlides.length)
    }, 4600)

    return () => clearInterval(intervalRef.current)
  }, [])

  const goToSlide = (index) => {
    clearInterval(intervalRef.current)
    setActiveIndex(index)
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gallerySlides.length)
    }, 4600)
  }

  const goNext = () => {
    goToSlide((activeIndex + 1) % gallerySlides.length)
  }

  const goPrevious = () => {
    goToSlide((activeIndex - 1 + gallerySlides.length) % gallerySlides.length)
  }

  return (
    <>
      <section ref={heroSectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0a1a0f]" />
          <img
            src="/fondo2.jpeg"
            alt=""
            onLoad={() => setIsHeroImageReady(true)}
            className="hero-main-image w-full h-full object-cover opacity-0"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gold-accent/4 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-gold-accent/3 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-24">
          <h1 className="hero-text-reveal font-display text-5xl md:text-7xl mb-6 text-cream leading-tight opacity-0">
            Cerámica fría con <span className="text-gold-light italic">alma artesana</span>
          </h1>
          <p className="hero-text-reveal text-cream/60 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed opacity-0">
            Piezas exclusivas modeladas a mano con acabado en porcelana fría. Disenos que capturan la esencia de la naturaleza en cada detalle.
          </p>
          <a className="hero-text-reveal inline-block border border-gold-accent/60 text-gold-light px-8 py-3 rounded-full hover:bg-gold-accent hover:text-forest-deep transition-all duration-300 font-medium opacity-0" href="#">
            Encargar pieza única
          </a>
        </div>
        <ArrowDown className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-cream animate-bounce" />
      </section>

      <section ref={sectionRef} className="py-20 md:py-24 bg-forest-dark relative">
        <div className="container aspect-square w-[40%]  mx-auto px-6 relative">
          <div ref={titleRef} className="mb-10 text-center">
            <p className="text-gold-accent/70 uppercase tracking-[0.24em] text-xs mb-3">Galería</p>
            <h2 className="font-display text-4xl md:text-5xl text-cream">Trabajos Realizados</h2>
            <div className="w-16 h-px bg-gold-accent/60 mx-auto mt-0.5" />
          </div>

          <div ref={bgRef} className="relative rounded-[1.25rem] overflow-hidden border border-gold-accent/30 min-h-[520px] md:min-h-[560px] transition-colors duration-500" style={{ backgroundImage: activeSlide.background }}>
            <div className="absolute inset-0">
              {gallerySlides.map((slide, slideIndex) => (
                <div
                  key={slide.title}
                  ref={(el) => {
                    slideRefs.current[slideIndex] = el
                  }}
                  className="absolute inset-0 opacity-0 scale-105"
                >
                  {slide.images.map((image) => (
                    <div key={`${slide.title}-${image.alt}`} className={`floating-item absolute rounded-2xl overflow-hidden border border-white/30 shadow-[0_18px_40px_rgba(0,0,0,0.34)] ${image.className}`}>
                      <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pt-20">
              {gallerySlides.map((slide, i) => (
                <button
                  key={slide.title}
                  aria-label={`Ir al slide ${i + 1}`}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? '2.6rem' : '0.8rem',
                    height: '0.8rem',
                    backgroundColor: i === activeIndex ? slide.accent : 'rgba(255,255,255,0.35)',
                    boxShadow: i === activeIndex ? `0 0 16px ${slide.accent}` : 'none',
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/35" />
            <div className="absolute z-20 left-6 right-6 bottom-8 md:left-10 md:right-auto md:max-w-md mt-6">
              <h3 className="font-display text-2xl md:text-3xl text-cream mb-3">{activeSlide.title}</h3>
              <p className="text-cream/75 text-sm md:text-base">{activeSlide.subtitle}</p>
            </div>

          </div>


          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-0 top-1/3 shadow-2xl rounded-2xl  -translate-y-1/2 -translate-x-12 p-3  transition-all duration-300 hover:scale-110 z-40"
            style={{
              color: activeSlide.accent,
              borderColor: activeSlide.accent,
              backgroundColor: 'rgba(10,26,15,0.5)',
            }}
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-12 p-3 rounded-full transition-all duration-300 hover:scale-110 z-40"
            style={{
              color: activeSlide.accent,
              borderColor: activeSlide.accent,
              backgroundColor: 'rgba(10,26,15,0.5)',
            }}
          >
            <ArrowRight />
          </button>
        </div>
      </section>
    </>
  )
}

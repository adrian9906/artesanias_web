import { useEffect, useMemo, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Layout from './components/Layout'
import Hero from './components/hero'
import VideoSection from './components/VideoSection'
import InformacionEncargo from './pages/InformacionEncargo'
import SobreNosotros from './pages/SobreNosotros'
import Encargos from './pages/Encargos'
import Noticias from './pages/Noticias'
import Blog from './pages/Blog'
import Galeria from './pages/Galeria'

import { Sparkle } from 'lucide-react'
import { Marquee } from './components/ui/marquee'
import { ChevronUpCircle } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { homeCategories } from './data/productCatalog'
import { ArrowRight } from 'lucide-react'
import { useI18n } from './i18n'

const categories = homeCategories

function Categories() {
  const sectionRef = useRef(null)
  const { t } = useI18n()

  const categoriesData = useMemo(() => t('homeCategoriesData'), [t])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.categories-title',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.categories-title',
            start: 'top 85%',
          },
        },
      )

      const rows = gsap.utils.toArray('.category-story-row')

      rows.forEach((row) => {
        const story = row.querySelector('.category-story')
        const card = row.querySelector('.category-card-zoom')
        const image = row.querySelector('.category-image')

        gsap.fromTo(
          story,
          { y: 90 },
          {
            y: -90,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )

        gsap.fromTo(
          card,
          { y: -70, scale: 0.85, autoAlpha: 0.7 },
          {
            y: 70,
            scale: 1.08,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: true,
            },
          },
        )

        gsap.fromTo(
          image,
          { scale: 1 },
          {
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-forest-deep overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="categories-title text-center mb-12 md:mb-20">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">{t('home.categories')}</h2>
          <div className="w-16 h-px bg-gold-accent/60 mx-auto" />
        </div>

        <div className="space-y-14 md:space-y-28">
          {categories.map((cat, i) => {
            const catText = categoriesData[i] ?? {}
            return (
            <div
              key={cat.title}
              className="category-story-row grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center"
            >
              <div className="category-story will-change-transform">
                <p className="text-gold-accent/70 uppercase tracking-[0.25em] text-xs mb-4">
                  {t('home.category')} {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-cream mb-5">{catText.title}</h3>
                <p className="text-cream/60 text-base leading-relaxed mb-6">{catText.story}</p>
                <p className="text-cream/50 text-sm leading-relaxed">{catText.desc}</p>
              </div>

              <div className="category-card-zoom category-card p-6 md:p-10 rounded-2xl border border-gold-accent/20 bg-forest-mid/70 backdrop-blur-sm will-change-transform">
                <div className="relative h-72 md:h-80 rounded-xl overflow-hidden border border-gold-accent/25">
                  <img
                    alt={cat.title}
                    className="category-image w-full h-full object-cover will-change-transform"
                    src={cat.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                </div>
                <div className="pt-6">
                  <h4 className="font-display text-2xl text-cream mb-3">{catText.title}</h4>
                  <a
                    className="inline-block px-6 py-2 bg-gold-accent text-forest-dark rounded-full text-xs font-bold hover:bg-gold-light transition-all duration-300"
                    href="#"
                  >
                    {catText.cta}
                  </a>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  gsap.registerPlugin(ScrollTrigger)
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const buttonRef = useRef(null)
  const contentRef = useRef(null)
  useEffect(() => {

    if (!cardRef.current || !buttonRef.current) return

    // 1. ESTADO INICIAL - Tarjeta GRANDE
    gsap.set(cardRef.current, {
      scale: 1.3,              // Tarjeta un 30% mÃ¡s grande
      transformOrigin: 'center center',
      borderRadius: '2.5rem',
    })

    // BotÃ³n invisible al inicio
    gsap.set(buttonRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.8,
    })

    // Contenido ligeramente opaco
    gsap.set(contentRef.current, {
      opacity: 0.7,
    })

    // 2. CREAR SCROLLTRIGGER PARA LA TARJETA
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',        // Empieza cuando la secciÃ³n estÃ¡ al 80%
      end: 'top 20%',          // Termina cuando estÃ¡ al 20%
      scrub: 1,                // Suavizado
      animation: gsap.to(cardRef.current, {
        scale: 1,               // TamaÃ±o NORMAL
        borderRadius: '1.5rem',
        duration: 1,
        ease: 'power2.out',
      }),
    })

    // 3. SCROLLTRIGGER PARA EL BOTÃ“N
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      end: 'top 30%',
      scrub: 0.8,
      animation: gsap.to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(0.6)',
      }),
    })

    // 4. SCROLLTRIGGER PARA EL CONTENIDO
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      end: 'top 40%',
      scrub: 0.5,
      animation: gsap.to(contentRef.current, {
        opacity: 1,
        duration: 0.6,
      }),
    })

    // Limpieza
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])
  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 md:px-6 mb-16 md:mb-[165px] mt-12 md:mt-20">
      <div
        ref={cardRef}
        className="bg-forest-mid rounded-3xl p-8 md:p-32 text-center relative overflow-hidden mt-6 md:mt-8 transition-all"
      >
        {/* CÃ­rculos decorativos */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-accent opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-accent opacity-10 rounded-full"></div>

        <div ref={contentRef} className="relative z-10 flex flex-col items-center">
          <div className="size-16 bg-gold-accent/30 rounded-full flex items-center justify-center mb-8">
            <Sparkle className="text-gold-accent" size={32} />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-heading text-cream font-semibold max-w-3xl mb-6 md:mb-8">
            {t('home.ctaTitle')}
          </h2>

          <p className="font-body text-sm md:text-base text-cream font-semibold max-w-xl mb-8 md:mb-12">
            {t('home.ctaText')}
          </p>

          <button
            ref={buttonRef}
            className="bg-gold-accent text-cloud-whisper px-[26.4px] hover:bg-gold-light hover:scale-105 py-[14.4px] rounded-full text-button font-button flex items-center gap-2 transition-all duration-300 opacity-0"
          >
            <span className="truncate text-black font-extrabold">{t('home.ctaButton')}</span>
            <ChevronRight className="text-black" size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

const testimonials = []

function Testimonials() {
  const titleRef = useRef(null)
  const sectionRef = useRef(null)
  const { t } = useI18n()

  const testimonialsData = useMemo(() => t('testimonialsData'), [t])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

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
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-forest-dark relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-full mx-auto px-4 md:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-accent/70">{t('home.testimonials')}</span>
          <h2 className="font-display text-3xl md:text-4xl text-cream mt-4 mb-4">{t('home.testimonialsTitle')}</h2>
          <div className="w-16 h-px bg-gold-accent/50 mx-auto" />
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {testimonialsData.map((item, i) => (

              <div
                key={i}
                className="p-8 rounded-2xl border border-gold-accent/10 bg-forest-mid/50"
                style={{ background: 'rgba(15, 36, 22, 0.5)' }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent/30 to-gold-accent/10 border border-gold-accent/20" />
                  <div>
                    <p className="text-cream font-semibold">{item.name}</p>
                    <p className="text-cream/40 text-xs uppercase tracking-widest">{item.location}</p>
                  </div>
                </div>
                <p className="text-cream/60 text-sm leading-relaxed font-light">
                  "{item.text}"
                </p>
              </div>

            ))}
          </Marquee>

        </div>
        <div className="from-forest-dark pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
        <div className="from-forest-dark pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>

        <div className="text-center mt-12">
          <a href="/galeria" className="text-gold-accent hover:text-gold-light transition-colors text-sm uppercase tracking-[0.2em]">
            {t('home.moreTestimonials')} <ArrowRight className="inline-block" size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Testimonials />
      <VideoSection />
      <CTABanner />
    </>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/informacion-de-encargo" element={<InformacionEncargo />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/encargos" element={<Encargos />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/galeria" element={<Galeria />} />
      </Routes>
    </Layout>
  )
}

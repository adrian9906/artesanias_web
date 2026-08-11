import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './components/hero'

import { Sparkle } from 'lucide-react'
import { Marquee } from './components/ui/marquee'
import { ChevronRight } from 'lucide-react'
import { homeCategories } from './data/productCatalog'
import { ArrowRight } from 'lucide-react'
import { useI18n } from './i18n'
import { api } from '@/lib/cms/client'

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

      const isCompactViewport = window.matchMedia('(max-width: 767px)').matches

      rows.forEach((row) => {
        const story = row.querySelector('.category-story')
        const card = row.querySelector('.category-card-zoom')
        const image = row.querySelector('.category-image')

        gsap.fromTo(
          story,
          { y: isCompactViewport ? 36 : 90 },
          {
            y: isCompactViewport ? -36 : -90,
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
          { y: isCompactViewport ? -24 : -70, scale: isCompactViewport ? 0.97 : 0.85, autoAlpha: 0.82 },
          {
            y: isCompactViewport ? 24 : 70,
            scale: isCompactViewport ? 1.01 : 1.08,
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
          { scale: 1.02 },
          {
            scale: isCompactViewport ? 1.06 : 1.15,
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
    <section ref={sectionRef} className="relative overflow-hidden bg-forest-deep py-16 md:py-24">
      <div className="absolute inset-x-0 top-0 h-[46rem] overflow-hidden md:h-[58rem]">
        <Image
          src="/images/artisan-worktable-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[18%_center] opacity-80 md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,41,24,0.34)_0%,rgba(27,41,24,0.62)_55%,#1b2918_100%)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[42rem] overflow-hidden md:h-[54rem]">
        <Image
          src="/images/artisan-worktable-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[82%_center] opacity-70 md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(27,41,24,0.4)_0%,rgba(27,41,24,0.68)_55%,#1b2918_100%)]" />
      </div>
      <div className="absolute inset-0 bg-forest-deep/20" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="container relative z-10 mx-auto px-5 sm:px-6 md:px-6">
        <div className="categories-title text-center mb-12 md:mb-20">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">{t('home.categories')}</h2>
          <div className="w-16 h-px bg-gold-accent/60 mx-auto" />
        </div>

        <div className="space-y-16 md:space-y-28">
          {categories.map((cat, i) => {
            const catText = categoriesData[i] ?? {}
            return (
            <div
              key={cat.title}
              className="category-story-row grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20 items-center"
            >
              <div className="category-story px-1 sm:px-2 md:px-0">
                <p className="text-gold-accent/70 uppercase tracking-[0.25em] text-xs mb-4">
                  {t('home.category')} {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-cream mb-5">{catText.title}</h3>
                <p className="text-cream/60 text-base leading-8 mb-6">{catText.story}</p>
                <p className="text-cream/50 text-sm leading-7">{catText.desc}</p>
              </div>

              <div className="category-card-zoom category-card mx-1 p-4 sm:p-5 md:p-10 rounded-[1.75rem] border border-gold-accent/20 bg-forest-mid/70 backdrop-blur-sm md:mx-0">
                <div className="relative h-64 sm:h-72 md:h-80 rounded-[1.1rem] overflow-hidden border border-gold-accent/25">
                  <Image
                    alt={cat.title}
                    className="category-image object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={cat.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                </div>
                <div className="pt-5 sm:pt-6">
                  <h4 className="font-display text-[1.75rem] text-cream mb-3">{catText.title}</h4>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full bg-gold-accent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-dark transition-colors duration-300 hover:bg-gold-light"
                    href="/catalogo"
                  >
                    {catText.cta}
                  </Link>
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
  const { lang } = useI18n()
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const buttonRef = useRef(null)
  const contentRef = useRef(null)
  useEffect(() => {

    if (!cardRef.current || !buttonRef.current) return

    gsap.set(cardRef.current, {
      scale: 1.3,
      transformOrigin: 'center center',
      borderRadius: '2.5rem',
    })

    gsap.set(buttonRef.current, {
      opacity: 0,
      y: 30,
      scale: 0.8,
    })

    gsap.set(contentRef.current, {
      opacity: 0.7,
    })

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      animation: gsap.to(cardRef.current, {
        scale: 1,
        borderRadius: '1.5rem',
        duration: 1,
        ease: 'power2.out',
      }),
    })

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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const ctaTitle = lang === 'en' ? 'Explore our catalog' : 'Visualiza nuestro catálogo'
  const ctaText = lang === 'en'
    ? 'Browse the collections, compare pieces, and choose the design you want to reserve or personalize.'
    : 'Recorre las colecciones, compara piezas y descubre con calma la que quieres reservar o personalizar.'
  const ctaButton = lang === 'en' ? 'Go to catalog' : 'Ir al catálogo'
  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-4 md:px-6 mb-16 md:mb-[165px] mt-12 md:mt-20">
      <div
        ref={cardRef}
        className="bg-forest-mid rounded-3xl p-8 md:p-32 text-center relative overflow-hidden mt-6 md:mt-8 transition-[background-color,transform,box-shadow]"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-accent opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-accent opacity-10 rounded-full"></div>

        <div ref={contentRef} className="relative z-10 flex flex-col items-center">
          <div className="size-16 bg-gold-accent/30 rounded-full flex items-center justify-center mb-8">
            <Sparkle className="text-gold-accent" size={32} />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-heading text-cream font-semibold max-w-3xl mb-6 md:mb-8">
            {ctaTitle}
          </h2>

          <p className="font-body text-sm md:text-base text-cream font-semibold max-w-xl mb-8 md:mb-12">
            {ctaText}
          </p>

          <Link
            ref={buttonRef}
            href="/catalogo"
            className="bg-gold-accent text-forest-deep px-[26.4px] hover:bg-gold-light hover:scale-105 py-[14.4px] rounded-full text-button font-button flex items-center gap-2 transition-[background-color,transform] duration-300 opacity-0"
          >
            <span className="truncate text-black font-extrabold">{ctaButton}</span>
            <ChevronRight className="text-black" size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const titleRef = useRef(null)
  const sectionRef = useRef(null)
  const { t, lang } = useI18n()
  const fallbackTestimonials = useMemo(() => t('testimonialsData'), [t])
  const [testimonialsData, setTestimonialsData] = useState([])

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

  useEffect(() => {
    let mounted = true

    api('/api/feedback')
      .then((data) => {
        if (!mounted) return
        const mapped = (data.testimonials || []).map((item) => ({
          name: item.name,
          location: lang === 'en'
            ? item.origin === 'public'
              ? 'Shared by the community'
              : 'Featured testimonial'
            : item.origin === 'public'
              ? 'Compartido por la comunidad'
              : 'Testimonio destacado',
          text: item.text,
        }))

        if (mapped.length > 0) {
          setTestimonialsData(mapped)
        } else {
          setTestimonialsData([])
        }
      })
      .catch(() => {
        if (mounted) setTestimonialsData([])
      })

    return () => {
      mounted = false
    }
  }, [fallbackTestimonials, lang])

  const visibleTestimonials = testimonialsData.length > 0 ? testimonialsData : fallbackTestimonials

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-forest-dark py-16 md:py-24">
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold-accent/[0.08] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary-fixed/[0.06] rounded-full blur-3xl" />

      <div className="relative z-10 max-w-full mx-auto px-5 sm:px-6 md:px-8">
        <div ref={titleRef} className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-accent/70">{t('home.testimonials')}</span>
          <h2 className="font-display text-3xl md:text-4xl text-cream mt-4 mb-4">{t('home.testimonialsTitle')}</h2>
          <div className="w-16 h-px bg-gold-accent/50 mx-auto" />
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s] [--gap:1rem] md:[--gap:1.5rem]">
            {visibleTestimonials.map((item) => (

              <div
                key={`${item.name}-${item.location}`}
                className="w-[74vw] max-w-[16.5rem] rounded-2xl border border-gold-accent/20 bg-forest-mid/70 p-4 shadow-[0_18px_48px_rgba(15,29,12,0.22)] backdrop-blur-md sm:w-[19rem] sm:max-w-none sm:p-5 md:w-[23rem] md:p-8"
              >
                <div className="mb-4 flex items-center gap-3 md:mb-6 md:gap-4">
                  <div className="h-10 w-10 rounded-full border border-gold-accent/20 bg-gradient-to-br from-gold-accent/30 to-gold-accent/10 md:h-12 md:w-12" />
                  <div>
                    <p className="text-[0.92rem] font-semibold text-cream md:text-base">{item.name}</p>
                    <p className="text-cream/40 text-xs uppercase tracking-widest">{item.location}</p>
                  </div>
                </div>
                <p className="text-[0.88rem] font-light leading-6 text-cream/60 md:text-sm md:leading-7">
                  "{item.text}"
                </p>
              </div>

            ))}
          </Marquee>

        </div>
        <div className="from-forest-dark pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
        <div className="from-forest-dark pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>

        <div className="text-center mt-12">
          <Link href="/opiniones" className="text-gold-accent hover:text-gold-light transition-colors text-sm uppercase tracking-[0.2em]">
            {t('home.moreTestimonials')} <ArrowRight className="inline-block" size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Testimonials />
      <CTABanner />
    </>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero from './components/hero'

import { Marquee } from './components/ui/marquee'
import { ArrowRight, ChevronRight, MessageCircle } from 'lucide-react'
import { homeCategories } from './data/productCatalog'
import { useI18n } from './i18n'
import { api } from '@/lib/cms/client'

function Categories() {
  const sectionRef = useRef(null)
  const { t } = useI18n()
  const fallbackCategories = useMemo(() => {
    const translatedCategories = t('homeCategoriesData')
    return homeCategories.map((category, index) => ({
      id: category.title,
      title: translatedCategories[index]?.title || category.title,
      story: translatedCategories[index]?.story || '',
      description: translatedCategories[index]?.desc || '',
      cta: translatedCategories[index]?.cta || 'Ver colección',
      image: category.img,
    }))
  }, [t])
  const [managedCategories, setManagedCategories] = useState(null)
  const categories = managedCategories ?? fallbackCategories

  useEffect(() => {
    let mounted = true

    api('/api/home/categories')
      .then((data) => {
        if (mounted) setManagedCategories(data.categories || [])
      })
      .catch(() => {
        if (mounted) setManagedCategories(null)
      })

    return () => {
      mounted = false
    }
  }, [])

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
  }, [categories.length])

  if (categories.length === 0) return null

  return (
    <section ref={sectionRef} className="home-scroll-reveal relative overflow-hidden bg-forest-deep py-16 md:py-24">
      <div className="absolute inset-x-0 top-0 h-[46rem] overflow-hidden md:h-[58rem]">
        <Image
          src="https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562870/thay-art/images/artisan-worktable-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[18%_center] opacity-80 md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,41,24,0.34)_0%,rgba(27,41,24,0.62)_55%,#1b2918_100%)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[42rem] overflow-hidden md:h-[54rem]">
        <Image
          src="https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562870/thay-art/images/artisan-worktable-bg.png"
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
            const fallbackImage = homeCategories[i % homeCategories.length]?.img || 'https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562870/thay-art/images/artisan-worktable-bg.png'
            return (
            <div
              key={cat.id}
              className="category-story-row grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-20 items-center"
            >
              <div className="category-story px-1 sm:px-2 md:px-0">
                <p className="text-gold-accent/70 uppercase tracking-[0.25em] text-xs mb-4">
                  {t('home.category')} {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-cream mb-5">{cat.title}</h3>
                <p className="text-cream/60 text-base leading-8 mb-6">{cat.story}</p>
                <p className="text-cream/50 text-sm leading-7">{cat.description}</p>
              </div>

              <div className="category-card-zoom category-card mx-1 p-4 sm:p-5 md:p-10 rounded-[1.75rem] border border-gold-accent/20 bg-forest-mid/70 backdrop-blur-sm md:mx-0">
                <div className="relative h-64 sm:h-72 md:h-80 rounded-[1.1rem] overflow-hidden border border-gold-accent/25">
                  <Image
                    alt={cat.title}
                    className="category-image object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={cat.image || fallbackImage}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                </div>
                <div className="pt-5 sm:pt-6">
                  <h4 className="font-display text-[1.75rem] text-cream mb-3">{cat.title}</h4>
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full bg-gold-accent px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-forest-dark transition-colors duration-300 hover:bg-gold-light"
                    href="/catalogo"
                  >
                    {cat.cta || 'Ver colección'}
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
    if (!sectionRef.current || !cardRef.current || !buttonRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add('(min-width: 768px)', () => {
        gsap.set(cardRef.current, {
          scale: 1.22,
          y: 36,
          transformOrigin: 'center center',
          borderRadius: '0.75rem',
        })
        gsap.set(contentRef.current, { autoAlpha: 0.62, y: 28 })
        gsap.set(buttonRef.current, { autoAlpha: 0, y: 24, scale: 0.84 })

        gsap.to(cardRef.current, {
          scale: 0.86,
          y: 0,
          borderRadius: '2rem',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            end: 'top 28%',
            scrub: 1,
          },
        })
        gsap.to(contentRef.current, {
          autoAlpha: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 67%',
            end: 'top 35%',
            scrub: 0.65,
          },
        })
        gsap.to(buttonRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 58%',
            end: 'top 30%',
            scrub: 0.6,
          },
        })
      })

      media.add('(max-width: 767px)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        })

        timeline
          .fromTo(
            cardRef.current,
            { autoAlpha: 0, y: 42, scale: 1.08 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          )
          .fromTo(
            contentRef.current,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' },
            '-=0.5',
          )
          .fromTo(
            buttonRef.current,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.3',
          )
      })

      return () => media.revert()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const ctaTitle = lang === 'en' ? 'Explore our catalog' : 'Visualiza nuestro catálogo'
  const ctaEyebrow = lang === 'en' ? 'Thay Art collections' : 'Colecciones Thay Art'
  const ctaText = lang === 'en'
    ? 'Browse the collections, compare pieces, and choose the design you want to reserve or personalize.'
    : 'Recorre las colecciones, compara piezas y descubre con calma la que quieres reservar o personalizar.'
  const ctaButton = lang === 'en' ? 'Go to catalog' : 'Ir al catálogo'
  return (
    <section ref={sectionRef} className="home-scroll-reveal relative mx-auto w-full px-4 py-14 font-branding sm:px-6 md:px-[7vw] md:py-28">
      <div
        ref={cardRef}
        className="group relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-cream/25 bg-forest-mid shadow-[0_28px_90px_rgba(14,29,12,0.34)] md:aspect-[2.08/1] md:min-h-0"
      >
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-3">
          <div className="relative overflow-hidden bg-[#f5b1a5]">
            <div className="absolute -left-[18%] top-[26%] h-[48%] w-[82%] -rotate-12 rounded-[48%_52%_44%_56%] border-[5px] border-[#fff1d2]/80 bg-[#d9c195]/65 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105" />
            <div className="absolute -bottom-[24%] right-[-28%] size-[70%] rounded-full border-[5px] border-[#fff1d2]/70 bg-[#d9c195]/55" />
          </div>
          <div className="relative overflow-hidden bg-[#cfe2aa]">
            <div className="absolute left-[8%] top-[24%] h-[52%] w-[78%] rotate-8 rounded-[54%_46%_58%_42%] border-[5px] border-[#eff7c9]/90 bg-[#ddb98d]/65 transition-transform duration-700 group-hover:rotate-2 group-hover:scale-105" />
            <div className="absolute -bottom-[28%] -left-[24%] size-[72%] rounded-full border-[5px] border-[#eff7c9]/80 bg-[#e9c8a2]/55" />
          </div>
          <div className="relative overflow-hidden bg-[#4d6b3d]">
            <div className="absolute left-[4%] top-[25%] h-[51%] w-[78%] -rotate-6 rounded-[46%_54%_52%_48%] border-[5px] border-[#cfe2aa]/80 bg-[#b49a78]/90 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105" />
            <div className="absolute -bottom-[26%] right-[-22%] size-[72%] rounded-full border-[5px] border-[#cfe2aa]/75 bg-[#b49a78]/75" />
          </div>
        </div>

        <div aria-hidden="true" className="absolute inset-x-0 top-0 flex justify-center pt-7 text-center sm:pt-9 md:pt-10">
          <div className="leading-[0.75] text-forest-deep/80 drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]">
            <span className="block text-xl tracking-[0.08em] sm:text-2xl md:text-3xl">Thay</span>
            <span className="block text-6xl sm:text-7xl md:text-8xl">Art</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_24%,rgba(27,41,24,0.18)_48%,rgba(27,41,24,0.96)_100%)]" />

        <div ref={contentRef} className="absolute inset-x-0 bottom-0 z-10 px-6 pb-7 pt-24 text-left sm:px-9 sm:pb-9 md:flex md:items-end md:justify-between md:gap-10 md:px-12 md:pb-11 lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold-light/80">{ctaEyebrow}</p>
            <h2 className="text-4xl leading-[0.95] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
              {ctaTitle}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/75 sm:text-base md:mt-5 md:leading-7">
              {ctaText}
            </p>
          </div>

          <Link
            ref={buttonRef}
            href="/catalogo"
            className="mt-6 inline-flex shrink-0 items-center gap-3 rounded-full bg-gold-accent px-6 py-3.5 text-base text-forest-deep shadow-[0_12px_34px_rgba(249,172,162,0.28)] transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-gold-light md:mt-0 md:px-7 md:py-4"
          >
            <span>{ctaButton}</span>
            <ChevronRight aria-hidden="true" size={20} />
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
  const [testimonialsData, setTestimonialsData] = useState(null)

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
          location: item.location || (lang === 'en'
            ? item.origin === 'public'
              ? 'Shared by the community'
              : 'Featured testimonial'
            : item.origin === 'public'
              ? 'Compartido por la comunidad'
              : 'Testimonio destacado'),
          photo: item.photo || '',
          text: item.text,
        }))
        setTestimonialsData(mapped)
      })
      .catch(() => {
        if (mounted) setTestimonialsData(null)
      })

    return () => {
      mounted = false
    }
  }, [fallbackTestimonials, lang])

  const visibleTestimonials = testimonialsData ?? fallbackTestimonials

  if (visibleTestimonials.length === 0) return null

  return (
    <section ref={sectionRef} className="home-scroll-reveal relative overflow-hidden bg-forest-dark py-16 md:py-24">
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
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-gold-accent/20 bg-gradient-to-br from-gold-accent/30 to-gold-accent/10 md:size-12">
                    {item.photo && (
                      <Image src={item.photo} alt="" fill sizes="48px" className="object-cover" />
                    )}
                  </div>
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

function ThankYouSection() {
  const { lang } = useI18n()
  const isEnglish = lang === 'en'

  return (
    <section className="home-scroll-reveal bg-forest-deep px-4 py-14 font-branding sm:px-6 md:py-24">
      <div className="relative mx-auto min-h-[30rem] max-w-7xl overflow-hidden rounded-[2rem] border border-[#eff7c9]/70 bg-[#cfe2aa] px-6 py-14 text-center text-[#34512d] shadow-[0_28px_80px_rgba(10,25,8,0.3)] sm:px-10 md:flex md:min-h-[34rem] md:items-center md:px-20 md:py-20">
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-2 bg-[#34512d]" />
        <div aria-hidden="true" className="absolute -right-20 top-8 size-52 rotate-12 rounded-[52%_48%_58%_42%] border-[5px] border-[#ffe1bf]/90 bg-[#f5b1a5]/55 md:size-72" />
        <div aria-hidden="true" className="absolute -bottom-28 left-[42%] size-64 -rotate-12 rounded-[46%_54%_42%_58%] border-[5px] border-[#f5b1a5]/75 bg-[#e7c89f]/45 md:size-80" />
        <div aria-hidden="true" className="absolute -left-24 -top-24 size-52 rounded-full border-[4px] border-[#eff7c9] bg-[#b7d28f]/50 md:size-72" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#4d6b3d]/75">
            {isEnglish ? 'From our studio to your home' : 'De nuestro taller a tu hogar'}
          </p>
          <h2 className="text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.82] tracking-[-0.025em] text-[#34512d]">
            {isEnglish ? 'Thank You' : 'Muchas Gracias'}
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-base leading-7 text-[#34512d]/90 sm:text-lg sm:leading-8 md:mt-10 md:text-xl md:leading-9">
            {isEnglish ? (
              <>
                When someone buys a handmade product, they take home a piece of its creator&apos;s heart. Thay
                Artesanías, as a small business, thanks you for your choice and trust. Your support is deeply
                meaningful to us, and we hope you <span className="border-b-2 border-[#f08f82]">love and enjoy</span> your order as much as we enjoyed creating it for you.
              </>
            ) : (
              <>
                Cuando alguien compra un producto artesanal se lleva consigo un fragmento del corazón de quien lo
                creó. Thay Artesanías, como pequeño emprendimiento, agradece tu elección y confianza. Tu apoyo es
                muy importante y especial para nosotros; esperamos que te <span className="border-b-2 border-[#f08f82]">guste y disfrutes</span> tu pedido tanto como nosotros disfrutamos fabricarlo para ti.
              </>
            )}
          </p>

          <p className="mt-5 text-xl text-[#34512d] md:text-2xl">
            {isEnglish ? 'It has been a pleasure creating for you.' : 'Ha sido un placer crear para ti.'}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm font-semibold text-[#34512d] md:mt-12 md:text-base">
            <span className="inline-flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full border border-[#34512d] text-xs">f</span>
              Thay Artesanías
            </span>
            <a
              href="https://www.instagram.com/thay_artesanias?igsh=MTFkczZpM3J1cjZtdQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-[#f06f70]"
            >
              <svg
                aria-hidden="true"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect height="20" rx="5" width="20" x="2" y="2" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              @thay_artesanias
            </a>
            <a
              href="https://wa.me/5354024066"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-[#f06f70]"
            >
              <MessageCircle aria-hidden="true" size={20} />
              +53 5 4024066
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero
        beforeGallery={(
          <>
            <CTABanner />
            <Categories />
          </>
        )}
      />
      <Testimonials />
      <ThankYouSection />
    </>
  )
}

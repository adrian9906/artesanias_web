import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { productImages } from '../data/productCatalog'
import { useI18n } from '../i18n'
import { HandsWritting } from './handsWritting'

export default function Hero() {
  const { t } = useI18n()
  const renderAnimatedWords = (text, className = '') =>
    String(text || '')
      .split(/\s+/)
      .filter(Boolean)
      .map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className={`inline-block whitespace-nowrap ${wordIndex > 0 ? 'ml-[0.25em] sm:ml-[0.3em]' : ''} ${className}`.trim()}
        >
          {Array.from(word).map((ch, charIndex) => (
            <span
              key={`${word}-${wordIndex}-${charIndex}`}
              className="l inline-block"
              style={{ opacity: 0 }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))

  const gallerySlides = useMemo(() => [
    {
      title: t('hero.slides.jarsTitle'),
      subtitle: t('hero.slides.jarsSubtitle'),
      background: 'radial-gradient(circle at 20% 20%, rgba(249,172,162,0.38), rgba(27,41,24,0.96) 60%)',
      accent: '#F9ACA2',
      images: [
        { src: productImages.jarras[0], alt: 'Jarra artesanal 1', className: 'left-[8%] top-[16%] h-44 w-36 md:h-60 md:w-48 rotate-[-8deg]' },
        { src: productImages.jarras[1], alt: 'Jarra artesanal 2', className: 'left-[35%] top-[34%] h-40 w-32 md:h-52 md:w-40 rotate-[5deg]' },
        { src: productImages.jarras[2], alt: 'Jarra artesanal 3', className: 'right-[9%] top-[14%] h-48 w-38 md:h-64 md:w-52 rotate-[10deg]' },
      ],
    },
    {
      title: t('hero.slides.funkosTitle'),
      subtitle: t('hero.slides.funkosSubtitle'),
      background: 'radial-gradient(circle at 80% 30%, rgba(157,208,122,0.34), rgba(27,41,24,0.96) 58%)',
      accent: '#9DD07A',
      images: [
        { src: productImages.funkos[0], alt: 'Funko personalizado 1', className: 'left-[10%] top-[26%] h-48 w-36 md:h-64 md:w-48 rotate-[6deg]' },
        { src: productImages.funkos[1], alt: 'Funko personalizado 2', className: 'left-[40%] top-[12%] h-40 w-34 md:h-52 md:w-44 rotate-[-10deg]' },
        { src: productImages.funkos[2], alt: 'Funko personalizado 3', className: 'right-[8%] top-[20%] h-44 w-34 md:h-58 md:w-46 rotate-[8deg]' },
      ],
    },
    {
      title: t('hero.slides.earringsTitle'),
      subtitle: t('hero.slides.earringsSubtitle'),
      background: 'radial-gradient(circle at 55% 80%, rgba(244,111,128,0.32), rgba(27,41,24,0.97) 62%)',
      accent: '#F46F80',
      images: [
        { src: productImages.aretes[0], alt: 'Aretes artesanales 1', className: 'left-[12%] top-[14%] h-40 w-32 md:h-52 md:w-40 rotate-[-12deg]' },
        { src: productImages.aretes[1], alt: 'Aretes artesanales 2', className: 'left-[34%] top-[38%] h-44 w-38 md:h-60 md:w-48 rotate-[4deg]' },
        { src: productImages.aretes[2], alt: 'Aretes artesanales 3', className: 'right-[9%] top-[20%] h-48 w-36 md:h-64 md:w-48 rotate-[12deg]' },
      ],
    },
    {
      title: t('hero.slides.mixedFunkosTitle'),
      subtitle: t('hero.slides.mixedFunkosSubtitle'),
      background: 'radial-gradient(circle at 25% 78%, rgba(200,228,157,0.32), rgba(27,41,24,0.96) 60%)',
      accent: '#C8E49D',
      images: [
        { src: productImages.funkos[1], alt: 'Funko y estilo artesanal', className: 'left-[8%] top-[18%] h-42 w-34 md:h-56 md:w-44 rotate-[-8deg]' },
        { src: productImages.jarras[0], alt: 'Jarra en colección mixta', className: 'left-[36%] top-[34%] h-40 w-34 md:h-52 md:w-42 rotate-[6deg]' },
        { src: productImages.funkos[2], alt: 'Funko edicion especial', className: 'right-[8%] top-[16%] h-46 w-36 md:h-62 md:w-48 rotate-[12deg]' },
      ],
    },
    {
      title: t('hero.slides.mixedEarringsTitle'),
      subtitle: t('hero.slides.mixedEarringsSubtitle'),
      background: 'radial-gradient(circle at 78% 20%, rgba(71,104,54,0.48), rgba(27,41,24,0.96) 58%)',
      accent: '#9DD07A',
      images: [
        { src: productImages.aretes[1], alt: 'Aretes en colección mixta', className: 'left-[9%] top-[22%] h-44 w-34 md:h-58 md:w-44 rotate-[7deg]' },
        { src: productImages.jarras[2], alt: 'Jarra floral en colección mixta', className: 'left-[38%] top-[12%] h-40 w-34 md:h-52 md:w-42 rotate-[-10deg]' },
        { src: productImages.aretes[0], alt: 'Aretes edicion natural', className: 'right-[10%] top-[24%] h-46 w-36 md:h-60 md:w-46 rotate-[10deg]' },
      ],
    },
  ], [t])
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef(null)
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const slideRefs = useRef([])
  const heroSectionRef = useRef(null)
  const titleRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroSubRef = useRef(null)
  const [handDone, setHandDone] = useState(false)

  const activeSlide = useMemo(() => gallerySlides[activeIndex], [activeIndex, gallerySlides])

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
  }, [gallerySlides.length])

  useEffect(() => {
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
    }, heroSectionRef)

    return () => ctx.revert()
  }, [])

  // Effecto de tipeo: las letras del título, subtítulo y CTA se escriben
  // en cascada DESPUÉS de que termina la marca escrita a mano.
  useEffect(() => {
    if (!handDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroTitleRef.current?.querySelectorAll('span').forEach((s) => { s.opacity = 1; s.style.opacity = '1' })
      return
    }

    const ctx = gsap.context(() => {
      const title = heroTitleRef.current
      if (title) {
        gsap.fromTo(
          title.querySelectorAll('.l'),
          { autoAlpha: 0, y: 18, rotate: 4 },
          { autoAlpha: 1, y: 0, rotate: 0, duration: 0.35, ease: 'back.out(2.4)', stagger: 0.035 }
        )
      }
      if (heroSubRef.current) {
        gsap.fromTo(
          heroSubRef.current,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.3 }
        )
      }
    }, heroSectionRef)

    return () => ctx.revert()
  }, [handDone])

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
  }, [gallerySlides.length])

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
      <section ref={heroSectionRef} className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden lg:min-h-screen">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-forest-deep" />
          <Image
            src="/fondo2.jpeg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="hero-main-image object-cover object-center opacity-0"
          />
          <div className="absolute inset-0 hero-overlay" />
          <div className="absolute inset-0 noise-overlay" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gold-accent/4 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-gold-accent/3 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-4 pb-10 pt-24 text-center sm:px-6 sm:pb-12 sm:pt-28 md:pt-28 lg:pb-16 lg:pt-36">
          <HandsWritting onComplete={() => setHandDone(true)} />

          <div ref={heroTitleRef} className="mx-auto mt-6 max-w-[17rem] sm:mt-8 sm:max-w-[28rem] md:mt-6 md:max-w-4xl lg:mt-8 lg:max-w-7xl">
            <h1 className="font-display text-[clamp(2.9rem,11vw,4.8rem)] leading-[0.9] text-cream sm:text-[clamp(3.7rem,9vw,5.8rem)] md:text-[clamp(4.4rem,7vw,6.4rem)] md:leading-[0.93] lg:text-[clamp(5rem,7.4vw,8rem)] lg:leading-[0.95]">
              <span className="text-gold-light italic">
                {renderAnimatedWords(t('hero.titleBefore'))}
              </span>
              <span className="ml-[0.25em] inline-block sm:ml-[0.3em]">
                {renderAnimatedWords(t('hero.titleHighlight'))}
              </span>
            </h1>
          </div>
          <p
            ref={heroSubRef}
            style={{ opacity: 0 }}
            className="mx-auto mt-5 max-w-[18rem] text-base leading-8 text-cream/70 sm:mt-6 sm:max-w-[33rem] sm:text-lg md:max-w-[42rem] md:text-xl md:leading-9"
          >
            {t('hero.subtitle')}
          </p>
        </div>
        <ArrowDown className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-cream/80 animate-bounce md:block" />
      </section>

      <section ref={sectionRef} className="py-14 md:py-24 bg-forest-dark relative">
        <div className="container w-full max-w-6xl mx-auto px-4 md:px-6 relative">
          <div ref={titleRef} className="mb-10 text-center">
            <p className="text-gold-accent/70 uppercase tracking-[0.24em] text-xs mb-3">{t('hero.galleryLabel')}</p>
            <h2 className="font-display text-4xl md:text-5xl text-cream">{t('hero.galleryTitle')}</h2>
            <div className="w-16 h-px bg-gold-accent/60 mx-auto mt-0.5" />
          </div>

          <div
            ref={bgRef}
            className="relative overflow-hidden rounded-[1.25rem] border border-gold-accent/30 min-h-[380px] md:min-h-[560px] transition-colors duration-500"
            style={{ backgroundImage: activeSlide.background }}
          >
            <div className="absolute inset-0">
              <div className="absolute inset-x-4 top-6 sm:inset-x-6 sm:top-8 md:hidden">
                <div className="relative h-56 overflow-hidden rounded-[1.5rem] border border-white/20 shadow-[0_18px_40px_rgba(0,0,0,0.34)] sm:h-64">
                  <Image
                    src={activeSlide.images[0].src}
                    alt={activeSlide.images[0].alt}
                    fill
                    sizes="(max-width: 768px) calc(100vw - 3rem), 1px"
                    className="object-cover"
                  />
                </div>
              </div>
              {gallerySlides.map((slide, slideIndex) => (
                <div
                  key={slide.title}
                  ref={(el) => {
                    slideRefs.current[slideIndex] = el
                  }}
                  className="absolute inset-0 opacity-0 scale-105"
                >
                  {slide.images.map((image) => (
                    <div key={`${slide.title}-${image.alt}`} className={`floating-item absolute hidden md:block rounded-2xl overflow-hidden border border-white/30 shadow-[0_18px_40px_rgba(0,0,0,0.34)] ${image.className}`}>
                      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 1px, 18vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pt-20">
              {gallerySlides.map((slide, i) => (
                <button
                  key={slide.title}
                  aria-label={`${t('hero.slideAriaLabel')} ${i + 1}`}
                  type="button"
                  onClick={() => goToSlide(i)}
                  className="rounded-full transition-[width,background-color,box-shadow] duration-300"
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
            <div className="relative z-20 px-4 pb-20 pt-[17.5rem] sm:px-6 sm:pb-24 sm:pt-[20rem] md:absolute md:left-10 md:right-auto md:bottom-8 md:max-w-md md:px-0 md:pb-0 md:pt-0">
              <h3 className="font-display text-xl md:text-3xl text-cream mb-2 md:mb-3">{activeSlide.title}</h3>
              <p className="text-cream/75 text-xs sm:text-sm md:text-base">{activeSlide.subtitle}</p>
            </div>

          </div>


          <button
            type="button"
            onClick={goPrevious}
            aria-label="Mostrar colección anterior"
            className="absolute hidden md:block left-0 top-1/3 shadow-2xl rounded-2xl -translate-y-1/2 -translate-x-8 lg:-translate-x-12 p-3 transition-[background-color,color,transform] duration-300 hover:scale-110 z-40"
            style={{
              color: activeSlide.accent,
              borderColor: activeSlide.accent,
              backgroundColor: 'rgba(27,41,24,0.74)',
            }}
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Mostrar colección siguiente"
            className="absolute hidden md:block right-0 top-1/3 -translate-y-1/2 translate-x-8 lg:translate-x-12 p-3 rounded-full transition-[background-color,color,transform] duration-300 hover:scale-110 z-40"
            style={{
              color: activeSlide.accent,
              borderColor: activeSlide.accent,
              backgroundColor: 'rgba(27,41,24,0.74)',
            }}
          >
            <ArrowRight />
          </button>
        </div>
      </section>
    </>
  )
}

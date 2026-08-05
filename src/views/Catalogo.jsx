import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock3, Leaf, MessageCircle, Sparkles, X, ZoomIn } from 'lucide-react'
import { catalogContact, catalogSections } from '../content/catalog'
import { useI18n } from '../i18n'

const pageCopy = {
  es: {
    badge: 'Catálogo de atelier',
    title: 'Piezas creadas para acompañar historias',
    intro: 'Explora cada colección, descubre sus detalles y escríbenos directamente para reservar o personalizar una pieza.',
    collection: 'Colección',
    available: 'Disponible por encargo',
    madeToOrder: 'Diseño personalizado',
    from: 'Desde',
    order: 'Pedir por WhatsApp',
    previous: 'Ver imagen anterior de',
    next: 'Ver imagen siguiente de',
    image: 'Imagen',
    of: 'de',
    contactNote: 'Te responderemos para confirmar diseño, disponibilidad y entrega.',
    expandImage: 'Ampliar imagen',
    selectImage: 'Llevar imagen al centro',
    carouselLabel: 'Galería de',
    closeImage: 'Cerrar',
    viewerLabel: 'Imagen ampliada de',
    tabs: {
      description: 'Descripción',
      materials: 'Materiales',
      timing: 'Elaboración',
    },
    materialsIntro: 'Materiales principales de esta colección',
    timingLabel: 'Tiempo aproximado',
    timingNote: 'El tiempo comienza después de confirmar contigo el diseño y los detalles del pedido.',
  },
  en: {
    badge: 'Atelier catalog',
    title: 'Pieces made to accompany stories',
    intro: 'Explore every collection, discover its details, and message us directly to reserve or personalize a piece.',
    collection: 'Collection',
    available: 'Available to order',
    madeToOrder: 'Custom design',
    from: 'From',
    order: 'Order on WhatsApp',
    previous: 'View previous image of',
    next: 'View next image of',
    image: 'Image',
    of: 'of',
    contactNote: 'We will reply to confirm the design, availability, and delivery.',
    expandImage: 'Enlarge image',
    selectImage: 'Bring image to the center',
    carouselLabel: 'Gallery of',
    closeImage: 'Close',
    viewerLabel: 'Enlarged image of',
    tabs: {
      description: 'Description',
      materials: 'Materials',
      timing: 'Making time',
    },
    materialsIntro: 'Main materials in this collection',
    timingLabel: 'Approximate time',
    timingNote: 'The timeline starts after we confirm the design and order details with you.',
  },
}

const tabNames = ['description', 'materials', 'timing']

const revealVariants = {
  hidden: { opacity: 0, y: 44, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
}

const panelVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
}

const lightboxVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
}

const lightboxImageVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    y: 5,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
}

function localized(value, lang) {
  return value?.[lang] ?? value?.es ?? ''
}

function ImageLightbox({ image, copy, onClose }) {
  const closeButtonRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!image) return undefined

    const previousActiveElement = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab') {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousActiveElement?.focus?.()
    }
  }, [image, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {image ? (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="catalog-lightbox-title"
          variants={reduceMotion ? undefined : lightboxVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? undefined : 'visible'}
          exit={reduceMotion ? undefined : 'exit'}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-deep/95 p-3 backdrop-blur-xl md:p-8"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold-accent px-5 py-3 font-semibold text-forest-deep shadow-glow-button transition-[background-color,transform] duration-200 hover:bg-gold-light active:scale-[0.98] md:right-8 md:top-8"
          >
            <X aria-hidden="true" size={21} />
            {copy.closeImage}
          </button>

          <m.figure
            variants={reduceMotion ? undefined : lightboxImageVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
            exit={reduceMotion ? undefined : 'exit'}
            className="relative h-[76dvh] w-[min(94vw,88rem)] overflow-hidden rounded-[1.5rem] border border-gold-accent/25 bg-forest-dark shadow-[0_30px_100px_rgba(0,0,0,0.55)] md:h-[84dvh]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="94vw"
              className="object-contain"
            />
            <figcaption
              id="catalog-lightbox-title"
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-deep/95 to-transparent px-5 pb-5 pt-16 text-center text-base text-cream/85 md:text-lg"
            >
              {image.title}
            </figcaption>
          </m.figure>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function ProductDetails({ section, lang, copy, activeTab, onTabChange }) {
  const title = localized(section.title, lang)
  const panelId = `${section.id}-${activeTab}-panel`

  const handleTabKeyDown = (event, currentIndex) => {
    let nextIndex

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % tabNames.length
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + tabNames.length) % tabNames.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = tabNames.length - 1
    else return

    event.preventDefault()
    const nextTab = tabNames[nextIndex]
    onTabChange(nextTab)
    document.getElementById(`${section.id}-${nextTab}-tab`)?.focus()
  }

  return (
    <div className="mt-7 rounded-[1.35rem] border border-white/10 bg-forest-deep/35 p-2.5 md:p-3">
      <div
        role="tablist"
        aria-label={`${title}: ${copy.tabs.description}, ${copy.tabs.materials}, ${copy.tabs.timing}`}
        className="grid grid-cols-1 gap-1 rounded-[1rem] bg-forest-deep/45 p-1 sm:grid-cols-3"
      >
        {tabNames.map((tabName, tabIndex) => {
          const selected = activeTab === tabName
          return (
            <button
              key={tabName}
              id={`${section.id}-${tabName}-tab`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${section.id}-${tabName}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onTabChange(tabName)}
              onKeyDown={(event) => handleTabKeyDown(event, tabIndex)}
              className={`min-h-11 rounded-xl px-2 py-2.5 text-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.98] md:px-4 ${selected ? 'bg-gold-accent text-forest-deep shadow-[0_8px_24px_rgba(249,172,162,0.18)]' : 'text-cream/65 hover:bg-white/5 hover:text-cream'}`}
            >
              {copy.tabs[tabName]}
            </button>
          )
        })}
      </div>

      <div className="min-h-[10.5rem] overflow-hidden px-3 py-5 md:px-5">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={activeTab}
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${section.id}-${activeTab}-tab`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeTab === 'description' ? (
              <p className="max-w-xl text-[1.05rem] leading-8 text-cream/78">{localized(section.description, lang)}</p>
            ) : null}

            {activeTab === 'materials' ? (
              <div>
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary-fixed">
                  <Leaf aria-hidden="true" size={18} />
                  {copy.materialsIntro}
                </p>
                <ul className="grid gap-2.5 text-[1.02rem] text-cream/78">
                  {localized(section.materials, lang).map((material) => (
                    <li key={material} className="flex items-start gap-3">
                      <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-accent" />
                      {material}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activeTab === 'timing' ? (
              <div className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-fixed/12 text-secondary-fixed">
                  <Clock3 aria-hidden="true" size={21} />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cream/55">{copy.timingLabel}</p>
                  <p className="mt-1 font-display text-3xl text-gold-light">{localized(section.turnaround, lang)}</p>
                  <p className="mt-2 max-w-lg text-base leading-7 text-cream/65">{copy.timingNote}</p>
                </div>
              </div>
            ) : null}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function CatalogSection({ section, index, lang, copy, onOpenImage }) {
  const [activeImage, setActiveImage] = useState(() => Math.floor(section.images.length / 2))
  const [activeTab, setActiveTab] = useState('description')
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const reduceMotion = useReducedMotion()
  const title = localized(section.title, lang)
  const imageCount = section.images.length
  const previous = () => setActiveImage((current) => (current - 1 + imageCount) % imageCount)
  const next = () => setActiveImage((current) => (current + 1) % imageCount)
  const carouselExpanded = reduceMotion ? false : isCarouselHovered
  const cardTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 300, damping: 30, mass: 0.7 }
  const message = lang === 'en'
    ? `Hello, I would like to order: ${title}. Could you give me more information?`
    : `Hola, quisiera encargar: ${title}. ¿Podrían darme más información?`
  const whatsappHref = `https://wa.me/${catalogContact.whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <m.article
      id={section.id}
      data-catalog-section={section.id}
      variants={reduceMotion ? undefined : revealVariants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.16 }}
      className="grid scroll-mt-28 gap-8 rounded-[2rem] border border-gold-accent/20 bg-forest-mid/55 p-4 backdrop-blur-md md:p-7 lg:grid-cols-[1.08fr_.92fr] lg:gap-12"
    >
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label={`${copy.carouselLabel} ${title}`}
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
        onFocusCapture={() => setIsCarouselHovered(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsCarouselHovered(false)
        }}
        className={`relative flex min-h-[25rem] select-none items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/10 bg-forest-deep shadow-[0_24px_60px_rgba(15,29,12,0.28)] md:min-h-[38rem] ${index % 2 ? 'lg:order-2' : ''}`}
        style={{ perspective: '1100px' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(249,172,162,0.15),transparent_48%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-forest-deep via-forest-deep/55 to-transparent" />

        <div className="relative flex h-[82%] w-full items-center justify-center [transform-style:preserve-3d]">
          {section.images.map((image, imageIndex) => {
            const offset = imageIndex - activeImage
            const absoluteOffset = Math.abs(offset)
            const isActive = imageIndex === activeImage
            const isPast = imageIndex < activeImage
            const isVisible = absoluteOffset <= 2

            return (
              <m.button
                key={image.src}
                type="button"
                onClick={() => {
                  if (isActive) {
                    onOpenImage({
                      src: image.src,
                      alt: localized(image.alt, lang),
                      title,
                    })
                  } else {
                    setActiveImage(imageIndex)
                  }
                }}
                aria-label={isActive
                  ? `${copy.expandImage}: ${localized(image.alt, lang)}`
                  : `${copy.selectImage}: ${localized(image.alt, lang)}`}
                aria-current={isActive ? 'true' : undefined}
                initial={false}
                animate={{
                  x: offset * (carouselExpanded ? 150 : 92),
                  y: isActive ? (carouselExpanded ? -14 : 0) : absoluteOffset * (carouselExpanded ? 16 : 8),
                  rotateY: isActive ? 0 : (isPast ? (carouselExpanded ? 24 : 38) : (carouselExpanded ? -24 : -38)),
                  rotateZ: carouselExpanded ? offset * 6 : 0,
                  z: isActive ? 70 : -absoluteOffset * 55,
                  scale: isActive ? (carouselExpanded ? 1.035 : 1) : (carouselExpanded ? 0.92 : 0.86),
                  opacity: isVisible ? (isActive ? 1 : 0.78) : 0,
                }}
                transition={cardTransition}
                style={{
                  zIndex: 60 - absoluteOffset,
                  transformStyle: 'preserve-3d',
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                className={`group absolute aspect-[3/4] w-[68%] max-w-[21rem] overflow-hidden rounded-[1.35rem] border bg-forest-dark text-left shadow-[0_22px_55px_rgba(0,0,0,0.36)] outline-none sm:w-[58%] ${isActive ? 'border-gold-accent/70' : 'border-white/10'}`}
              >
                <span className="absolute inset-0 transition-transform duration-200 group-active:scale-[0.98]">
                  <Image
                    src={image.previewSrc ?? image.src}
                    alt={localized(image.alt, lang)}
                    width={700}
                    height={933}
                    unoptimized
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 68vw, (max-width: 1024px) 58vw, 34vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className={`pointer-events-none absolute inset-0 transition-colors duration-200 ${isActive ? 'bg-gradient-to-t from-forest-deep/55 via-transparent to-transparent' : 'bg-forest-deep/20 group-hover:bg-transparent'}`} />
                  <m.span
                    aria-hidden="true"
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -5 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-3 bottom-4 flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-forest-deep/78 px-4 py-2 text-center text-sm font-semibold text-cream backdrop-blur-md"
                  >
                    <ZoomIn aria-hidden="true" size={18} />
                    {copy.expandImage}
                  </m.span>
                </span>
              </m.button>
            )
          })}
        </div>

        <div className="absolute bottom-4 z-[70] flex min-h-12 items-center gap-2 rounded-full border border-white/12 bg-forest-deep/82 p-1.5 text-cream shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur-md">
          <button
            type="button"
            onClick={previous}
            aria-label={`${copy.previous} ${title}`}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-gold-light transition-[background-color,color,transform] duration-200 hover:bg-gold-accent hover:text-forest-deep active:scale-[0.97]"
          >
            <ArrowLeft aria-hidden="true" size={19} />
          </button>

          <div className="flex items-center gap-1.5" aria-label={`${copy.image} ${activeImage + 1} ${copy.of} ${imageCount}`}>
            {section.images.map((image, imageIndex) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(imageIndex)}
                aria-label={`${copy.image} ${imageIndex + 1}: ${title}`}
                aria-current={imageIndex === activeImage ? 'true' : undefined}
                className={`h-2.5 rounded-full transition-[width,background-color,transform] duration-200 active:scale-[0.96] ${imageIndex === activeImage ? 'w-8 bg-gold-accent' : 'w-2.5 bg-cream/25 hover:bg-cream/50'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label={`${copy.next} ${title}`}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-gold-light transition-[background-color,color,transform] duration-200 hover:bg-gold-accent hover:text-forest-deep active:scale-[0.97]"
          >
            <ArrowRight aria-hidden="true" size={19} />
          </button>
          <span className="sr-only" aria-live="polite">{copy.image} {activeImage + 1} {copy.of} {imageCount}</span>
        </div>
      </div>

      <div className={`flex flex-col justify-center px-2 py-5 md:px-4 lg:py-10 ${index % 2 ? 'lg:order-1' : ''}`}>
        <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <span className="text-sm uppercase tracking-[0.2em] text-gold-light/85">
            {copy.collection} {String(index + 1).padStart(2, '0')}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary-fixed/20 bg-secondary-fixed/10 px-3 py-1.5 text-sm text-secondary-fixed">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed" />
            {section.status === 'made-to-order' ? copy.madeToOrder : copy.available}
          </span>
        </div>

        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-gold-accent/85">{localized(section.eyebrow, lang)}</p>
        <h2 className="font-display text-4xl leading-tight text-cream md:text-5xl">{title}</h2>

        <ProductDetails
          section={section}
          lang={lang}
          copy={copy}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="my-7 flex items-end gap-3">
          <span className="pb-1 text-sm uppercase tracking-[0.16em] text-cream/55">{copy.from}</span>
          <span className="font-display text-4xl tabular-nums text-gold-light">{section.price.amount}</span>
          <span className="pb-1 text-base font-semibold text-gold-light/80">{section.price.currency}</span>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gold-accent px-6 py-3 font-semibold text-forest-deep shadow-glow-button transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-gold-light active:scale-[0.98] sm:w-fit"
        >
          <MessageCircle aria-hidden="true" size={20} />
          {copy.order}
        </a>
        <p className="mt-4 max-w-md text-base leading-7 text-cream/55">{copy.contactNote}</p>

      </div>
    </m.article>
  )
}

export default function Catalogo() {
  const { lang } = useI18n()
  const reduceMotion = useReducedMotion()
  const copy = pageCopy[lang] ?? pageCopy.es
  const [lightboxImage, setLightboxImage] = useState(null)
  const openLightbox = useCallback((image) => setLightboxImage(image), [])
  const closeLightbox = useCallback(() => setLightboxImage(null), [])

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen overflow-hidden bg-forest-deep pb-24 pt-28 md:pt-36">
        <div className="absolute inset-x-0 top-0 h-[38rem]">
          <Image src="/images/artisan-worktable-bg.png" alt="" fill loading="eager" sizes="100vw" className="object-cover object-center opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/45 via-forest-deep/75 to-forest-deep" />
        </div>
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
          <m.header
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-16 max-w-4xl text-center md:mb-24"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-accent/25 bg-forest-mid/70 px-4 py-2 text-sm uppercase tracking-[0.18em] text-gold-light backdrop-blur-md">
              <Sparkles aria-hidden="true" size={16} />
              {copy.badge}
            </span>
            <h1 className="mt-7 font-display text-5xl leading-[1.08] text-cream md:text-7xl">{copy.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-cream/75 md:text-xl">{copy.intro}</p>
          </m.header>

          <div className="space-y-10 md:space-y-16">
            {catalogSections.map((section, index) => (
              <CatalogSection
                key={section.id}
                section={section}
                index={index}
                lang={lang}
                copy={copy}
                onOpenImage={openLightbox}
              />
            ))}
          </div>
        </div>
      </main>
      <ImageLightbox image={lightboxImage} copy={copy} onClose={closeLightbox} />
    </LazyMotion>
  )
}

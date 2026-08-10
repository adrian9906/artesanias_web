import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock3, Leaf, MessageCircle, X, ZoomIn } from 'lucide-react'
import { catalogContact, catalogSections } from '../content/catalog'
import { useI18n } from '../i18n'
import { api } from '@/lib/cms/client'
import { trackWhatsApp } from '@/lib/analytics/tracker'

const pageCopy = {
  es: {
    title: 'Piezas creadas para acompañar historias',
    intro: 'Explora cada colección, descubre sus detalles y escríbenos directamente para reservar o personalizar una pieza.',
    collection: 'Colección',
    available: 'Disponible para comprar',
    madeToOrder: 'Disponible por encargo',
    from: 'Desde',
    order: 'Comprar ahora',
    orderEncargo: 'Encargar ahora',
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

    title: 'Pieces made to accompany stories',
    intro: 'Explore every collection, discover its details, and message us directly to reserve or personalize a piece.',
    collection: 'Collection',
    available: 'Available to order',
    madeToOrder: 'Custom design',
    from: 'From',
    order: 'Buy now',
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
const PROMOTION_STORAGE_KEY = 'thay-art-promotion-dismissed'

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
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') return value?.[lang] ?? value?.es ?? value?.en ?? ''
  return value ?? ''
}

function productToCatalogSection(product) {
  const photos = Array.isArray(product.photos) && product.photos.length
    ? product.photos
    : product.photo
      ? [product.photo]
      : []

  return {
    id: product.id,
    status: product.inStock === false ? 'made-to-order' : 'available',
    title: { es: product.name, en: product.name },
    eyebrow: {
      es: product.eyebrow || product.sectionName || 'Coleccion artesanal',
      en: product.eyebrow || product.sectionName || 'Artisan collection',
    },
    description: {
      es: product.description || product.sectionDescription || '',
      en: product.description || product.sectionDescription || '',
    },
    materials: {
      es: Array.isArray(product.materials) && product.materials.length
        ? product.materials
        : ['Consulta los materiales al solicitar esta pieza.'],
      en: Array.isArray(product.materials) && product.materials.length
        ? product.materials
        : ['Ask us about the materials used in this piece.'],
    },
    turnaround: {
      es: product.elaborationTime || 'A coordinar',
      en: product.elaborationTime || 'To be arranged',
    },
    price: {
      amount: Number(product.price) || 0,
      currency: product.currency || 'USD',
    },
    images: photos.map((src, index) => ({
      src,
      previewSrc: src,
      alt: {
        es: `${product.name}, vista ${index + 1}`,
        en: `${product.name}, view ${index + 1}`,
      },
    })),
  }
}

function PromotionModal({ promotion, onClose, onVisit }) {
  const closeButtonRef = useRef(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!promotion) return undefined

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
  }, [promotion, onClose])

  if (!promotion || typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {promotion ? (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="promotion-modal-title"
          variants={reduceMotion ? undefined : lightboxVariants}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? undefined : 'visible'}
          exit={reduceMotion ? undefined : 'exit'}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#071007]/92 p-3 backdrop-blur-xl md:p-8"
        >
          <m.div
            variants={reduceMotion ? undefined : lightboxImageVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
            exit={reduceMotion ? undefined : 'exit'}
            className="relative h-[88dvh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-forest-dark shadow-[0_40px_120px_rgba(0,0,0,0.58)]"
          >
            <Image
              src={promotion.image}
              alt={promotion.title}
              fill
              sizes="100vw"
              unoptimized
              className="scale-110 object-cover opacity-25 blur-2xl"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,7,0.22)_0%,rgba(7,12,7,0.34)_28%,rgba(7,12,7,0.72)_65%,rgba(7,12,7,0.94)_100%)]" />
            <div className="absolute inset-5 rounded-[1.7rem] border border-white/10 bg-black/15 backdrop-blur-[2px] md:inset-7">
              <Image
                src={promotion.image}
                alt={promotion.title}
                fill
                sizes="100vw"
                unoptimized
                className="object-contain p-4 md:p-6"
              />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-cream/90 backdrop-blur-md">
                  Nuevo producto
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-medium text-cream/90 backdrop-blur-md transition hover:bg-black/45"
                >
                  <X aria-hidden="true" size={18} />
                  <span className="ml-2">Cerrar</span>
                </button>
              </div>

              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.22em] text-gold-light/85">
                  {promotion.product?.name || 'Pieza destacada'}
                </p>
                <h2 id="promotion-modal-title" className="mt-3 font-display text-4xl leading-tight text-white md:text-6xl">
                  {promotion.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-8 text-cream/85 md:text-lg">
                  {promotion.message}
                </p>
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={onVisit}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold-accent px-7 py-3 text-sm font-semibold text-forest-deep shadow-glow-button transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-gold-light active:scale-[0.98]"
                  >
                    {promotion.ctaLabel || 'Visitar'}
                  </button>
                </div>
              </div>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
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
                className={`group absolute aspect-[16/10] w-[82%] max-w-[28rem] overflow-hidden rounded-[1.35rem] border bg-forest-dark text-left shadow-[0_22px_55px_rgba(0,0,0,0.36)] outline-none sm:w-[74%] ${isActive ? 'border-gold-accent/70' : 'border-white/10'}`}
              >
                <span className="absolute inset-0 bg-forest-dark transition-transform duration-200 group-active:scale-[0.98]">
                  <Image
                    src={image.previewSrc ?? image.src}
                    alt={localized(image.alt, lang)}
                    width={700}
                    height={933}
                    unoptimized
                    loading={index === 0 ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 74vw, 40vw"
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                  <span className={`pointer-events-none absolute inset-0 transition-colors duration-200 ${isActive ? 'bg-gradient-to-t from-forest-deep/55 via-transparent to-transparent' : 'bg-forest-deep/20 group-hover:bg-transparent'}`} />
                  <m.span
                    aria-hidden="true"
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -5 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-3 top-3 flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-forest-deep/82 px-3 py-2 text-center text-xs font-semibold text-cream backdrop-blur-md sm:text-sm"
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
          onClick={() => trackWhatsApp({ productId: section.id, product: title })}
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
  const [catalogItems, setCatalogItems] = useState(catalogSections)
  const [promotion, setPromotion] = useState(null)
  const [promotionVisible, setPromotionVisible] = useState(false)
  const openLightbox = useCallback((image) => setLightboxImage(image), [])
  const closeLightbox = useCallback(() => setLightboxImage(null), [])
  const closePromotion = useCallback(() => {
    setPromotionVisible(false)
    if (typeof window !== 'undefined' && promotion?.id && promotion?.updatedAt) {
      window.localStorage.setItem(PROMOTION_STORAGE_KEY, `${promotion.id}:${promotion.updatedAt}`)
    }
  }, [promotion])

  const visitPromotion = useCallback(() => {
    if (promotion?.productId) {
      document.getElementById(promotion.productId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    closePromotion()
  }, [closePromotion, promotion])

  useEffect(() => {
    let mounted = true

    Promise.all([
      api('/api/admin/products').catch(() => null),
      api('/api/promotion').catch(() => null),
    ])
      .then(([productsData, promotionData]) => {
        if (!mounted) return

        const products = (productsData?.products || []).map(productToCatalogSection).filter((item) => item.images.length > 0)
        if (products.length > 0) {
          setCatalogItems(products)
        } else {
          setCatalogItems(catalogSections)
        }

        const nextPromotion = promotionData?.promotion
        if (nextPromotion?.enabled && nextPromotion?.image && nextPromotion?.productId) {
          setPromotion(nextPromotion)
          const dismissedAt = typeof window !== 'undefined'
            ? window.localStorage.getItem(PROMOTION_STORAGE_KEY)
            : null
          setPromotionVisible(dismissedAt !== `${nextPromotion.id}:${nextPromotion.updatedAt}`)
        } else {
          setPromotion(null)
          setPromotionVisible(false)
        }
      })
      .catch(() => {
        if (!mounted) {
          return
        }
        setCatalogItems(catalogSections)
        setPromotion(null)
        setPromotionVisible(false)
      })

    return () => {
      mounted = false
    }
  }, [])

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
            <h1 className="mt-7 font-display text-5xl leading-[1.08] text-cream md:text-7xl">{copy.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-cream/75 md:text-xl">{copy.intro}</p>
          </m.header>

          <div className="space-y-10 md:space-y-16">
            {catalogItems.map((section, index) => (
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
      <PromotionModal promotion={promotionVisible ? promotion : null} onClose={closePromotion} onVisit={visitPromotion} />
    </LazyMotion>
  )
}

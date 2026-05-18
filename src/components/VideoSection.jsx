import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

const videos = [
  {
    platform: 'youtube',
    id: 'dDBAPJxat2Y',
    title: 'Modelado a mano de jarra decorativa',
    description: 'Cada pieza comienza con un bloque de porcelana fria y horas de dedicacion artesanal.',
    thumbnail: null,
  },
  {
    platform: 'youtube',
    id: 'NxRdTuRtYVM',
    title: 'Texturizado con herramientas naturales',
    description: 'Hojas, cortezas y fibras se convierten en sellos que graban la naturaleza en la superficie.',
    thumbnail: null,
  },
  {
    platform: 'youtube',
    id: '7VnYBkXSNu8',
    title: 'Proceso de pintado a mano',
    description: 'Capas de pigmento natural aplicadas con pinceles de fibra vegetal para acabados unicos.',
    thumbnail: null,
  },
  {
    platform: 'instagram',
    id: 'Cx9V3KzOj8M',
    title: 'Taller en vivo: creacion de joyeria botanica',
    description: 'Un vistazo exclusivo a nuestro taller mientras transformamos flores preservadas en piezas de arte.',
    thumbnail: null,
  },
  {
    platform: 'youtube',
    id: 'Hb3HgRWTSZc',
    title: 'De la idea al molde: el proceso creativo',
    description: 'Sigue el recorrido completo de una pieza personalizada desde el boceto inicial hasta el horno.',
    thumbnail: null,
  },
  {
    platform: 'facebook',
    id: '1015938792278541',
    title: 'Detalles que marcan la diferencia',
    description: 'Macro close-up de los acabados finales: texturas, bordes dorados y sellos de autenticidad.',
    thumbnail: null,
  },
]

function getEmbedUrl(video) {
  switch (video.platform) {
    case 'youtube':
      return `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`
    case 'instagram':
      return `https://www.instagram.com/p/${video.id}/embed`
    case 'facebook':
      return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${video.id}&show_text=false&width=640`
    default:
      return ''
  }
}

function VideoCard({ video, index }) {
  const [loaded, setLoaded] = useState(false)
  const [active, setActive] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 60, autoAlpha: 0, scale: 0.92 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 88%',
          },
        },
      )
    }, cardRef)

    return () => ctx.revert()
  }, [index])

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden border border-gold-accent/15 bg-forest-mid/50 backdrop-blur-sm will-change-transform opacity-0"
    >
      <div className="relative aspect-video bg-forest-dark overflow-hidden">
        {active ? (
          <iframe
            src={getEmbedUrl(video) + '&autoplay=1'}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-forest-light/40 to-forest-dark/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => setActive(true)}
                className="size-16 md:size-20 rounded-full bg-gold-accent/20 border-2 border-gold-accent/50 flex items-center justify-center transition-all duration-300 group-hover:bg-gold-accent/40 group-hover:scale-110 group-hover:border-gold-accent"
              >
                <Play className="text-gold-accent fill-gold-accent ml-1" size={28} />
              </button>
              <div className="text-center px-4">
                <p className="text-xs uppercase tracking-[0.2em] text-gold-accent/60 mb-1">
                  {video.platform === 'youtube' ? 'YouTube' : video.platform === 'instagram' ? 'Instagram' : 'Facebook'}
                </p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-forest-dark/90 to-transparent" />
          </>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-body text-cream text-base font-semibold mb-2 leading-tight">{video.title}</h3>
        <p className="text-cream/50 text-xs leading-relaxed">{video.description}</p>
      </div>

      {!active && (
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold-accent/0 group-hover:ring-gold-accent/30 transition-all duration-500 pointer-events-none" />
      )}
    </div>
  )
}

export default function VideoSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const filterRef = useRef(null)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? videos : videos.filter(v => v.platform === filter)

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

      gsap.fromTo(
        filterRef.current,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: filterRef.current,
            start: 'top 88%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const filters = [
    { value: 'all', label: 'Todos' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-forest-deep relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-gold-accent/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gold-accent/[0.03] rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6">
        <div ref={titleRef} className="text-center mb-6">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-accent/60">Detras del arte</span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mt-4 mb-3 leading-tight">
            Procesos de Creacion
          </h2>
          <div className="w-16 h-px bg-gold-accent/40 mx-auto mb-1" />
          <p className="text-cream/40 text-sm mt-4 max-w-md mx-auto">
            Cada pieza cuenta una historia. Mira como nacen nuestras creaciones desde el primer boceto hasta el ultimo detalle.
          </p>
        </div>

        <div ref={filterRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.15em] border transition-all duration-300 ${
                filter === f.value
                  ? 'bg-gold-accent text-forest-dark border-gold-accent font-semibold'
                  : 'bg-transparent text-cream/50 border-gold-accent/20 hover:border-gold-accent/50 hover:text-cream/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video, i) => (
            <VideoCard key={`${video.platform}-${video.id}`} video={video} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/galeria"
            className="inline-flex items-center gap-2 text-gold-accent hover:text-gold-light transition-colors text-sm uppercase tracking-[0.2em]"
          >
            Ver galeria completa
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}

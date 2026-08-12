import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, ExternalLink } from 'lucide-react'
import { useI18n } from '../i18n'
import { videoCatalog } from '../content/videoCatalog'

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
      className="group relative rounded-2xl overflow-hidden border border-gold-accent/15 bg-forest-mid/50 backdrop-blur-sm opacity-0"
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
                aria-label={`Reproducir ${video.title}`}
                className="size-16 md:size-20 rounded-full bg-gold-accent/20 border-2 border-gold-accent/50 flex items-center justify-center transition-[background-color,border-color,transform] duration-300 group-hover:bg-gold-accent/40 group-hover:scale-110 group-hover:border-gold-accent"
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
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold-accent/0 group-hover:ring-gold-accent/30 transition-shadow duration-500 pointer-events-none" />
      )}
    </div>
  )
}

export default function VideoSection() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const filterRef = useRef(null)
  const [filter, setFilter] = useState('all')

  const videoData = t('videoData')
  const videos = useMemo(() => videoCatalog.map((v, i) => ({
    ...v,
    title: videoData[i]?.title ?? v.id,
    description: videoData[i]?.description ?? '',
  })), [videoData])

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
    { value: 'all', label: t('videoSection.filterAll') },
    { value: 'youtube', label: 'YouTube' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
  ]

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-forest-deep py-24">
      <Image
        src="https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562878/thay-art/images/porcelain-garden-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[70%_center] opacity-65"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,41,24,0.82)_0%,rgba(27,41,24,0.58)_46%,rgba(27,41,24,0.9)_100%)]" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-secondary-fixed/[0.08] rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6">
        <div ref={titleRef} className="text-center mb-6">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-accent/60">{t('videoSection.badge')}</span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mt-4 mb-3 leading-tight">
            {t('videoSection.title')}
          </h2>
          <div className="w-16 h-px bg-gold-accent/40 mx-auto mb-1" />
          <p className="text-cream/40 text-sm mt-4 max-w-md mx-auto">
            {t('videoSection.subtitle')}
          </p>
        </div>

        <div ref={filterRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-[0.15em] border transition-[background-color,border-color,color,transform] duration-300 ${filter === f.value
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
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-gold-accent hover:text-gold-light transition-colors text-sm uppercase tracking-[0.2em]"
          >
            {t('videoSection.viewGallery')}
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

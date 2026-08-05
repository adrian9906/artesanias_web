import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '../i18n'

const branchImages = [
  { image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=80', side: 'left', top: '22%' },
  { image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&q=80', side: 'right', top: '42%' },
  { image: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=900&q=80', side: 'left', top: '62%' },
]

export default function SobreNosotros() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const branches = useMemo(() => [
    { title: t('about.branch1Title'), text: t('about.branch1Text'), ...branchImages[0] },
    { title: t('about.branch2Title'), text: t('about.branch2Text'), ...branchImages[1] },
    { title: t('about.branch3Title'), text: t('about.branch3Text'), ...branchImages[2] },
  ], [t])
  const trunkRef = useRef(null)
  const branchLineRefs = useRef([])
  const branchCardRefs = useRef([])
  const finalRef = useRef(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      gsap.set(trunkRef.current, { scaleY: 0, transformOrigin: 'top center' })
      gsap.set(branchLineRefs.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(branchCardRefs.current, { autoAlpha: 0, y: 36, scale: 0.95 })
      gsap.set(finalRef.current, { autoAlpha: 0, y: 28, scale: 0.96 })

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'sobre-nosotros-tree',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          scrub: 1,
          pin: true,
        },
      })

      tl.to(trunkRef.current, { scaleY: 1, duration: 0.85, ease: 'none' })

      branchLineRefs.current.forEach((line, i) => {
        tl.to(line, { scaleX: 1, duration: 0.35, ease: 'none' })
          .to(
            branchCardRefs.current[i],
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              ease: 'power2.out',
            },
            '<',
          )
      })

      tl.to(finalRef.current, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      })
    }, sectionRef)

    return () => {
      const treeTrigger = ScrollTrigger.getById('sobre-nosotros-tree')
      if (treeTrigger) {
        treeTrigger.kill()
      }
      ctx.revert()
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-forest-dark animate-blurred-fade-in"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(249,172,162,0.14), transparent 40%), radial-gradient(circle at 80% 30%, rgba(200,228,157,0.12), transparent 40%)',
      }}
    >
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20 mt-20">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-display text-4xl md:text-6xl text-cream mb-4">
            {t('about.title')}
          </h1>
          <p className="text-cream/70 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </header>

        <div className="md:hidden space-y-6">
          {branches.map((branch) => (
            <article
              key={`mobile-${branch.title}`}
              className="rounded-2xl border border-gold-accent/35 bg-forest-mid/70 p-4 backdrop-blur-sm"
              style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}
            >
              <div className="rounded-xl overflow-hidden mb-4 border border-gold-accent/25">
                <img src={branch.image} alt={branch.title} className="w-full h-48 object-cover" />
              </div>
              <h2 className="font-display text-xl text-cream mb-2">{branch.title}</h2>
              <p className="text-cream/70 text-sm">{branch.text}</p>
            </article>
          ))}
        </div>

        <div className="relative hidden md:block h-[68vh] md:h-[72vh]">
          <div
            ref={trunkRef}
            className="absolute left-1/2 -translate-x-1/2 top-[10%] h-[76%] w-[10px] rounded-full"
            style={{
              background:
                'linear-gradient(to bottom, rgba(249,172,162,0.95), rgba(157,208,122,0.82))',
              boxShadow: '0 0 24px rgba(249,172,162,0.28)',
            }}
          />

          {branches.map((branch, i) => {
            const isLeft = branch.side === 'left'

            return (
              <div key={branch.title}>
                <div
                  ref={(el) => {
                    branchLineRefs.current[i] = el
                  }}
                  className="absolute h-[4px] w-[22%] rounded-full"
                  style={{
                    top: branch.top,
                    left: isLeft ? '28%' : '50%',
                    background:
                      'linear-gradient(to right, rgba(249,172,162,0.95), rgba(157,208,122,0.86))',
                    boxShadow: '0 0 16px rgba(249,172,162,0.28)',
                    transformOrigin: isLeft ? 'right center' : 'left center',
                  }}
                />

                <article
                  ref={(el) => {
                    branchCardRefs.current[i] = el
                  }}
                  className="absolute w-[43%] rounded-2xl border border-gold-accent/35 bg-forest-mid/70 p-4 md:p-5 backdrop-blur-sm"
                  style={{
                    top: `calc(${branch.top} - 58px)`,
                    left: isLeft ? '2%' : '55%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                  }}
                >
                  <div className="rounded-xl overflow-hidden mb-4 border border-gold-accent/25">
                    <img
                      src={branch.image}
                      alt={branch.title}
                      className="w-full h-32 md:h-44 object-cover"
                    />
                  </div>
                  <h2 className="font-display text-2xl text-cream mb-2">{branch.title}</h2>
                  <p className="text-cream/70 text-sm md:text-base">{branch.text}</p>
                </article>
              </div>
            )
          })}
        </div>

        <div ref={finalRef} className="text-center mt-8 md:mt-10">
          <p className="text-gold-light font-display text-2xl md:text-4xl leading-tight">
            {t('about.finalLine')}
          </p>
        </div>
      </div>
    </section>
  )
}

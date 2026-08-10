'use client'

import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Leaf, Send } from 'lucide-react'
import { useI18n } from '../i18n'
import { cn } from '@/lib/utils'
import { CornerBranch, EdgeVine, EdgeVineVertical } from '../components/forest-vines'
import { api } from '@/lib/cms/client'

const TABS = ['opinions', 'experiences', 'testimonials']
const ACCENT = '#f9aca2'
const TAB_TO_TYPE = {
  opinions: 'opinion',
  experiences: 'experience',
  testimonials: 'testimonial',
}

function formatPublicDate(iso, lang) {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function Opiniones() {
  const { t, lang } = useI18n()
  const [activeTab, setActiveTab] = useState('opinions')
  const [message, setMessage] = useState('')
  const [identity, setIdentity] = useState('anonymous')
  const [name, setName] = useState('')
  const [groupedMessages, setGroupedMessages] = useState({
    opinions: [],
    experiences: [],
    testimonials: [],
  })
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const formRef = useRef(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const fallback = t('opinionsFeedData')

    api('/api/feedback')
      .then((data) => {
        if (!mounted || !isMounted.current) return
        setGroupedMessages({
          opinions: data.grouped?.opinions || fallback.opinions || [],
          experiences: data.grouped?.experiences || fallback.experiences || [],
          testimonials: data.grouped?.testimonials || fallback.testimonials || [],
        })
        setNotice('')
        setError('')
      })
      .catch(() => {
        if (!mounted || !isMounted.current) return
        setGroupedMessages({
          opinions: fallback.opinions || [],
          experiences: fallback.experiences || [],
          testimonials: fallback.testimonials || [],
        })
      })

    return () => {
      mounted = false
    }
  }, [t])

  const messages = groupedMessages[activeTab] || []

  useLayoutEffect(() => {
    const root = formRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      const strokes = gsap.utils.toArray('.draw-stroke')
      const leaves = gsap.utils.toArray('.pop-leaf')
      const berries = gsap.utils.toArray('.pop-berry')

      if (prefersReduced) {
        gsap.set([...leaves, ...berries], { opacity: 1, scale: 1 })
        return
      }

      // Prep the vine strokes so they can be "drawn" on.
      strokes.forEach((path) => {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set(leaves, { opacity: 0, scale: 0, transformOrigin: 'center' })
      gsap.set(berries, { opacity: 0, scale: 0, transformOrigin: 'center' })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1. Card assembles into place.
      tl.from('.forest-card-body', {
        opacity: 0,
        scale: 0.9,
        y: 24,
        duration: 0.7,
        ease: 'back.out(1.4)',
      })
        // 2. Content fades up.
        .from(
          '.forest-card-content > *',
          { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 },
          '-=0.3',
        )
        // 3. Vines grow around the card.
        .to(
          strokes,
          { strokeDashoffset: 0, duration: 1.1, stagger: 0.03 },
          '-=0.3',
        )
        // 4. Leaves sprout out.
        .to(
          leaves,
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(2)',
            stagger: 0.05,
          },
          '-=0.6',
        )
        // 5. Berries pop last.
        .to(
          berries,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'back.out(3)',
            stagger: 0.08,
          },
          '-=0.3',
        )
    }, root)

    return () => ctx.revert()
  }, [])

  async function handleSend(e) {
    e.preventDefault()
    setError('')
    if (!message.trim()) {
      setError(t('opinions.requiredMessage'))
      return
    }
    if (identity === 'name' && !name.trim()) {
      setError(t('opinions.requiredName'))
      return
    }
    setSending(true)
    try {
      const data = await api('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
          type: TAB_TO_TYPE[activeTab],
          name: identity === 'name' ? name.trim() : '',
          text: message.trim(),
        }),
      })

      if (!isMounted.current) return
      const created = data.item
      setGroupedMessages((prev) => ({
        ...prev,
        [activeTab]: [created, ...(prev[activeTab] || [])],
      }))
      setMessage('')
      setName('')
      setIdentity('anonymous')
      setNotice(t('opinions.success'))
      window.setTimeout(() => {
        if (isMounted.current) setNotice('')
      }, 4000)
    } catch (err) {
      if (isMounted.current) setError(err.message)
    } finally {
      if (isMounted.current) setSending(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-forest-dark pt-32 pb-24 px-4 sm:px-6 lg:px-10 animate-blurred-fade-in">
      <div className="absolute inset-0 noise-overlay" />
      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-accent/25 bg-forest-mid/60 px-4 py-2 text-sm uppercase tracking-[0.18em] text-gold-light backdrop-blur-md">
            <Leaf aria-hidden="true" size={16} />
            {t('opinions.badge')}
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-6xl text-cream tracking-tight">{t('opinions.title')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/70">{t('opinions.subtitle')}</p>
        </header>

        <div
          role="tablist"
          aria-label={t('opinions.title')}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 rounded-full border border-[#F9ACA2]/45 bg-forest-deep/55 p-1.5 backdrop-blur-md"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'min-h-11 rounded-full px-3 text-sm font-semibold transition-colors duration-300',
                  active
                    ? 'bg-[#F9ACA2] text-forest-deep shadow-[0_8px_22px_rgba(249,172,162,0.3)]'
                    : 'text-cream/70 hover:text-gold-light',
                )}
              >
                {t(`opinions.tabs.${tab}`)}
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div ref={formRef} className="relative">
            {/* Edge vines form the entire frame of the card */}
            <EdgeVine className="pointer-events-none absolute -top-3 left-4 right-4 z-20 w-[calc(100%-2rem)]" />
            <EdgeVine className="pointer-events-none absolute -bottom-3 left-4 right-4 z-20 w-[calc(100%-2rem)]" />
            <EdgeVineVertical className="pointer-events-none absolute -left-3 top-4 bottom-4 z-20 h-[calc(100%-2rem)]" />
            <EdgeVineVertical className="pointer-events-none absolute -right-3 top-4 bottom-4 z-20 h-[calc(100%-2rem)]" />

            {/* Branches sprouting from each corner */}
            <CornerBranch className="pointer-events-none absolute -left-10 -top-10 z-30" />
            <CornerBranch className="pointer-events-none absolute -right-10 -top-10 z-30 -scale-x-100" />
            <CornerBranch className="pointer-events-none absolute -left-10 -bottom-10 z-30 -scale-y-100" />
            <CornerBranch className="pointer-events-none absolute -right-10 -bottom-10 z-30 -scale-100" />

            {/* Card body — no drawn border; the vines form the frame */}
            <form
              onSubmit={handleSend}
              noValidate
              className="forest-card-body relative z-10 rounded-3xl bg-forest-mid/25 p-8 text-cream shadow-2xl backdrop-blur-md sm:p-10"
            >
              <div className="forest-card-content">
                <header className="mb-7 text-center">
                  <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2"
                    style={{ borderColor: ACCENT }}
                  >
                    <Leaf
                      className="h-6 w-6"
                      style={{ color: 'var(--forest-leaf-light)' }}
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="font-display text-2xl text-gold-light">{t('opinions.formTitle')}</h2>
                  <p className="mt-2 text-sm text-cream/70">{t('opinions.formHint')}</p>
                </header>

                <div className="flex flex-col gap-5">
                  {/* Message textarea */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="opinion-message" className="text-sm font-semibold text-cream/80">
                      {t('opinions.message')}
                    </label>
                    <textarea
                      id="opinion-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder={t('opinions.messagePlaceholder')}
                      className="w-full resize-none rounded-xl border-2 bg-forest-deep/60 px-4 py-3 text-sm leading-relaxed text-cream outline-none transition placeholder:text-cream/40 focus:ring-2"
                      style={
                        {
                          borderColor: ACCENT,
                          '--tw-ring-color': ACCENT,
                        }
                      }
                    />
                  </div>

                  {/* Identity toggle */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="opinion-identity" className="text-sm font-semibold text-cream/80">
                      {t('opinions.identity')}
                    </label>
                    <div
                      id="opinion-identity"
                      className="flex gap-2 rounded-xl border-2 bg-forest-deep/60 p-1"
                      style={{ borderColor: ACCENT }}
                    >
                      <button
                        type="button"
                        onClick={() => setIdentity('anonymous')}
                        className={cn(
                          'min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition-colors duration-300',
                          identity === 'anonymous'
                            ? 'bg-[#F9ACA2] text-forest-deep'
                            : 'text-cream/70 hover:text-gold-light',
                        )}
                      >
                        {t('opinions.anonymous')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdentity('name')}
                        className={cn(
                          'min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition-colors duration-300',
                          identity === 'name'
                            ? 'bg-[#F9ACA2] text-forest-deep'
                            : 'text-cream/70 hover:text-gold-light',
                        )}
                      >
                        {t('opinions.withName')}
                      </button>
                    </div>
                  </div>

                  {/* Conditional username input */}
                  {identity === 'name' ? (
                    <div className="flex flex-col gap-2">
                      <label htmlFor="opinion-name" className="text-sm font-semibold text-cream/80">
                        {t('opinions.nameLabel')}
                      </label>
                      <input
                        id="opinion-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('opinions.namePlaceholder')}
                        className="w-full rounded-xl border-2 bg-forest-deep/60 px-4 py-3 text-sm text-cream outline-none transition placeholder:text-cream/40 focus:ring-2"
                        style={
                          {
                            borderColor: ACCENT,
                            '--tw-ring-color': ACCENT,
                          }
                        }
                      />
                    </div>
                  ) : null}

                  {error && <p className="text-sm text-[#f46f80]">{error}</p>}
                  {notice && <p className="text-sm text-[#c8e49d]">{notice}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-forest-deep transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60"
                    style={
                      {
                        backgroundColor: 'var(--forest-leaf)',
                        '--tw-ring-color': ACCENT,
                        '--tw-ring-offset-color': '#263b22',
                      }
                    }
                  >
                    <Send className="h-4 w-4 text-[#F9ACA2]" aria-hidden="true" />
                    {sending ? <span className='text-[#F9ACA2] font-bold'>{t('opinions.sending')}</span> : <span className='text-[#F9ACA2] font-bold'>{t('opinions.send')}</span>}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="opinion-card rounded-2xl border border-dashed border-[#f9aca2]/35 bg-white/[0.02] px-6 py-14 text-center">
                <p className="text-cream">{t('opinions.empty')}</p>
              </div>
            ) : (
              messages.map((item) => (
                <article
                  key={item.id}
                  className="opinion-card rounded-2xl border border-[#F9ACA2]/40 bg-forest-mid/25 p-5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-gold-light">{item.name}</p>
                    {item.date ? <span className="text-xs text-cream/50">{item.date}</span> : null}
                  </div>
                    <p className="mt-2 leading-relaxed text-cream/85">{item.text}</p>
                    {item.createdAt ? (
                      <p className="mt-3 text-xs text-cream/45">{formatPublicDate(item.createdAt, lang)}</p>
                    ) : null}
                  </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

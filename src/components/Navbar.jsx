import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '../i18n'
import BrandName from './BrandName'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path) => {
    if (path === '/') return pathname === path
    return pathname.startsWith(path)
  }

  const mobileLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.catalog'), to: '/catalogo' },
    { label: t('nav.about'), to: '/sobre-nosotros' },
    { label: t('nav.orderInfo'), to: '/informacion-de-encargo' },
    { label: t('nav.gallery'), to: '/galeria' },
    { label: t('nav.news'), to: '/noticias' },
    { label: t('nav.order'), to: '/encargos' },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full max-w-full px-1 md:px-0">
      <header
        className={`transition-[background-color,border-color,border-radius,box-shadow,backdrop-filter,margin] duration-500 ${scrolled
          ? 'bg-forest-mid/92 backdrop-blur-xl border rounded-2xl md:rounded-full mt-2 border-gold-accent/25 shadow-[0_14px_45px_rgba(15,29,12,0.24)] max-w-7xl mx-auto'
          : 'bg-transparent max-w-7xl mx-auto'
          } relative`}
      >
        <div className={`mx-auto flex items-center justify-between px-4 py-3 sm:px-5 md:px-6 md:py-4 ${scrolled ? 'gap-4 md:gap-6' : 'gap-3 md:gap-4'}`}>
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="relative h-9 w-9 shrink-0 rounded-[45%_55%_45%_55%] border border-gold-light/60 bg-gold-accent shadow-[0_0_22px_rgba(249,172,162,0.28)] after:absolute after:inset-[9px] after:rounded-full after:bg-forest-mid" />
            <BrandName className="text-lg md:text-2xl" />
          </Link>

          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium xl:gap-5">
            <Link className={`${isActive('/') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} href="/">{t('nav.home')}</Link>
            <Link className={`${isActive('/catalogo') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} href="/catalogo">{t('nav.catalog')}</Link>
            <Link className={`${isActive('/sobre-nosotros') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} href="/sobre-nosotros">{t('nav.about')}</Link>
            <Link className={`${isActive('/informacion-de-encargo') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} href="/informacion-de-encargo">{t('nav.orderInfo')}</Link>
            <Link className={`${isActive('/galeria') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} href="/galeria">{t('nav.gallery')}</Link>
            <Link className={`${isActive('/noticias') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} href="/noticias">{t('nav.news')}</Link>
            <Link className="inline-flex min-h-10 items-center rounded-full border border-gold-accent bg-gold-accent px-5 py-2 text-sm font-semibold text-forest-deep shadow-glow-button transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-gold-light" href="/encargos">{t('nav.order')}</Link>
            <div className="inline-flex rounded-full border border-white/15 overflow-hidden">
              <button type="button" onClick={() => setLang('es')} className={`px-2 py-1 text-xs ${lang === 'es' ? 'bg-gold-accent text-forest-dark' : 'text-cream/70'}`}>ES</button>
              <button type="button" onClick={() => setLang('en')} className={`px-2 py-1 text-xs ${lang === 'en' ? 'bg-gold-accent text-forest-dark' : 'text-cream/70'}`}>EN</button>
            </div>
          </nav>

          <button
            type="button"
            className="lg:hidden flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-gold-accent/30 text-cream"
            aria-label={t('nav.menu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <nav
          id="mobile-nav-menu"
          className={`lg:hidden absolute top-full left-0 right-0 mt-2 overflow-hidden transition-[max-height,opacity,padding,border-color] duration-300 rounded-2xl border border-gold-accent/20 bg-forest-mid/95 shadow-2xl backdrop-blur-xl ${mobileOpen ? 'max-h-[32rem] opacity-100 p-3' : 'max-h-0 opacity-0 p-0 border-transparent'
            }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-end gap-2 pb-1">
              <button type="button" onClick={() => setLang('es')} className={`px-2 py-1 rounded text-xs border ${lang === 'es' ? 'bg-gold-accent text-forest-dark border-gold-accent' : 'text-cream/80 border-white/15'}`}>ES</button>
              <button type="button" onClick={() => setLang('en')} className={`px-2 py-1 rounded text-xs border ${lang === 'en' ? 'bg-gold-accent text-forest-dark border-gold-accent' : 'text-cream/80 border-white/15'}`}>EN</button>
            </div>
            {mobileLinks.map((item) => (
              <Link
                key={item.label}
                className={`block rounded-lg px-3 py-2 text-sm ${isActive(item.to) ? 'text-gold-accent bg-white/5' : 'text-cream/80'} hover:text-gold-accent transition-colors duration-300`}
                href={item.to}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </div>
  )
}

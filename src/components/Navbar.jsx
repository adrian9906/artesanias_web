import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { lang, setLang, t } = useI18n()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const mobileLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/sobre-nosotros' },
    { label: t('nav.orderInfo'), to: '/informacion-de-encargo' },
    { label: t('nav.gallery'), to: '/galeria' },
    { label: t('nav.news'), to: '/noticias' },
    { label: t('nav.order'), to: '/encargos' },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full px-3 md:px-0">
      <header
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-forest-deep/95 backdrop-blur-md border-b rounded-2xl md:rounded-full mt-2 border-white/10 max-w-7xl mx-auto'
            : 'bg-transparent max-w-7xl mx-auto'
        } relative`}
      >
        <div className={`mx-auto px-2 md:px-6 py-3 md:py-4 flex justify-between ${scrolled ? 'gap-4 md:gap-6' : 'gap-3 md:gap-4'} items-center`}>
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-accent/40 to-gold-accent/10 border border-gold-accent/30 shrink-0" />
            <span className="font-display text-sm md:text-lg tracking-wide text-cream truncate">Evergreen Cold Ceramics</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link className={`${isActive('/') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} to="/">{t('nav.home')}</Link>
            <Link className={`${isActive('/sobre-nosotros') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} to="/sobre-nosotros">{t('nav.about')}</Link>
            <Link className={`${isActive('/informacion-de-encargo') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} to="/informacion-de-encargo">{t('nav.orderInfo')}</Link>
            <Link className={`${isActive('/galeria') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} to="/galeria">{t('nav.gallery')}</Link>
            <Link className={`${isActive('/noticias') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`} to="/noticias">{t('nav.news')}</Link>
            <Link className="border border-gold-accent/60 text-gold-light px-5 py-2 rounded-full hover:bg-gold-accent hover:text-forest-deep transition-all duration-300 text-sm" to="/encargos">{t('nav.order')}</Link>
            <div className="inline-flex rounded-full border border-white/15 overflow-hidden">
              <button type="button" onClick={() => setLang('es')} className={`px-2 py-1 text-xs ${lang === 'es' ? 'bg-gold-accent text-forest-dark' : 'text-cream/70'}`}>ES</button>
              <button type="button" onClick={() => setLang('en')} className={`px-2 py-1 text-xs ${lang === 'en' ? 'bg-gold-accent text-forest-dark' : 'text-cream/70'}`}>EN</button>
            </div>
          </nav>

          <button
            type="button"
            className="md:hidden text-cream rounded-lg border border-white/15 px-2 py-1"
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
          className={`md:hidden absolute top-full left-0 right-0 mt-2 overflow-hidden transition-all duration-300 rounded-2xl border border-white/10 bg-forest-deep/95 backdrop-blur-md ${
            mobileOpen ? 'max-h-96 opacity-100 p-3' : 'max-h-0 opacity-0 p-0 border-transparent'
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
                to={item.to}
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

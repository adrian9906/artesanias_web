import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header
        className={`transition-all duration-500 ${scrolled
            ? 'bg-forest-deep/95 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent'
          }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-accent/40 to-gold-accent/10 border border-gold-accent/30" />
            <span className="font-display text-lg tracking-wide text-cream">Evergreen Cold Ceramics</span>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a className="text-cream/70 hover:text-gold-accent transition-colors duration-300" href="#">
              Categorías
            </a>
            <a className="text-cream/70 hover:text-gold-accent transition-colors duration-300" href="#">
              Sobre el Artesano
            </a>
            <a
              className="border border-gold-accent/60 text-gold-light px-6 py-2 rounded-full hover:bg-gold-accent hover:text-forest-deep transition-all duration-300 text-sm"
              href="#"
            >
              Encargar pieza única
            </a>
          </nav>

          <button className="md:hidden text-cream" aria-label="Menú">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>
    </div>
  )
}

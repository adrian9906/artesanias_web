import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Función para verificar si un link está activo
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-[70%] items-center mx-auto ">
      <header
        className={`transition-all duration-500 ${scrolled
          ? 'bg-forest-deep/95 gap-4 backdrop-blur-md border-b py-4 px-6 rounded-full mt-2 border-white/10'
          : 'bg-transparent  py-1 px-2 gap-6'
          }`}
      >
        <div className={`container mx-auto px-6 py-4 flex justify-between ${scrolled ? 'gap-6' : 'gap-4'} items-center`}>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-accent/40 to-gold-accent/10 border border-gold-accent/30" />
            <span className="font-display text-lg tracking-wide text-cream">Evergreen Cold Ceramics</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              className={`${isActive('/') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`}
              to="/"
            >
              Inicio
            </Link>

            <Link
              className={`${isActive('/sobre-nosotros') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`}
              to="/sobre-nosotros"
            >
              Sobre Nosotros
            </Link>

            <Link
              className={`${isActive('/informacion-de-encargo') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`}
              to="/informacion-de-encargo"
            >
              Información de Encargo
            </Link>

            <Link
              className={`${isActive('/galeria') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`}
              to="/galeria"
            >
              Galería
            </Link>

            <Link
              className={`${isActive('/blog') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`}
              to="/blog"
            >
              Blog
            </Link>

            <Link
              className={`${isActive('/noticias') ? 'text-gold-accent' : 'text-cream/70'} hover:text-gold-accent transition-colors duration-300`}
              to="/noticias"
            >
              Noticias
            </Link>

            <Link
              className="border border-gold-accent/60 text-gold-light px-5 py-2 rounded-full hover:bg-gold-accent hover:text-forest-deep transition-all duration-300 text-sm"
              to="#"
            >
              Encargar
            </Link>
          </nav>

          <button className="md:hidden text-cream" aria-label="Menú">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16m-7 6h7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>
    </div>
  );
}
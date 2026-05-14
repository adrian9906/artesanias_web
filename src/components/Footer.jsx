export default function Footer() {
  return (
    <footer className="bg-forest-deep border-t border-white/5 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gold-accent/40 to-gold-accent/10 border border-gold-accent/30" />
              <span className="font-display text-xl text-cream tracking-wide">Evergreen</span>
            </div>
            <p className="text-cream/40 max-w-sm text-sm leading-relaxed font-light">
              Artesanía consciente en porcelana fría. Piezas modeladas con calma y respeto por el proceso creativo.
            </p>
          </div>

          <div>
            <h4 className="text-cream/70 font-bold mb-6 text-xs uppercase tracking-[0.15em]">Navegación</h4>
            <ul className="space-y-4 text-sm text-cream/40">
              {['Colecciones', 'Taller', 'Blog', 'Contacto'].map((link) => (
                <li key={link}>
                  <a className="hover:text-gold-accent transition-colors duration-300" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream/70 font-bold mb-6 text-xs uppercase tracking-[0.15em]">Social</h4>
            <ul className="space-y-4 text-sm text-cream/40">
              {['Instagram', 'Pinterest', 'Facebook'].map((link) => (
                <li key={link}>
                  <a className="hover:text-gold-accent transition-colors duration-300" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/30">
          <div>
            &copy; 2024 Evergreen Cold Ceramics. Todos los derechos reservados.
          </div>
          <div className="flex gap-6">
            {['Política de Privacidad', 'Términos de Servicio'].map((link) => (
              <a key={link} className="hover:text-cream/60 transition-colors duration-300" href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

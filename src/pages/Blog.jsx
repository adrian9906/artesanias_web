const relatedArticles = [
  {
    category: 'Rituales',
    categoryColor: 'text-yellow-600',
    title: 'Cantos de arcilla al amanecer',
    excerpt: 'Descubre cómo los sonidos del bosque influyen en el ritmo del modelado manual.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
  },
  {
    category: 'Técnica',
    categoryColor: 'text-pink-400',
    title: 'Pigmentos de la tierra viva',
    excerpt: 'Una guía sobre la extracción de colores naturales a partir de raíces y líquenes.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80',
  },
  {
    category: 'Inspiración',
    categoryColor: 'text-blue-400',
    title: 'Donde habitan las sombras',
    excerpt: 'Explorando la estética de la melancolía y la belleza en la penumbra del bosque.',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80',
  },
]

export default function Blog() {
  return (
    <div className="relative min-h-screen antialiased selection:bg-yellow-900 selection:text-white bg-forest-dark animate-blurred-fade-in" >
      <div className="fixed inset-0  z-0 pointer-events-none" />

      <div className="relative z-10 pt-32 pb-24">
        <section className="container mx-auto px-6 text-center pt-20 pb-32">
          <h1 className="text-6xl md:text-8xl font-bold text-cream leading-tight drop-shadow-lg max-w-5xl mx-auto font-display">
            El secreto místico <br /> de la porcelana
          </h1>
        </section>

        <section className="container mx-auto px-4 max-w-3xl relative">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: 'rgba(10, 15, 12, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.15), 0 0 40px rgba(212, 175, 55, 0.05)'
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent blur-sm" />

            <div className="flex items-center justify-between border-b border-cream/20 pb-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full object-cover border border-cream/20 bg-gradient-to-br from-gold-accent/30 to-gold-accent/10" />
                <div>
                  <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Escrito por</p>
                  <p className="text-lg font-medium text-cream">Elena Vance</p>
                </div>
              </div>
              <div className="text-right text-sm text-cream/40 uppercase tracking-widest">
                12 oct. 2024 · 8 min de lectura
              </div>
            </div>

            <article className="text-cream/70 font-light leading-relaxed">
              <p className="text-xl mb-6" style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.25rem',
                fontStyle: 'italic'
              }}>
                <span style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '3.5rem',
                  float: 'left',
                  lineHeight: '1',
                  marginRight: '0.5rem',
                  marginTop: '0.2rem',
                  color: '#dfdbca'
                }}>E</span>
                xiste un momento preciso, entre el ocaso y la medianoche, donde el aire del bosque se vuelve más denso, cargado de una humedad eléctrica que solo la luna llena puede invocar. Es en este silencio sagrado donde la porcelana fría de Evergreen comienza su verdadera transformación.
              </p>
              <p className="mb-8">
                La técnica de la porcelana fría, a diferencia de la cerámica tradicional cocida en horno, requiere una paciencia que roza la meditación. No se trata de someter la materia al fuego extremo, sino de permitir que el aire y el tiempo dicten la firmeza final de la pieza. Cada pétalo de magnolia, cada nervadura de hoja de helecho que esculpimos, es una captura de un instante botánico.
              </p>

              <div className="my-12">
                <img
                  alt="Manos esculpiendo flor de porcelana"
                  className="w-full h-auto rounded-lg shadow-2xl object-cover border border-white/5"
                  src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80"
                />
              </div>

              <h2 className="text-3xl font-bold text-cream mb-6 mt-12 font-display">Inspiración en lo Efímero</h2>
              <p className="mb-8">
                Nuestras piezas no buscan la perfección industrial. Buscan la irregularidad del musgo, la asimetría de una rama azotada por el viento y el brillo sutil de la escarcha. Para lograr "El Secreto de la Porcelana", mezclamos pigmentos minerales con esencias botánicas recolectadas en el santuario creativo, asegurando que cada objeto no solo deleite la vista, sino que porte el alma del bosque.
              </p>

              <blockquote className="my-12 py-8 px-12 border-l border-r border-yellow-600/30 italic text-xl text-cream/80 text-center relative" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                <span className="absolute top-4 left-4 text-4xl text-yellow-600/20 leading-none">"</span>
                La cerámica no es solo tierra modelada; es el lenguaje silencioso de la tierra que ha encontrado una forma de hablar a través de nuestras manos.
                <span className="absolute bottom-[-10px] right-4 text-4xl text-yellow-600/20 leading-none">"</span>
              </blockquote>

              <p className="mb-10">
                Al final del proceso, cuando la luna alcanza su cenit, las piezas se dejan reposar en una cámara de curado natural. Allí, protegidas por la penumbra, terminan de exhalar la humedad sobrante, cristalizando para siempre la visión mística de su creador.
              </p>
            </article>

            <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-cream/20">
              {['#ARTESANÍA', '#MISTICISMO', '#NATURALEZA'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-cream/20 text-xs text-cream/60 hover:bg-cream/10 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl mt-48">
          <div className="flex items-center mb-10 space-x-3">
            <svg className="h-6 w-6 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <h3 className="text-3xl font-display text-cream">Relatos Relacionados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((article, i) => (
              <a
                key={i}
                className="rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 group"
                href="#"
                style={{
                  background: 'rgba(10, 15, 12, 0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  boxShadow: 'inset 0 0 40px rgba(212, 175, 55, 0.15), 0 0 40px rgba(212, 175, 55, 0.05)'
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={article.image}
                  />
                </div>
                <div className="p-6">
                  <p className={`text-[10px] uppercase tracking-widest font-semibold mb-2 ${article.categoryColor}`}>
                    {article.category}
                  </p>
                  <h4 className="text-xl font-semibold text-cream mb-3 font-display">{article.title}</h4>
                  <p className="text-sm text-cream/40 line-clamp-2">{article.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
const newsArticles = [
  {
    id: 1,
    category: 'Destacado',
    date: '12 de Octubre, 2024',
    title: 'El Despertar de las Hadas de Invierno',
    excerpt: 'Descubre nuestra nueva colección de figuras místicas inspiradas en el folclore invernal. Cada pieza ha sido modelada...',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    size: 'large',
  },
  {
    id: 2,
    category: 'Taller y Proceso',
    date: '05 de Octubre, 2024',
    title: 'Secretos de la Botánica Prensada',
    excerpt: 'Exploramos la técnica de impresión botánica directa sobre arcilla polimérica para preservar la belleza de los helechos locales.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
    size: 'small',
  },
  {
    id: 3,
    category: 'Inspiración',
    date: '28 de Septiembre, 2024',
    title: 'Amuletos de la Tierra Firme',
    excerpt: '¿Por qué las bellotas y piñas dominan nuestra estética este trimestre? Un viaje por el simbolismo de la protección.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80',
    size: 'small',
  },
  {
    id: 4,
    category: 'Detrás de Escena',
    date: '20 de Septiembre, 2024',
    title: 'La Paciencia de lo Translúcido',
    excerpt: 'El reto de trabajar con pastas cerámicas de alta transparencia y cómo logramos ese acabado de "hielo eterno".',
    image: 'https://images.unsplash.com/photo-1534501437156-c3bb4ae0e45f?w=400&q=80',
    size: 'small',
  },
  {
    id: 5,
    category: 'Sostenibilidad',
    date: '10 de Septiembre, 2024',
    title: 'Compromiso con el Bosque: Reforestación Local',
    excerpt: 'Por cada pieza mística que viaja a un nuevo hogar, plantamos un brote de roble en las colinas que nos vieron nacer...',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80',
    size: 'wide',
  },
]

export default function Noticias() {
  return (
    <div className="relative min-h-screen" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-0" />

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <section className="text-center mb-16 mt-8">
          <h1 className="font-display text-5xl md:text-7xl font-semibold mb-6 tracking-wide text-cream drop-shadow-lg">
            Crónicas del Bosque
          </h1>
          <p className="text-lg md:text-xl text-cream/70 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            Relatos de barro frío, botánica y la magia que habita en las manos de la artesana.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto">
          {newsArticles.map((article) => (
            <article 
              key={article.id}
              className={`glass-card rounded-2xl overflow-hidden flex flex-col md:flex-row p-6 gap-8 transition-transform hover:-translate-y-1 ${
                article.size === 'large' ? 'md:col-span-8' :
                article.size === 'wide' ? 'md:col-span-12 md:flex-row-reverse' :
                'md:col-span-4 flex-col'
              }`}
              style={{
                backgroundColor: 'rgba(15, 20, 15, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div className={`rounded-xl overflow-hidden relative ${
                article.size === 'small' ? 'aspect-[3/2]' : article.size === 'wide' ? 'aspect-video md:w-[55%]' : 'aspect-square md:w-1/2'
              } w-full`}>
                <img 
                  alt={article.title} 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" 
                  src={article.image} 
                />
              </div>
              
              <div className={`flex flex-col justify-center py-4 ${
                article.size === 'small' ? '' : 'md:w-1/2'
              } ${article.size === 'wide' ? 'md:w-[45%]' : ''}`}>
                <div className="text-xs font-semibold tracking-widest text-gold-accent uppercase mb-2">
                  {article.category} <span className="text-cream/40 mx-2">•</span> <span className="text-cream/50">{article.date}</span>
                </div>
                <h2 className={`font-display font-semibold text-cream mb-4 leading-tight ${
                  article.size === 'small' ? 'text-xl' : 'text-3xl md:text-4xl'
                }`}>
                  {article.title}
                </h2>
                <p className="text-cream/60 text-sm md:text-base leading-relaxed mb-6 font-light flex-1">
                  {article.excerpt}
                </p>
                <a 
                  className="inline-flex items-center text-sm font-medium text-cream hover:text-gold-accent transition-colors group mt-auto w-fit" 
                  href="#"
                >
                  {article.size === 'small' ? 'Ver más' : 'Leer crónica'}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </section>

        <div className="flex justify-center items-center mt-16 space-x-6">
          <button 
            className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream transition-colors disabled:opacity-50" 
            disabled
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
          <span className="text-sm font-medium tracking-wide text-cream/60">Página 1 de 4</span>
          <button className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center text-cream/40 hover:text-cream hover:border-cream transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
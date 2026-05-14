import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import InformacionEncargo from './pages/InformacionEncargo'
import Tracking from './pages/Tracking'
import SobreNosotros from './pages/SobreNosotros'
import Encargos from './pages/Encargos'
import Noticias from './pages/Noticias'

const categories = [
  {
    title: 'Jarras de Autor',
    desc: 'Diseños orgánicos únicos que elevan tu mesa diaria.',
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
    cta: 'Ver colección',
  },
  {
    title: 'Funkos Personalizados',
    desc: 'Tus personajes favoritos capturados en porcelana fría.',
    img: 'https://images.unsplash.com/photo-1611597615434-17d0e97c5e79?w=400&q=80',
    cta: 'Saber más',
  },
  {
    title: 'Joyería Botánica',
    desc: 'Naturaleza preservada en piezas de arte para vestir.',
    img: 'https://images.unsplash.com/photo-1515562141589-67f0d0eac004?w=400&q=80',
    cta: 'Explorar',
  },
]

function Hero() {
  return (
    <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-gold-accent/4 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-gold-accent/3 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl pt-24">
        <div className="mb-10 flex justify-center animate-fade-up">
          <div className="relative w-48 h-48 rounded-full border-2 border-gold-accent/60 p-1 gold-glow">
            <div className="w-full h-full rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gold-accent/20 via-forest-mid to-forest-dark" />
            </div>
          </div>
        </div>

        <h1 className="animate-fade-up stagger-2 font-display text-5xl md:text-7xl mb-6 text-cream leading-tight">
          Cerámica fría con <span className="text-gold-light italic">alma artesana</span>
        </h1>

        <p className="animate-fade-up stagger-3 text-cream/60 text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Piezas exclusivas modeladas a mano con acabado en porcelana fría. Diseños que capturan la esencia de la naturaleza en cada detalle.
        </p>

        <a
          className="animate-fade-up stagger-4 inline-block border border-gold-accent/60 text-gold-light px-8 py-3 rounded-full hover:bg-gold-accent hover:text-forest-deep transition-all duration-300 font-medium"
          href="#"
        >
          Encargar pieza única
        </a>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section className="py-24 bg-forest-deep">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-display text-4xl text-cream mb-4">Nuestras Categorías</h2>
          <div className="w-16 h-px bg-gold-accent/60 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="category-card p-10 rounded-xl text-center flex flex-col items-center animate-fade-up"
              style={{ animationDelay: `${0.15 + i * 0.15}s` }}
            >
              <div className="relative w-32 h-32 mb-8 border border-gold-accent/40 p-1 rounded-full gold-glow">
                <img
                  alt={cat.title}
                  className="w-full h-full rounded-full object-cover"
                  src={cat.img}
                />
              </div>
              <h3 className="font-display text-2xl text-cream mb-4">{cat.title}</h3>
              <p className="text-cream/50 mb-8 text-sm leading-relaxed font-light">
                {cat.desc}
              </p>
              <a
                className="mt-auto px-8 py-2 bg-cream text-forest-dark rounded-full text-xs font-bold hover:bg-gold-accent hover:text-white transition-all duration-300"
                href="#"
              >
                {cat.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-forest-dark" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="mb-8 flex justify-center animate-fade-up">
          <div className="w-12 h-12 border border-gold-accent/40 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gold-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <h2 className="animate-fade-up stagger-2 font-display text-4xl text-cream mb-6">¿Tienes una idea en mente?</h2>

        <p className="animate-fade-up stagger-3 text-cream/60 max-w-xl mx-auto mb-10 text-lg font-light">
          Creamos piezas personalizadas que cuentan tu historia. Desde el boceto inicial hasta el último detalle del acabado.
        </p>

        <a
          className="animate-fade-up stagger-4 inline-flex items-center gap-2 border border-gold-accent/60 text-gold-light px-8 py-3 rounded-full hover:bg-gold-accent hover:text-forest-deep transition-all duration-300 group"
          href="#"
        >
          <span>Encargar pieza única</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </a>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <CTABanner />
    </>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/informacion-de-encargo" element={<InformacionEncargo />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/encargos" element={<Encargos />} />
        <Route path="/noticias" element={<Noticias />} />
      </Routes>
    </Layout>
  )
}
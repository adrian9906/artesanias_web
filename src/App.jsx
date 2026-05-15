import { useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Layout from './components/Layout'
import Hero from './components/hero'
import InformacionEncargo from './pages/InformacionEncargo'
import Tracking from './pages/Tracking'
import SobreNosotros from './pages/SobreNosotros'
import Encargos from './pages/Encargos'
import Noticias from './pages/Noticias'
import Blog from './pages/Blog'
import Galeria from './pages/Galeria'

import { Sparkle } from 'lucide-react'

const categories = [
  {
    title: 'Jarras de Autor',
    desc: 'Disenos organicos unicos que elevan tu mesa diaria.',
    story:
      'Cada jarra nace del estudio de formas naturales y termina con acabados que imitan piedra, corteza y musgo. Son piezas para convertir una mesa cotidiana en una escena ritual.',
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    cta: 'Ver coleccion',
  },
  {
    title: 'Funkos Personalizados',
    desc: 'Tus personajes favoritos capturados en porcelana fria.',
    story:
      'Tomamos referencias, bocetos y expresiones clave para modelar versiones unicas de tus personajes. Cada figura conserva personalidad, gesto y narrativa.',
    img: 'https://images.unsplash.com/photo-1611597615434-17d0e97c5e79?w=1200&q=80',
    cta: 'Saber mas',
  },
  {
    title: 'Joyeria Botanica',
    desc: 'Naturaleza preservada en piezas de arte para vestir.',
    story:
      'Flores, hojas y texturas organicas se traducen en joyas ligeras con detalle escultorico. Es una linea pensada para llevar naturaleza contigo todos los dias.',
    img: 'https://images.unsplash.com/photo-1515562141589-67f0d0eac004?w=1200&q=80',
    cta: 'Explorar',
  },
]

function Categories() {
  const sectionRef = useRef(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.categories-title',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.categories-title',
            start: 'top 85%',
          },
        },
      )

      const rows = gsap.utils.toArray('.category-story-row')

      rows.forEach((row) => {
        const story = row.querySelector('.category-story')
        const card = row.querySelector('.category-card-zoom')
        const image = row.querySelector('.category-image')

        gsap.fromTo(
          story,
          { y: 90 },
          {
            y: -90,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )

        gsap.fromTo(
          card,
          { y: -70, scale: 0.85, autoAlpha: 0.7 },
          {
            y: 70,
            scale: 1.08,
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              end: 'bottom 20%',
              scrub: true,
            },
          },
        )

        gsap.fromTo(
          image,
          { scale: 1 },
          {
            scale: 1.15,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-forest-deep overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="categories-title text-center mb-20">
          <h2 className="font-display text-4xl text-cream mb-4">Nuestras Categorias</h2>
          <div className="w-16 h-px bg-gold-accent/60 mx-auto" />
        </div>

        <div className="space-y-28">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="category-story-row grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center"
            >
              <div className="category-story will-change-transform">
                <p className="text-gold-accent/70 uppercase tracking-[0.25em] text-xs mb-4">
                  Categoria {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-cream mb-5">{cat.title}</h3>
                <p className="text-cream/60 text-base leading-relaxed mb-6">{cat.story}</p>
                <p className="text-cream/50 text-sm leading-relaxed">{cat.desc}</p>
              </div>

              <div className="category-card-zoom category-card p-8 md:p-10 rounded-2xl border border-gold-accent/20 bg-forest-mid/70 backdrop-blur-sm will-change-transform">
                <div className="relative h-72 md:h-80 rounded-xl overflow-hidden border border-gold-accent/25">
                  <img
                    alt={cat.title}
                    className="category-image w-full h-full object-cover will-change-transform"
                    src={cat.img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                </div>
                <div className="pt-6">
                  <h4 className="font-display text-2xl text-cream mb-3">{cat.title}</h4>
                  <a
                    className="inline-block px-6 py-2 bg-gold-accent text-forest-dark rounded-full text-xs font-bold hover:bg-gold-light transition-all duration-300"
                    href="#"
                  >
                    {cat.cta}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 mb-[165px]">
      <div className="bg-forest-mid rounded-3xl p-16 md:p-32 text-center relative overflow-hidden mt-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-accent opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-accent opacity-10 rounded-full"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="size-16 bg-gold-accent/30 rounded-full flex items-center justify-center mb-8">
            <Sparkle className="text-gold-accent" size={32} />
          </div>
          <h2 className="font-heading text-4xl text-heading text-cream font-semibold max-w-3xl mb-8">
            Tienes una idea en mente?
          </h2>
          <p className="font-body text-body text-cream font-semibold max-w-xl mb-12">
            Creamos piezas personalizadas que cuentan tu historia. Desde el boceto inicial hasta el ultimo detalle del acabado.
          </p>
          <button className="bg-gold-accent text-cloud-whisper px-[26.4px] hover:bg-gold-light hover:scale-105 py-[14.4px] rounded-full text-button font-button flex items-center gap-2 transition-all duration-300">
            <span className="truncate">Encargar pieza unica</span>
            <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  )
}

const testimonials = [
  {
    name: 'Maria Elena',
    location: 'Ciudad de Mexico',
    text: 'La pieza transformo completamente mi jardin. Es como tener un pedazo del bosque en casa.',
    image: null,
  },
  {
    name: 'Carlos Ruiz',
    location: 'Guadalajara',
    text: 'Llevo este collar todos los dias. Es unico y tiene una energia especial que no puedo explicar.',
    image: null,
  },
  {
    name: 'Ana Sofia',
    location: 'Monterrey',
    text: 'La atencion al detalle es increible. Cada fibra, cada textura esta perfectamente ejecutada.',
    image: null,
  },
]

function Testimonials() {
  return (
    <section className="py-24 bg-forest-dark relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-accent/70">Testimonios</span>
          <h2 className="font-display text-4xl text-cream mt-4 mb-4">Lo que dicen nuestros clientes</h2>
          <div className="w-16 h-px bg-gold-accent/50 mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-gold-accent/10 bg-forest-mid/50"
              style={{ background: 'rgba(15, 36, 22, 0.5)' }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-accent/30 to-gold-accent/10 border border-gold-accent/20" />
                <div>
                  <p className="text-cream font-semibold">{t.name}</p>
                  <p className="text-cream/40 text-xs uppercase tracking-widest">{t.location}</p>
                </div>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed font-light">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/galeria" className="text-gold-accent hover:text-gold-light transition-colors text-sm uppercase tracking-[0.2em]">
            Ver mas testimonios {'->'}
          </a>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <Testimonials />
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
        <Route path="/blog" element={<Blog />} />
        <Route path="/galeria" element={<Galeria />} />
      </Routes>
    </Layout>
  )
}

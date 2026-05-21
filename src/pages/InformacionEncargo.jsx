import { Flower, Moon, FlaskConical, Sparkles, Gem } from "lucide-react";

export default function InformacionEncargo() {
  return (
    <section className="py-20 bg-forest-dark min-h-screen animate-blurred-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl text-cream font-bold mb-4 glow-text-primary tracking-tight">
            Guía de Encargos Místicos
          </h1>
          <h2 className="font-display text-2xl md:text-4xl text-cream mb-8">
            El arte de lo <span className="italic text-evergreen-gold-light">único</span>
          </h2>
          <p className="text-cream/60 max-w-2xl mx-auto text-base leading-relaxed">
            Descubre nuestro proceso de creación para piezas personalizadas. Desde la concepción de la idea hasta la delicada entrega de una obra de arte en cerámica fría, diseñada exclusivamente para ti.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-8 col-span-1 md:col-span-2 relative overflow-hidden group hover:scale-105 transition-transform duration-500 hover:border-evergreen-gold ">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono text-evergreen-gold tracking-widest uppercase">FASE 01</span>
                <Flower className="text-evergreen-gold opacity-80 w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl text-cream mb-3">Concepción &amp; Diseño</h3>
              <p className="text-cream/50 text-sm leading-relaxed pr-12">
                Todo comienza con tu visión. Realizamos una consulta detallada para comprender tus inspiraciones, paleta de colores y el propósito de la pieza. Elaboramos bocetos iniciales y seleccionamos las texturas y motivos botánicos que darán vida a tu encargo.
              </p>
            </div>
            <div className="glass-card rounded-xl p-8 flex flex-col justify-center text-center relative overflow-hidden group hover:border-evergreen-gold hover:scale-105 transition-transform duration-500">
              <Moon className="text-evergreen-gold text-3xl mx-auto mb-4 opacity-80 w-8 h-8" />
              <h3 className="font-display text-xl text-cream mb-2">Compromiso inicial</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                Requerimos un depósito del 50% para agendar tu proyecto y comenzar la fase de diseño.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-8 flex flex-col justify-center text-center relative overflow-hidden group hover:border-evergreen-gold hover:scale-105 transition-transform duration-500">
              <FlaskConical className="text-evergreen-gold text-3xl mx-auto mb-4 opacity-80 w-8 h-8" />
              <h3 className="font-display text-xl text-cream mb-2">Tiempos de creación</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                Cada pieza requiere entre 4 y 6 semanas de meticuloso trabajo manual y curado.
              </p>
            </div>
            <div className="glass-card rounded-xl p-8 col-span-1 md:col-span-2 relative overflow-hidden group hover:border-evergreen-gold hover:scale-105 transition-transform duration-500 flex flex-col justify-center">
              <div className="relative z-10 flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono text-evergreen-gold tracking-widest uppercase mb-1 block">FASE 02</span>
                  <h3 className="font-display text-2xl text-cream mb-3">Modelado &amp; Escultura</h3>
                </div>
                <Sparkles className="text-evergreen-gold mt-2 opacity-80 w-6 h-6" />
              </div>
              <p className="text-cream/70 text-sm leading-relaxed w-full md:w-2/3">
                Nuestros artesanos moldean la porcelana fría a mano, capturando la esencia de la naturaleza en cada detalle. Este proceso requiere paciencia y precisión técnica para asegurar la durabilidad y la estética refinada que nos caracteriza.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-8 relative overflow-hidden group hover:border-evergreen-gold/60 hover:scale-105 transition-transform duration-500">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-3/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-mono text-evergreen-gold tracking-widest uppercase block mb-2">FASE 03</span>
                    <h3 className="font-display text-2xl text-cream mb-3">Acabados &amp; Entrega</h3>
                  </div>
                  <Gem className="text-evergreen-gold text-3xl opacity-80 hidden md:block w-8 h-8" />
                </div>
                <p className="text-cream/50 text-sm leading-relaxed mb-6">
                  Aplicamos pigmentos naturales y selladores protectores. Una vez que la pieza alcanza nuestros estándares de calidad clínica, se empaqueta con materiales sostenibles y se envía asegurada hasta tu puerta.
                </p>
                <div className="flex space-x-3">
                  <span className="text-[10px] font-mono text-evergreen-gold border border-evergreen-gold/30 px-3 py-1 bg-black/30 rounded uppercase tracking-wider">Envío internacional</span>
                  <span className="text-[10px] font-mono text-evergreen-gold border border-evergreen-gold/30 px-3 py-1 bg-black/30 rounded uppercase tracking-wider">Empaque premium</span>
                </div>
              </div>
              <div className="w-full md:w-2/5 mt-6 md:mt-0 flex justify-end relative">
                <Gem className="text-evergreen-gold text-3xl opacity-80 md:hidden absolute -top-12 right-0 w-8 h-8" />
                <img
                  alt="Hand Holding Flowers"
                  className="rounded-lg object-cover w-full max-w-[280px] border border-white/10 shadow-lg"
                  src="/productos/promocion1.jpeg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 glass-card rounded-xl p-12 text-center relative overflow-hidden group hover:border-evergreen-gold/60 hover:scale-105 transition-transform duration-500">
          <div className="absolute inset-0 bg-radial-gradient from-evergreen-gold-glow via-transparent to-transparent opacity-20"></div>
          <h2 className="text-3xl md:text-4xl font-display text-cream mb-4 relative z-10">
            ¿Listo para crear algo <span className="text-evergreen-gold glow-text-primary">extraordinario?</span>
          </h2>
          <p className="text-cream/50 text-sm mb-8 max-w-xl mx-auto relative z-10">
            Nuestro taller tiene cupos limitados cada mes para garantizar la máxima atención al detalle en cada encargo personalizado.
          </p>
          <button className="bg-evergreen-gold hover:bg-evergreen-gold-light text-black text-sm font-semibold uppercase px-8 py-3 transition-all shadow-glow-button hover:shadow-[0_0_25px_rgba(230,193,134,0.7)] relative z-10 rounded flex items-center justify-center mx-auto space-x-2">
            <span>Iniciar solicitud</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
export default function Tracking() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl w-full mx-auto space-y-16 flex-grow">
        <header className="text-center space-y-2 pt-24">
          <p className="font-display text-lg text-cream/60">Evergreen Cold Ceramics</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-wide text-cream">Order Tracking</h1>
        </header>

        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl text-cream">Creation Timeline</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.414 1.414.586 3.414-1.414 3.414H12m8-12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-cream">Modelado</h3>
              <p className="text-sm text-cream/50 leading-tight">Darle forma a tu visión</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4 border border-evergreen-gold" style={{ boxShadow: '0 0 30px rgba(230, 193, 134, 0.5), inset 0 0 15px rgba(230, 193, 134, 0.2)' }}>
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-evergreen-gold" style={{ filter: 'drop-shadow(0 0 12px #E6C186)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-cream">Secado</h3>
              <p className="text-sm text-cream/60 leading-tight mb-4">Curado lento y自然的</p>
              <div className="w-full flex items-center space-x-3 mt-auto">
                <div className="flex-grow h-2 bg-cream/20 rounded-full overflow-hidden">
                  <div className="h-full bg-evergreen-gold rounded-full" style={{ width: '70%', boxShadow: '0 0 15px #E6C186' }}></div>
                </div>
                <span className="text-sm font-medium text-evergreen-gold">70%</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-cream">Pintado</h3>
              <p className="text-sm text-cream/50 leading-tight">Acabados artesanales</p>
            </div>

            <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12 text-cream/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="font-medium text-lg text-cream">Envío</h3>
              <p className="text-sm text-cream/50 leading-tight">Entrega segura</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl text-cream">Commission Details</h2>
          <div className="glass-card rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                alt="Jarra Botánica" 
                className="w-full h-auto aspect-square object-cover rounded-2xl shadow-lg border border-white/10" 
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80" 
              />
            </div>
            <div className="w-full md:w-2/3 space-y-4 pt-2">
              <h3 className="font-display text-3xl font-semibold text-cream">Jarra Botánica</h3>
              <p className="text-cream/60 leading-relaxed">
                Pieza única de cerámica fría con acabados botánicos. Cada detalle refleja la esencia de la naturaleza, creada exclusivamente para ti.
              </p>
              <div className="pt-4 space-y-2">
                <p className="text-lg text-cream/70">Status</p>
                <div className="inline-block rounded-full px-6 py-2 text-cream font-medium border border-evergreen-gold/50" style={{ background: 'rgba(230, 193, 134, 0.1)' }}>
                  In Active Production
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-8 pb-12">
          <button className="rounded-full px-10 py-3 text-lg font-medium tracking-wide text-cream border border-evergreen-gold/50 hover:bg-evergreen-gold/20 transition-all duration-300" style={{ background: 'rgba(230, 193, 134, 0.1)' }}>
            Message Artisan
          </button>
        </div>
      </div>
    </div>
  )
}
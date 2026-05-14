export default function SobreNosotros() {
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ 
      backgroundColor: '#050a06',
      backgroundImage: 'url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    }}>
      <div className="absolute inset-0 bg-[#050a06]/85 z-0" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-cream mb-6 drop-shadow-md">
            Historia de la Artesana Mística
          </h1>
          <p className="max-w-2xl mx-auto text-cream/70 font-light text-base leading-relaxed mb-12">
            Una historia de la artesana nacida bajo un roble ancestral y arcilla. Cada pieza rescata un momento de magia.
          </p>
          <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden border border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300" style={{ boxShadow: '0 0 15px rgba(230, 197, 148, 0.1)' }}>
            <img 
              alt="Mystical Fairy Scene" 
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500 aspect-[4/3] md:aspect-video" 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row items-center gap-12 mb-32">
          <div className="md:w-1/2">
            <span className="text-gold-accent text-sm tracking-widest uppercase mb-2 block font-medium">Nuestra Filosofía</span>
            <h2 className="text-3xl md:text-4xl font-display text-cream mb-6">Consciencia en cada detalle</h2>
            <p className="text-cream/70 font-light leading-relaxed text-base">
              Creemos que cada pieza de cerámica fría es una extensión del alma de quien la crea. Trabajamos con materiales sostenibles y procesos que respetan tanto la naturaleza como la tradición artesanal. Cada creación es una meditación, una conversación entre las manos y la materia.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="rounded-2xl overflow-hidden border border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300 max-w-sm w-full aspect-square" style={{ boxShadow: '0 0 15px rgba(230, 197, 148, 0.1)' }}>
              <img 
                alt="Hand holding mug with flowers" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80" 
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl md:text-4xl font-display text-cream mb-10">El Santuario Creativo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 rounded-2xl overflow-hidden border border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300 relative group aspect-[2/1] bg-black/40" style={{ boxShadow: '0 0 15px rgba(230, 197, 148, 0.1)' }}>
                <img 
                  alt="Pottery Tools" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                  src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80" 
                />
                <div className="absolute inset-0 flex items-end justify-center pb-6 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="text-xl font-display text-cream">Herramientas</h3>
                </div>
              </div>
              
              <div className="rounded-2xl border border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300 flex flex-col items-center justify-center p-6 bg-[#1a1714]/80 aspect-square group hover:bg-[#25211d]/90 transition-colors cursor-pointer" style={{ boxShadow: '0 0 15px rgba(230, 197, 148, 0.1)' }}>
                <svg className="w-12 h-12 text-gold-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
                <h3 className="text-lg font-display text-cream">Texturas</h3>
              </div>
              
              <div className="rounded-2xl border border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300 flex flex-col items-center justify-center p-6 bg-[#1a1714]/80 aspect-square group hover:bg-[#25211d]/90 transition-colors cursor-pointer" style={{ boxShadow: '0 0 15px rgba(230, 197, 148, 0.1)' }}>
                <svg className="w-12 h-12 text-gold-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
                <h3 className="text-lg font-display text-cream">Pigmentos</h3>
              </div>
            </div>
            
            <div className="rounded-2xl overflow-hidden border border-gold-accent/30 hover:border-gold-accent/60 transition-all duration-300 relative group bg-black/40 h-full min-h-[300px]" style={{ boxShadow: '0 0 15px rgba(230, 197, 148, 0.1)' }}>
              <img 
                alt="Pottery on Shelves" 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" 
                src="https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80" 
              />
              <div className="absolute inset-0 flex items-end justify-center pb-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <h3 className="text-2xl font-display text-cream">Proceso Lento</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
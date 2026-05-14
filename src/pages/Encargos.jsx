export default function Encargos() {
  return (
    <div className="min-h-screen relative bg-gray-900">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80")',
          backgroundColor: '#1a202c'
        }}
      />

      <div className="relative z-10 flex items-center justify-center p-6 md:p-12 min-h-screen">
        <div 
          className="border border-amber-500/50 rounded-3xl p-8 md:p-12 max-w-2xl w-full"
          style={{ 
            background: 'rgba(20, 20, 20, 0.65)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 15px rgba(253, 224, 71, 0.4), inset 0 0 10px rgba(253, 224, 71, 0.2)'
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4 tracking-wide" style={{ textShadow: '0 0 10px rgba(253, 224, 71, 0.6)' }}>
              Formulario de Encargo Místico
            </h1>
            <p className="text-gray-300 text-base leading-relaxed max-w-lg mx-auto">
              Da vida a tu visión. Cada pieza de cerámica fría es modelada a mano. Comparte tu idea y trabajaremos juntos para materializarla con alma artesana.
            </p>
          </div>

          <form action="#" className="space-y-6" method="POST">
            <div>
              <label className="block text-sm font-medium text-amber-100 mb-2" htmlFor="fullName">
                Nombre Completo
              </label>
              <input 
                className="w-full bg-[#f4ecd8] text-gray-900 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-gray-500 font-medium" 
                id="fullName" 
                name="fullName" 
                placeholder="Ej. Elara Vance" 
                type="text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-100 mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input 
                className="w-full bg-[#f4ecd8] text-gray-900 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-gray-500 font-medium" 
                id="email" 
                name="email" 
                placeholder="elara@ejemplo.com" 
                type="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-100 mb-2" htmlFor="category">
                Categoría de la Pieza
              </label>
              <select 
                className="w-full text-amber-100 border border-amber-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none appearance-none cursor-pointer bg-transparent"
                id="category" 
                name="category"
                style={{ backgroundColor: 'transparent' }}
              >
                <option className="text-gray-900" disabled selected value="">Selecciona una categoría...</option>
                <option className="text-gray-900" value="jewelry">Joyería</option>
                <option className="text-gray-900" value="sculpture">Escultura</option>
                <option className="text-gray-900" value="decor">Decoración</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-100 mb-2" htmlFor="description">
                Describe tu Idea en Detalle
              </label>
              <textarea 
                className="w-full bg-[#f4ecd8] text-gray-900 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder-gray-500 font-medium resize-none" 
                id="description" 
                name="description" 
                placeholder="Cuéntame sobre los colores, la inspiración, elementos de la naturaleza que deseas incluir..." 
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-100 mb-2">
                Referencias Visuales
              </label>
              <div 
                className="border-2 border-dashed border-amber-600/60 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
                style={{ borderColor: 'rgba(217, 119, 6, 0.6)' }}
              >
                <div className="w-12 h-12 mb-4 opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300 mb-4">Arrastra y suelta imágenes aquí</p>
                <button 
                  className="bg-[#f4ecd8] text-gray-900 font-semibold py-2 px-6 rounded-full text-sm hover:bg-white transition-colors" 
                  type="button"
                >
                  Explorar Archivos
                </button>
                <input className="hidden" id="fileUpload" multiple type="file" />
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button 
                className="text-gray-900 font-bold text-lg py-3 px-10 rounded-full shadow-lg w-full sm:w-auto transition-all duration-300"
                style={{ 
                  background: 'linear-gradient(to right, #d97706, #fbbf24)',
                  boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
                }}
                type="submit"
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
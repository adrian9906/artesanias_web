import { useMemo, useState } from 'react'

const categories = [
  { id: 'jarra', name: 'Jarra de Autor', base: 95, eta: '10-14 dias' },
  { id: 'funko', name: 'Figura Personalizada', base: 140, eta: '14-20 dias' },
  { id: 'joyeria', name: 'Joyeria Botanica', base: 85, eta: '8-12 dias' },
  { id: 'set', name: 'Set Coleccion', base: 220, eta: '18-26 dias' },
]

export default function Encargos() {
  const [category, setCategory] = useState(categories[0].id)
  const [quantity, setQuantity] = useState(1)

  const selectedCategory = categories.find((c) => c.id === category)

  const pricing = useMemo(() => {
    const base = selectedCategory?.base || 0
    const subtotal = base * quantity
    const deposito = Math.round(subtotal * 0.5)

    return { base, subtotal, deposito }
  }, [quantity, selectedCategory])

  return (
    <section className="min-h-screen bg-forest-deep text-[#e3e2e2] pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      {/* todo: implementar el subir fotos */}
      <div className="mx-auto w-full max-w-[1440px] grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="rounded-lg border border-amber-500/50  bg-[#0A0A0A] p-6 md:p-8 space-y-5">
          <div>
            <p className="font-mono text-[10px] tracking-[0.1em] text-[#8b90a0] uppercase">Formulario</p>
            <h1 className="font-bold text-3xl md:text-4xl tracking-[-0.02em] mt-2">Encargar una pieza</h1>
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.08em] text-[#8b90a0] uppercase mb-2">Nombre</label>
            <input className="w-full rounded-md border border-[#333333] bg-[#121414] px-3 py-2 outline-none focus:border-[#0070f3]" type="text" placeholder="Tu nombre" />
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.08em] text-[#8b90a0] uppercase mb-2">Correo</label>
            <input className="w-full rounded-md border border-[#333333] bg-[#121414] px-3 py-2 outline-none focus:border-[#0070f3]" type="email" placeholder="tu@email.com" />
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.08em] text-[#8b90a0] uppercase mb-2">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-[#333333] bg-[#121414] px-3 py-2 outline-none focus:border-[#0070f3]"
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.08em] text-[#8b90a0] uppercase mb-2">Cantidad</label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-md border border-[#333333] bg-[#121414] px-3 py-2 outline-none focus:border-[#0070f3]"
              type="number"
              min="1"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] tracking-[0.08em] text-[#8b90a0] uppercase mb-2">Idea</label>
            <textarea className="w-full min-h-28 rounded-md border border-[#333333] bg-[#121414] px-3 py-2 outline-none focus:border-[#0070f3]" placeholder="Describe tu encargo..." />
          </div>

          <button type="submit" className="w-full rounded-md py-3 font-bold text-white bg-evergreen-gold hover:bg-evergreen-gold/90 transition-colors duration-300">
            Enviar solicitud
          </button>
        </form>

        <aside className="rounded-lg border border-amber-500/50  bg-[#0A0A0A] p-6 md:p-8 h-fit sticky top-24">
          <p className="font-mono text-[10px] tracking-[0.1em] text-[#8b90a0] uppercase mb-3">Precios dinamicos</p>
          <h2 className="text-2xl font-bold mb-4">{selectedCategory?.name}</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md border border-[#414754] bg-[#121414] p-3">
              <span className="text-[#c1c6d7]">Precio base</span>
              <span className="font-bold">${pricing.base}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[#414754] bg-[#121414] p-3">
              <span className="text-[#c1c6d7]">Subtotal</span>
              <span className="font-bold text-[#aec6ff]">${pricing.subtotal}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[#414754] bg-[#121414] p-3">
              <span className="text-[#c1c6d7]">Deposito (50%)</span>
              <span className="font-bold">${pricing.deposito}</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[#414754] bg-[#121414] p-3">
              <span className="text-[#c1c6d7]">Tiempo estimado</span>
              <span className="font-bold">{selectedCategory?.eta}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

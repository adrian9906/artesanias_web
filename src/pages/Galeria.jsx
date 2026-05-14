const portfolio = [
  {
    id: 1,
    title: 'Jarra Botánica de Luna',
    client: 'María Elena',
    description: 'Una pieza commissioned para un jardín zen. Representa la luna llena reflejada en un estanque de lirios.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&q=80',
    category: 'Decoración',
    testimonial: 'La pieza transformó completamente mi jardín. Es como tener un pedazo del bosque en casa.',
    testimonialAuthor: 'María Elena, Cliente',
  },
  {
    id: 2,
    title: 'Collar de Espiral',
    client: 'Carlos Ruiz',
    description: 'Collar personalizado inspirado en spirals naturales, fatto con pigmentos de tierra.',
    image: 'https://images.unsplash.com/photo-1515562141589-67f0d0eac004?w=600&q=80',
    category: 'Joyería',
    testimonial: 'Llevo este collar todos los días. Es único y tiene una energía especial que no puedo explicar.',
    testimonialAuthor: 'Carlos Ruiz, Cliente',
  },
  {
    id: 3,
    title: 'Escultura de Hada Invernal',
    client: 'Ana Sofía',
    description: 'Figura decorativa para una colección privada de hadas y criaturas místicas.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    category: 'Escultura',
    testimonial: 'La atención al detalle es increíble. Cada fibra, cada textura está perfectamente ejecutada.',
    testimonialAuthor: 'Ana Sofía, Cliente',
  },
  {
    id: 4,
    title: 'Set de Tazas Forestales',
    client: 'Roberto Mendoza',
    description: 'Un set de 4 tazas con motivos de hojas y musgo, perfectas para el coleccionista de cerámica.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    category: 'Decoración',
    testimonial: 'Son más bonitas en persona que en fotos. La calidad del trabajo artesanal se nota.',
    testimonialAuthor: 'Roberto Mendoza, Cliente',
  },
  {
    id: 5,
    title: 'Aplique de Pared Floral',
    client: 'Lucía Fernández',
    description: 'Decoración mural con flores preservadas en porcelana fría para un spa natural.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80',
    category: 'Decoración',
    testimonial: 'Los clientes del spa no paran de preguntar dónde lo conseguí. Es una pieza de arte.',
    testimonialAuthor: 'Lucía Fernández, Propietaria de Spa',
  },
  {
    id: 6,
    title: 'Anillo de Raíces',
    client: 'Javier Torres',
    description: 'Anillo artesanal que simula raíces entrelazadas, symbolizeando conexión con la tierra.',
    image: 'https://images.unsplash.com/photo-1611597615434-17d0e97c5e79?w=600&q=80',
    category: 'Joyería',
    testimonial: 'Es un diseño único que no encuentras en ninguna tienda. Exactly lo que buscaba.',
    testimonialAuthor: 'Javier Torres, Cliente',
  },
]

export default function Galeria() {
  return (
    <div className="min-h-screen bg-forest-dark relative">
      <div className="absolute inset-0 noise-overlay" />
      
      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <section className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-cream mb-6">
            Nuestra Galería
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Trabajos únicos creados con alma artesana. Cada pieza cuenta una historia.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {portfolio.map((item) => (
            <div 
              key={item.id}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                <img 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={item.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <span className="text-xs uppercase tracking-widest text-gold-accent bg-forest-dark/80 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-display text-xl font-semibold text-cream mb-1">{item.title}</h3>
                <p className="text-cream/50 text-sm mb-3">Para {item.client}</p>
                <p className="text-cream/60 text-sm font-light line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Casos Exitosos</h2>
            <div className="w-16 h-px bg-gold-accent/50 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.slice(0, 4).map((item, i) => (
              <div 
                key={i}
                className="glass-card rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: 'rgba(20, 20, 20, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(197, 160, 89, 0.2)'
                }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img 
                      alt={item.title} 
                      className="w-full h-40 object-cover rounded-xl"
                      src={item.image}
                    />
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="font-display text-xl text-cream mb-2">{item.title}</h3>
                    <p className="text-cream/40 text-sm mb-4">{item.description}</p>
                    
                    <div className="border-t border-cream/10 pt-4 mt-4">
                      <p className="text-gold-accent text-sm italic mb-2">"{item.testimonial}"</p>
                      <p className="text-cream/50 text-xs uppercase tracking-widest">— {item.testimonialAuthor}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 text-center">
          <div className="glass-card rounded-3xl p-12 max-w-3xl mx-auto" style={{
            background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)',
            border: '1px solid rgba(197, 160, 89, 0.3)'
          }}>
            <h2 className="font-display text-3xl text-cream mb-4">¿Tienes una idea en mente?</h2>
            <p className="text-cream/60 mb-8 max-w-xl mx-auto">
              Cada pieza en esta galería comenzó como una visión única. Tu próxima pieza podría ser la siguiente en nuestra colección.
            </p>
            <a 
              href="/encargos"
              className="inline-block bg-gold-accent text-forest-dark px-8 py-3 rounded-full font-semibold hover:bg-gold-light transition-colors duration-300"
            >
              Crear Tu Pieza
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
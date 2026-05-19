import { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const categories = [
  { id: 'jarra', name: 'Jarra de autor', base: 95, eta: '10-14 días' },
  { id: 'funko', name: 'Figura personalizada', base: 140, eta: '14-20 días' },
  { id: 'joyeria', name: 'Joyería botánica', base: 85, eta: '8-12 días' },
  { id: 'set', name: 'Set colección', base: 220, eta: '18-26 días' },
]

const PricingRow = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between rounded-md border border-[#414754] bg-[#121414] p-3">
    <span className="text-[#c1c6d7]">{label}</span>
    <span className={cn("font-bold", highlight && "text-[#aec6ff]")}>{value}</span>
  </div>
)

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
    <section className="min-h-screen bg-forest-dark text-[#e3e2e2] pt-28 pb-16 px-4 sm:px-6 lg:px-10 animate-blurred-fade-in">
      <div className="mx-auto w-full max-w-[1440px] grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="rounded-lg border border-amber-500/50 bg-[#0A0A0A] p-6 md:p-8 space-y-5">
          <div>
            <p className="text-[10px] tracking-[0.1em] text-[#8b90a0] uppercase">Formulario</p>
            <h1 className="font-bold text-3xl md:text-4xl tracking-[-0.02em] mt-2">Encargar una pieza</h1>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nombre">Nombre</FieldLabel>
              <Input id="nombre" placeholder="Tu nombre" />
            </Field>

            <Field>
              <FieldLabel htmlFor="correo">Correo</FieldLabel>
              <Input id="correo" type="email" placeholder="tu@email.com" />
            </Field>

            <Field>
              <FieldLabel htmlFor="categoria">Categoría</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="cantidad">Cantidad</FieldLabel>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="idea">Idea</FieldLabel>
              <Textarea id="idea" placeholder="Describe tu encargo..." />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full bg-gold-accent text-black hover:bg-gold-light">
            Enviar solicitud
          </Button>
        </form>

        <aside className="rounded-lg border border-amber-500/50 bg-[#0A0A0A] p-6 md:p-8 h-fit sticky top-24">
          <p className="text-[10px] tracking-[0.1em] text-[#8b90a0] uppercase mb-3">Precios dinamicos</p>
          <h2 className="text-2xl font-bold mb-4">{selectedCategory?.name}</h2>

          <div className="flex flex-col gap-3">
            <PricingRow label="Precio base" value={`$${pricing.base}`} />
            <PricingRow label="Subtotal" value={`$${pricing.subtotal}`} highlight />
            <PricingRow label="Deposito (50%)" value={`$${pricing.deposito}`} />
            <PricingRow label="Tiempo estimado" value={selectedCategory?.eta} />
          </div>
        </aside>
      </div>
    </section>
  )
}

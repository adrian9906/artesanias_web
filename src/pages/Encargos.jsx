import { useMemo, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useI18n } from "../i18n"

const staticCategories = [
  { id: 'jarra', base: 95 },
  { id: 'funko', base: 140 },
  { id: 'joyeria', base: 85 },
  { id: 'set', base: 220 },
]

const PricingRow = ({ label, value, highlight = false }) => (
  <div className="flex items-center justify-between rounded-md border border-[#414754] bg-[#121414] p-3">
    <span className="text-[#c1c6d7]">{label}</span>
    <span className={cn("font-bold", highlight && "text-[#aec6ff]")}>{value}</span>
  </div>
)

export default function Encargos() {
  const { t } = useI18n()
  const categories = useMemo(() => {
    const data = t('orderCategoriesData')
    return staticCategories.map((c, i) => ({
      ...c,
      name: data[i]?.name ?? c.id,
      eta: data[i]?.eta ?? '',
    }))
  }, [t])
  const [category, setCategory] = useState(categories[0]?.id ?? 'jarra')
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
            <p className="text-[10px] tracking-[0.1em] text-[#8b90a0] uppercase">{t('orders.form')}</p>
            <h1 className="font-bold text-3xl md:text-4xl tracking-[-0.02em] mt-2">{t('orders.title')}</h1>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nombre">{t('orders.name')}</FieldLabel>
              <Input id="nombre" placeholder={t('orders.name')} />
            </Field>

            <Field>
              <FieldLabel htmlFor="correo">{t('orders.email')}</FieldLabel>
              <Input id="correo" type="email" placeholder={t('orders.email')} />
            </Field>

            <Field>
              <FieldLabel htmlFor="categoria">{t('orders.category')}</FieldLabel>
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
              <FieldLabel htmlFor="cantidad">{t('orders.quantity')}</FieldLabel>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="idea">{t('orders.idea')}</FieldLabel>
              <Textarea id="idea" placeholder={t('orders.idea')} />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full bg-gold-accent text-black hover:bg-gold-light">
            {t('orders.send')}
          </Button>
        </form>

        <aside className="rounded-lg border border-amber-500/50 bg-[#0A0A0A] p-6 md:p-8 h-fit sticky top-24">
          <p className="text-[10px] tracking-[0.1em] text-[#8b90a0] uppercase mb-3">{t('orders.dynamicPricing')}</p>
          <h2 className="text-2xl font-bold mb-4">{selectedCategory?.name}</h2>

          <div className="flex flex-col gap-3">
            <PricingRow label={t('orders.basePrice')} value={`$${pricing.base}`} />
            <PricingRow label={t('orders.subtotal')} value={`$${pricing.subtotal}`} highlight />
            <PricingRow label={t('orders.deposit')} value={`$${pricing.deposito}`} />
            <PricingRow label={t('orders.eta')} value={selectedCategory?.eta} />
          </div>
        </aside>
      </div>
    </section>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Sparkles } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import GalleryUpload from "@/components/admin/GalleryUpload"
import { Card, Field, PrimaryButton, SecondaryButton, TextInput, TextTextarea } from "@/components/admin/ui"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/cms/client"

const emptyPromotion = {
  enabled: false,
  productId: "",
  title: "",
  message: "",
  image: "",
  ctaLabel: "Visitar",
}

export default function PromotionEditor({ promotionId = null }) {
  const router = useRouter()
  const [promotion, setPromotion] = useState(emptyPromotion)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === promotion.productId) || null,
    [products, promotion.productId],
  )

  const load = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      if (promotionId) {
        const data = await api(`/api/admin/promotions/${promotionId}`)
        setPromotion({
          ...emptyPromotion,
          ...(data.promotion || {}),
        })
        setProducts(data.products || [])
      } else {
        const data = await api("/api/admin/promotions")
        setPromotion(emptyPromotion)
        setProducts(data.products || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [promotionId])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const payload = {
        ...promotion,
        image: Array.isArray(promotion.image) ? promotion.image[0] || "" : promotion.image,
      }

      if (promotionId) {
        await api(`/api/admin/promotions/${promotionId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      } else {
        await api("/api/admin/promotions", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      }

      router.push("/admin/promocion")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-cream/50">Cargando editor de promocion…</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Link href="/admin/promocion" className="inline-flex items-center gap-2 text-sm text-cream/55 transition hover:text-cream">
            <ArrowLeft className="size-4" />
            Volver a promociones
          </Link>
          <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-gold-accent/70">Escena promocional</p>
          <h2 className="mt-2 text-3xl font-medium text-cream">
            {promotionId ? "Editar promocion" : "Nueva promocion"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-cream/55">
            Diseña una pieza visual inmersiva con la foto completa, el mensaje sobre la imagen y el boton que lleva al producto.
          </p>
        </div>
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-sm text-cream">{promotion.enabled ? "Promocion activa" : "Promocion en borrador"}</p>
            <p className="text-xs text-cream/45">Solo las activas pueden salir en el catalogo.</p>
          </div>
          <Switch
            checked={promotion.enabled}
            onCheckedChange={(checked) => setPromotion((current) => ({ ...current, enabled: checked }))}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.02fr_.98fr]">
        <Card className="overflow-hidden p-0">
          <div className="relative min-h-[34rem] bg-[#0c150b]">
            {promotion.image ? (
              <>
                <Image
                  src={promotion.image}
                  alt={promotion.title || "Promocion"}
                  fill
                  unoptimized
                  sizes="(max-width: 1280px) 100vw, 48vw"
                  className="scale-110 object-cover opacity-25 blur-2xl"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,7,0.3)_0%,rgba(7,12,7,0.58)_36%,rgba(7,12,7,0.94)_100%)]" />
                <div className="absolute inset-6 rounded-[1.8rem] border border-white/10 bg-black/18 backdrop-blur-[2px]">
                  <Image
                    src={promotion.image}
                    alt={promotion.title || "Promocion"}
                    fill
                    unoptimized
                    sizes="(max-width: 1280px) 100vw, 48vw"
                    className="object-contain p-4"
                  />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,172,162,0.18),transparent_42%),linear-gradient(135deg,#21311d_0%,#0d140c_100%)]" />
            )}

            <div className="relative flex min-h-[34rem] flex-col justify-between p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] text-cream/85 backdrop-blur-md">
                  <Sparkles className="size-3.5" />
                  Nuevo producto
                </span>
                <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs text-cream/80 backdrop-blur-md">
                  Cerrar
                </span>
              </div>

              <div className="max-w-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-gold-light/80">
                  {selectedProduct?.name || "Selecciona un producto"}
                </p>
                <h3 className="mt-3 max-w-lg text-3xl font-semibold leading-tight text-white sm:text-5xl">
                  {promotion.title || "Presenta aqui tu nueva pieza artesanal"}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-cream/85 sm:text-base">
                  {promotion.message || "Escribe un mensaje corto, emocional y directo para invitar al catalogo."}
                </p>
                <div className="mt-6">
                  <span className="inline-flex min-h-12 items-center rounded-full bg-gold-accent px-6 py-3 text-sm font-semibold text-forest-deep shadow-glow-button">
                    {promotion.ctaLabel || "Visitar"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Producto a promocionar">
              <Select
                value={promotion.productId}
                onValueChange={(value) => setPromotion((current) => ({ ...current, productId: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Titular promocional" hint="Este texto se superpone sobre la foto del modal.">
              <TextInput
                value={promotion.title}
                onChange={(event) => setPromotion((current) => ({ ...current, title: event.target.value }))}
                placeholder="Descubre la nueva joya del taller"
              />
            </Field>

            <Field label="Mensaje" hint="Usa una frase breve que introduzca el producto y cree curiosidad.">
              <TextTextarea
                rows={4}
                value={promotion.message}
                onChange={(event) => setPromotion((current) => ({ ...current, message: event.target.value }))}
                placeholder="Una pieza nueva acaba de florecer en el taller y ya esta lista para enamorar."
              />
            </Field>

            <Field label="Texto del boton">
              <TextInput
                value={promotion.ctaLabel}
                onChange={(event) => setPromotion((current) => ({ ...current, ctaLabel: event.target.value }))}
                placeholder="Visitar"
              />
            </Field>

            <GalleryUpload
              label="Foto principal del modal"
              value={promotion.image ? [promotion.image] : []}
              onChange={(images) =>
                setPromotion((current) => ({ ...current, image: Array.isArray(images) ? images[0] || "" : "" }))
              }
            />

            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <SecondaryButton type="button" onClick={() => router.push("/admin/promocion")}>
                Cancelar
              </SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? "Guardando…" : promotionId ? "Guardar cambios" : "Crear promocion"}
              </PrimaryButton>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

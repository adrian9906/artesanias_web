"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, Pencil, Plus } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import AdminBrandIcon from "@/components/admin/AdminBrandIcon"
import { Card, EmptyState, PrimaryButton, SecondaryButton, StatusBadge } from "@/components/admin/ui"
import { Switch } from "@/components/ui/switch"
import { api } from "@/lib/cms/client"

function formatDate(value) {
  if (!value) return "Sin fecha"
  return new Date(value).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export default function PromotionsIndexPage() {
  const [promotions, setPromotions] = useState([])
  const [products, setProducts] = useState([])
  const [selectedId, setSelectedId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [savingId, setSavingId] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api("/api/admin/promotions")
      const nextPromotions = data.promotions || []
      setPromotions(nextPromotions)
      setProducts(data.products || [])
      setSelectedId((current) => current || nextPromotions[0]?.id || "")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 0)
    return () => clearTimeout(timer)
  }, [load])

  const selectedPromotion = useMemo(
    () => promotions.find((promotion) => promotion.id === selectedId) || promotions[0] || null,
    [promotions, selectedId],
  )

  async function togglePromotion(promotion, enabled) {
    setSavingId(promotion.id)
    setError("")
    try {
      const data = await api(`/api/admin/promotions/${promotion.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...promotion,
          enabled,
        }),
      })

      setPromotions((current) =>
        current.map((item) => (item.id === promotion.id ? data.promotion : item)),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold-accent/70">Lanzamientos del catálogo</p>
          <h2 className="mt-2 text-3xl font-medium text-cream">Promociones visuales</h2>
          <p className="mt-2 text-sm leading-7 text-cream/55">
            Selecciona una promoción para verla en grande, actívala con el interruptor y entra al editor cuando quieras cambiar la foto, el texto o el producto.
          </p>
        </div>
        <Link href="/admin/promocion/nueva">
          <PrimaryButton>
            <Plus className="size-4" />
            Nueva promoción
          </PrimaryButton>
        </Link>
      </div>

      {loading && <p className="text-sm text-cream/50">Cargando promociones…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && promotions.length === 0 && (
        <EmptyState
          title="Sin promociones"
          description="Crea la primera promoción para anunciar un producto nuevo en el catálogo."
          action={
            <Link href="/admin/promocion/nueva">
              <PrimaryButton>
                <Plus className="size-4" />
                Crear promoción
              </PrimaryButton>
            </Link>
          }
        />
      )}

      {!loading && !error && promotions.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <div>
                <p className="text-sm text-cream">Lista de promociones</p>
                <p className="text-xs text-cream/45">{promotions.length} creadas · {products.length} productos disponibles</p>
              </div>
            </div>

            <div className="space-y-2">
              {promotions.map((promotion) => {
                const isSelected = selectedPromotion?.id === promotion.id
                return (
                  <div
                    key={promotion.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedId(promotion.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedId(promotion.id)
                      }
                    }}
                    className={`w-full rounded-[1.35rem] border p-3 text-left transition ${
                      isSelected
                        ? "border-gold-accent/35 bg-gold-accent/10 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-[#111a10]">
                        {promotion.image ? (
                          <>
                            <Image
                              src={promotion.image}
                              alt={promotion.title || "Promoción"}
                              fill
                              unoptimized
                              sizes="80px"
                              className="scale-110 object-cover opacity-25 blur-lg"
                            />
                            <Image
                              src={promotion.image}
                              alt={promotion.title || "Promoción"}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-contain p-1.5"
                            />
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-cream/25">
                            <AdminBrandIcon className="size-10" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm uppercase tracking-[0.18em] text-gold-light/80">
                              {promotion.product?.name || "Sin producto"}
                            </p>
                            <h3 className="mt-1 truncate text-base font-medium text-cream">
                              {promotion.title || "Promoción sin titular"}
                            </h3>
                          </div>
                          <div
                            onClick={(event) => event.stopPropagation()}
                            className="flex items-center gap-2"
                          >
                            <Switch
                              checked={promotion.enabled}
                              disabled={savingId === promotion.id}
                              onCheckedChange={(checked) => togglePromotion(promotion, checked)}
                            />
                          </div>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm text-cream/55">
                          {promotion.message || "Sin mensaje todavia."}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusBadge tone={promotion.enabled ? "success" : "warn"}>
                            {promotion.enabled ? "Activa" : "Borrador"}
                          </StatusBadge>
                          <StatusBadge tone={promotion.isRenderable ? "accent" : "neutral"}>
                            {promotion.isRenderable ? "Lista para mostrarse" : "Incompleta"}
                          </StatusBadge>
                          <span className="text-xs text-cream/40">{formatDate(promotion.updatedAt)}</span>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Link href={`/admin/promocion/${promotion.id}`} onClick={(event) => event.stopPropagation()}>
                            <SecondaryButton className="h-9 px-3 text-xs">
                              <Pencil className="size-3.5" />
                              Editar
                            </SecondaryButton>
                          </Link>
                          <span className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 text-xs text-cream/45">
                            <Eye className="size-3.5" />
                            Seleccionada al hacer clic
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            {selectedPromotion ? (
              <div className="relative min-h-[38rem] bg-[#0c150b]">
                {selectedPromotion.image ? (
                  <>
                    <Image
                      src={selectedPromotion.image}
                      alt={selectedPromotion.title || "Promoción"}
                      fill
                      unoptimized
                      sizes="(max-width: 1280px) 100vw, 55vw"
                      className="scale-110 object-cover opacity-25 blur-2xl"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,7,0.26)_0%,rgba(7,12,7,0.5)_32%,rgba(7,12,7,0.92)_100%)]" />
                    <div className="absolute inset-6 rounded-[1.8rem] border border-white/10 bg-black/18 backdrop-blur-[2px]">
                      <Image
                        src={selectedPromotion.image}
                        alt={selectedPromotion.title || "Promoción"}
                        fill
                        unoptimized
                        sizes="(max-width: 1280px) 100vw, 55vw"
                        className="object-contain p-4"
                      />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,172,162,0.18),transparent_42%),linear-gradient(135deg,#21311d_0%,#0d140c_100%)]" />
                )}

                <div className="relative flex min-h-[38rem] flex-col justify-between p-5 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-cream/90 backdrop-blur-md">
                      Nuevo producto
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge tone={selectedPromotion.enabled ? "success" : "warn"}>
                        {selectedPromotion.enabled ? "Activa" : "Borrador"}
                      </StatusBadge>
                      <Link href={`/admin/promocion/${selectedPromotion.id}`}>
                        <SecondaryButton className="h-10 bg-black/35 text-cream hover:bg-black/55">
                          <Pencil className="size-4" />
                          Editar
                        </SecondaryButton>
                      </Link>
                    </div>
                  </div>

                  <div className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.22em] text-gold-light/85">
                      {selectedPromotion.product?.name || "Pieza destacada"}
                    </p>
                    <h3 className="mt-3 font-display text-4xl leading-tight text-white md:text-6xl">
                      {selectedPromotion.title || "Promoción sin titular"}
                    </h3>
                    <p className="mt-4 max-w-xl text-base leading-8 text-cream/85 md:text-lg">
                      {selectedPromotion.message || "Esta promoción aún no tiene un mensaje escrito."}
                    </p>
                    <div className="mt-7">
                      <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold-accent px-7 py-3 text-sm font-semibold text-forest-deep shadow-glow-button">
                        {selectedPromotion.ctaLabel || "Visitar"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      )}
    </div>
  )
}

"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import GalleryUpload from "@/components/admin/GalleryUpload"
import Modal from "@/components/admin/Modal"
import {
  Card,
  DangerButton,
  EmptyState,
  Field,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  TextInput,
  TextTextarea,
} from "@/components/admin/ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatPrice } from "@/lib/cms/constants"
import { api } from "@/lib/cms/client"

const emptyForm = {
  name: "",
  description: "",
  price: "",
  currency: "USD",
  elaborationTime: "",
  photos: [],
  sectionId: "",
  inStock: true,
  stockQty: 0,
  variants: [],
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api("/api/admin/products")
      setProducts(data.products || [])
      setSections(data.sections || [])
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

  function openCreate() {
    setEditing(null)
    setForm({
      ...emptyForm,
      sectionId: sections[0]?.id || "",
    })
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(product) {
    setEditing(product)
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      currency: product.currency || "USD",
      elaborationTime: product.elaborationTime || "",
      photo: product.photo || "",
      sectionId: product.sectionId || "",
      inStock: product.inStock !== false,
      stockQty: product.stockQty ?? 0,
      photos: Array.isArray(product.photos) && product.photos.length
        ? product.photos
        : product.photo
          ? [product.photo]
          : [],
      variants: (product.variants || []).map((variant) => ({
        name: variant.name || "",
        price: variant.price ?? "",
        photo: variant.photo || "",
      })),
    })
    setFormError("")
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setFormError("")
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        inStock: form.inStock,
        stockQty: Number(form.stockQty) || 0,
        photos: (form.photos || []).filter(Boolean),
        variants: (form.variants || [])
          .map((variant) => ({
            name: variant.name,
            price: Number(variant.price),
            photo: form.inStock ? variant.photo : "",
          }))
          .filter((variant) => variant.name && !Number.isNaN(variant.price)),
      }
      if (editing) {
        await api(`/api/admin/products/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      } else {
        await api("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        })
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar el producto “${product.name}”?`)) return
    try {
      await api(`/api/admin/products/${product.id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-cream/55">
          Gestiona nombre, descripción, precio, tiempo de elaboración, foto y sección de cada producto.
        </p>
        <PrimaryButton onClick={openCreate} disabled={sections.length === 0}>
          <Plus className="size-4" />
          Nuevo producto
        </PrimaryButton>
      </div>

      {sections.length === 0 && !loading && (
        <Card>
          <p className="text-sm text-cream/70">
            Primero crea al menos una{" "}
            <a href="/admin/secciones" className="text-gold-light underline">
              sección
            </a>{" "}
            para poder asignar productos.
          </p>
        </Card>
      )}

      {loading && <p className="text-sm text-cream/50">Cargando productos…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && products.length === 0 && sections.length > 0 && (
        <EmptyState
          title="Sin productos"
          description="Crea el primer producto del catálogo y asígnalo a una sección."
          action={
            <PrimaryButton onClick={openCreate}>
              <Plus className="size-4" />
              Crear producto
            </PrimaryButton>
          }
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden p-0">
            <div className="relative h-44 bg-white/5">
              {product.photo ? (
                <img src={product.photo} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-cream/30">Sin foto</div>
              )}
              {Array.isArray(product.photos) && product.photos.length > 1 && (
                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-cream">
                  {product.photos.length} fotos
                </span>
              )}
            </div>
            <div className="space-y-3 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-gold-accent/80">
                  {product.sectionName}
                </p>
                <h3 className="mt-1 text-lg font-medium text-cream">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-cream/55">{product.description}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gold-light">
                  {formatPrice(product.price, product.currency)}
                </span>
                <StatusBadge tone={product.inStock === false ? "warn" : "success"}>
                  {product.inStock === false ? "Encargo" : product.stockQty > 0 ? `En stock · ${product.stockQty}` : "En stock"}
                </StatusBadge>
              </div>
              {Array.isArray(product.variants) && product.variants.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-cream/50">
                  {product.variants.map((variant) => (
                    <span
                      key={variant.id}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5"
                    >
                      {variant.name}: {formatPrice(variant.price, product.currency)}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 border-t border-white/10 pt-3">
                <SecondaryButton className="flex-1" onClick={() => openEdit(product)}>
                  <Pencil className="size-3.5" />
                  Editar
                </SecondaryButton>
                <DangerButton onClick={() => handleDelete(product)}>
                  <Trash2 className="size-3.5" />
                </DangerButton>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar producto" : "Nuevo producto"}
        wide
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <TextInput
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nombre del producto"
              />
            </Field>
            <Field label="Sección">
              <Select
                value={form.sectionId}
                onValueChange={(value) => setForm((f) => ({ ...f, sectionId: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una sección" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Descripción">
            <TextTextarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descripción del producto"
              rows={3}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Precio">
              <TextInput
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="15"
              />
            </Field>
            <Field label="Moneda">
              <Select
                value={form.currency}
                onValueChange={(value) => setForm((f) => ({ ...f, currency: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="CUP">CUP</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tiempo de elaboración">
              <TextInput
                value={form.elaborationTime}
                onChange={(e) => setForm((f) => ({ ...f, elaborationTime: e.target.value }))}
                placeholder="10–14 días"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Estado de stock">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, inStock: true }))}
                  className={`h-10 flex-1 rounded-xl border px-3 text-sm transition ${
                    form.inStock
                      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-100"
                      : "border-white/10 bg-white/5 text-cream/50"
                  }`}
                >
                  En stock
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, inStock: false }))}
                  className={`h-10 flex-1 rounded-xl border px-3 text-sm transition ${
                    !form.inStock
                      ? "border-red-400/50 bg-red-500/15 text-red-100"
                      : "border-white/10 bg-white/5 text-cream/50"
                  }`}
                >
                  Encargo
                </button>
              </div>
            </Field>
            <Field label="Cantidad disponible">
              <TextInput
                type="number"
                min="0"
                step="1"
                disabled={!form.inStock}
                value={form.stockQty}
                onChange={(e) => setForm((f) => ({ ...f, stockQty: e.target.value }))}
                placeholder="10"
              />
            </Field>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="block text-sm text-cream/70">Variantes con precio</span>
              <SecondaryButton
                type="button"
                className="h-8 px-3 text-xs"
                onClick={() =>
                  setForm((f) => ({ ...f, variants: [...(f.variants || []), { name: "", price: "", photo: "" }] }))
                }
              >
                <Plus className="size-3.5" />
                Añadir
              </SecondaryButton>
            </div>
            {(form.variants || []).length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 px-3 py-3 text-xs text-cream/40">
                Sin variantes. El producto usará su precio base.
              </p>
            ) : (
              <div className="space-y-2">
                {(form.variants || []).map((variant, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.02] p-2">
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <TextInput
                          value={variant.name}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              variants: (f.variants || []).map((v, i) =>
                                i === index ? { ...v, name: e.target.value } : v,
                              ),
                            }))
                          }
                          placeholder="Tamaño / color"
                        />
                        <TextInput
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              variants: (f.variants || []).map((v, i) =>
                                i === index ? { ...v, price: e.target.value } : v,
                              ),
                            }))
                          }
                          placeholder="Precio"
                        />
                      </div>
                      <DangerButton
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            variants: (f.variants || []).filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </DangerButton>
                    </div>

                    {form.inStock && (form.photos || []).length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1.5 text-xs text-cream/50">Enlazar foto de esta variante</p>
                        <div className="flex flex-wrap gap-2">
                          {(form.photos || []).map((photo, photoIndex) => (
                            <button
                              key={photoIndex}
                              type="button"
                              onClick={() =>
                                setForm((f) => ({
                                  ...f,
                                  variants: (f.variants || []).map((v, i) =>
                                    i === index ? { ...v, photo: variant.photo === photo ? "" : photo } : v,
                                  ),
                                }))
                              }
                              className={`h-12 w-12 overflow-hidden rounded-lg border-2 transition ${
                                variant.photo === photo
                                  ? "border-gold-accent ring-2 ring-gold-accent/30"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                              aria-label={`Usar foto ${photoIndex + 1}`}
                            >
                              <img src={photo} alt="" className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <GalleryUpload
            label="Fotos del producto"
            value={form.photos}
            onChange={(photos) => setForm((f) => ({ ...f, photos }))}
          />

          {formError && <p className="text-sm text-red-300">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear producto"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}

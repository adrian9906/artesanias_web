"use client"

import { Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import Modal from "@/components/admin/Modal"
import {
  Card,
  DangerButton,
  EmptyState,
  Field,
  PrimaryButton,
  SecondaryButton,
  TextInput,
} from "@/components/admin/ui"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/cms/constants"
import { api } from "@/lib/cms/client"

const emptyForm = { image: "", portrait: true, alt: "" }

export default function AdminGalleryPage() {
  const [items, setItems] = useState([])
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
      const data = await api("/api/admin/gallery")
      setItems(data.gallery || [])
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
    setForm(emptyForm)
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setForm({ image: item.image, portrait: item.portrait, alt: item.alt || "" })
    setFormError("")
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.image.trim()) {
      setFormError("Sube o pega una imagen.")
      return
    }
    setSaving(true)
    setFormError("")
    try {
      const payload = { image: form.image, portrait: form.portrait, alt: form.alt }
      if (editing) {
        await api(`/api/admin/gallery/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
      } else {
        await api("/api/admin/gallery", {
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

  async function handleDelete(item) {
    if (!window.confirm("¿Eliminar esta imagen de la galería?")) return
    try {
      await api(`/api/admin/gallery/${item.id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-cream/55">
            Sube o pega las imágenes que se muestran en la galería pública. Añade una por cada entrada.
          </p>
        </div>
        <PrimaryButton onClick={openCreate}>
          <Plus className="size-4" />
          Añadir imagen
        </PrimaryButton>
      </div>

      {loading && <p className="text-sm text-cream/50">Cargando galería…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Galería vacía"
          description="Sube la primera foto para mostrarla en la página de galería."
          action={
            <PrimaryButton onClick={openCreate}>
              <Plus className="size-4" />
              Añadir imagen
            </PrimaryButton>
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className={cn("p-3", item.portrait ? "row-span-2" : "")}>
              <img
                src={item.image}
                alt={item.alt || "Imagen de la galería"}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] text-cream/45">
                  {item.portrait ? "Vertical" : "Horizontal"} · {formatDate(item.createdAt)}
                </span>
              </div>
              <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
                <SecondaryButton className="flex-1" onClick={() => openEdit(item)}>
                  Editar
                </SecondaryButton>
                <DangerButton onClick={() => handleDelete(item)}>
                  <Trash2 className="size-3.5" />
                </DangerButton>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar imagen" : "Añadir imagen a la galería"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Imagen" hint="Sube un archivo o pega una URL /uploads/... o https://">
            <input
              type="url"
              required
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="Pega aquí la URL de la imagen"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-cream outline-none placeholder:text-cream/30 focus:border-gold-accent/40"
            />
          </Field>

          <Field label="Subir desde el equipo">
            <div>
              <SecondaryButton
                type="button"
                onClick={() => document.getElementById("gal-uploader")?.click()}
              >
                Elegir archivo
              </SecondaryButton>
              <input
                id="gal-uploader"
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const fd = new FormData()
                  fd.append("file", file)
                  try {
                    const data = await fetch("/api/admin/upload", { method: "POST", body: fd }).then((r) => r.json())
                    if (data.url) setForm((f) => ({ ...f, image: data.url }))
                  } catch {
                    /* silencioso */
                  }
                  e.currentTarget.value = ""
                }}
              />
            </div>
          </Field>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-cream/70">Orientación</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, portrait: true }))}
                className={cn(
                  "min-h-10 flex-1 rounded-xl border px-4 text-sm font-medium transition",
                  form.portrait
                    ? "border-gold-accent bg-gold-accent text-forest-deep"
                    : "border-white/15 bg-white/5 text-cream/70",
                )}
              >
                Vertical (9:16)
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, portrait: false }))}
                className={cn(
                  "min-h-10 flex-1 rounded-xl border px-4 text-sm font-medium transition",
                  !form.portrait
                    ? "border-gold-accent bg-gold-accent text-forest-deep"
                    : "border-white/15 bg-white/5 text-cream/70",
                )}
              >
                Horizontal (16:9)
              </button>
            </div>
          </div>

          <Field label="Texto alternativo (opcional)">
            <TextInput
              value={form.alt}
              onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
              placeholder="Descripción breve de la foto"
            />
          </Field>

          {formError && <p className="text-sm text-red-300">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Añadir imagen"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}
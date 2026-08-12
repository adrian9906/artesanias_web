"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Modal from "@/components/admin/Modal"
import ImageUpload from "@/components/admin/ImageUpload"
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
import { Switch } from "@/components/ui/switch"
import {
  FEEDBACK_STATUSES,
  FEEDBACK_TYPES,
  feedbackStatusLabel,
  feedbackTypeLabel,
  formatDate,
} from "@/lib/cms/constants"
import { api } from "@/lib/cms/client"

const emptyForm = {
  type: "opinion",
  name: "",
  location: "",
  photo: "",
  text: "",
  status: "published",
  origin: "admin",
  featuredOnHome: true,
  homeOrder: 0,
}

export default function AdminFeedbackPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api("/api/admin/feedback")
      setItems(data.items || [])
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

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false
      if (statusFilter !== "all" && item.status !== statusFilter) return false
      return true
    })
  }, [items, statusFilter, typeFilter])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditing(item)
    setForm({
      type: item.type || "opinion",
      name: item.name || "",
      location: item.location || "",
      photo: item.photo || "",
      text: item.text || "",
      status: item.status || "published",
      origin: item.origin || "admin",
      featuredOnHome: item.featuredOnHome !== false,
      homeOrder: item.homeOrder || 0,
    })
    setFormError("")
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setFormError("")
    try {
      if (editing) {
        await api(`/api/admin/feedback/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        })
      } else {
        await api("/api/admin/feedback", {
          method: "POST",
          body: JSON.stringify(form),
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
    if (!window.confirm(`Eliminar este mensaje de ${item.name}?`)) return
    try {
      await api(`/api/admin/feedback/${item.id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-3xl text-sm text-cream/55">
          Revisa opiniones, experiencias y testimonios enviados desde la web, y agrega testimonios manuales para
          destacarlos en el inicio o en la página de opiniones.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[170px]" aria-label="Filtrar por tipo">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {FEEDBACK_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]" aria-label="Filtrar por estado">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {FEEDBACK_STATUSES.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PrimaryButton onClick={openCreate}>
            <Plus className="size-4" />
            Nueva voz
          </PrimaryButton>
        </div>
      </div>

      {loading && <p className="text-sm text-cream/50">Cargando voces…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="Sin voces en este filtro"
          description="Los mensajes que lleguen desde la página de opiniones aparecerán aquí para revisarlos."
          action={
            <PrimaryButton onClick={openCreate}>
              <Plus className="size-4" />
              Crear primera voz
            </PrimaryButton>
          }
        />
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        {filtered.map((item) => (
          <Card key={item.id} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="accent">{feedbackTypeLabel(item.type)}</StatusBadge>
              <StatusBadge tone={item.status === "published" ? "success" : "warn"}>
                {feedbackStatusLabel(item.status)}
              </StatusBadge>
              <StatusBadge tone="neutral">{item.origin === "public" ? "Recibido" : item.origin}</StatusBadge>
              {item.type === "testimonial" && item.featuredOnHome && (
                <StatusBadge tone="success">Visible en inicio</StatusBadge>
              )}
            </div>

            <div className="flex items-start gap-4">
              {item.type === "testimonial" && item.photo && (
                <img src={item.photo} alt="" className="size-14 shrink-0 rounded-full object-cover ring-1 ring-gold-accent/30" />
              )}
              <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-medium text-cream">{item.name}</h3>
                <span className="text-xs text-cream/40">{formatDate(item.createdAt)}</span>
              </div>
              {item.location && <p className="mt-1 text-xs text-gold-light/65">{item.location}</p>}
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{item.text}</p>
              </div>
            </div>

            <div className="flex gap-2 border-t border-white/10 pt-3">
              <SecondaryButton className="flex-1" onClick={() => openEdit(item)}>
                <Pencil className="size-3.5" />
                Editar
              </SecondaryButton>
              <DangerButton onClick={() => handleDelete(item)}>
                <Trash2 className="size-3.5" />
              </DangerButton>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar voz" : "Nueva voz"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo">
              <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Estado">
              <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_STATUSES.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Nombre">
            <TextInput
              value={form.name}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
              placeholder="Nombre visible o Anónimo"
            />
          </Field>

          {form.type === "testimonial" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-cream">Mostrar en el inicio</p>
                    <p className="mt-1 text-xs text-cream/45">Solo los testimonios publicados y activados aparecen en la portada.</p>
                  </div>
                  <Switch
                    checked={form.featuredOnHome}
                    onCheckedChange={(checked) => setForm((current) => ({ ...current, featuredOnHome: checked }))}
                    aria-label="Mostrar testimonio en el inicio"
                  />
                </div>
              </div>

              <ImageUpload
                value={form.photo}
                onChange={(photo) => setForm((current) => ({ ...current, photo }))}
                label="Foto de la persona"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ubicación">
                  <TextInput
                    value={form.location}
                    onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
                    placeholder="Ej. La Habana"
                  />
                </Field>
                <Field label="Orden en el inicio" hint="0 aparece primero; después 1, 2, 3...">
                  <TextInput
                    type="number"
                    min="0"
                    value={form.homeOrder}
                    onChange={(e) => setForm((current) => ({ ...current, homeOrder: e.target.value }))}
                  />
                </Field>
              </div>
            </div>
          )}

          <Field label="Mensaje">
            <TextTextarea
              required
              rows={6}
              value={form.text}
              onChange={(e) => setForm((current) => ({ ...current, text: e.target.value }))}
              placeholder="Escribe la opinión, experiencia o testimonio"
            />
          </Field>

          {formError && <p className="text-sm text-red-300">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear voz"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}

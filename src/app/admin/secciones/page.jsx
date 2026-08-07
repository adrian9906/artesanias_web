"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"
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
  TextTextarea,
} from "@/components/admin/ui"
import { formatDate } from "@/lib/cms/constants"
import { api } from "@/lib/cms/client"

const emptyForm = { name: "", description: "" }

export default function AdminSectionsPage() {
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
      const data = await api("/api/admin/sections")
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
    setForm(emptyForm)
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(section) {
    setEditing(section)
    setForm({ name: section.name, description: section.description || "" })
    setFormError("")
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setFormError("")
    try {
      if (editing) {
        await api(`/api/admin/sections/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        })
      } else {
        await api("/api/admin/sections", {
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

  async function handleDelete(section) {
    if (!window.confirm(`¿Eliminar la sección “${section.name}”?`)) return
    try {
      await api(`/api/admin/sections/${section.id}`, { method: "DELETE" })
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
            Las secciones agrupan productos del catálogo (por ejemplo jarras, figuras o aretes).
          </p>
        </div>
        <PrimaryButton onClick={openCreate}>
          <Plus className="size-4" />
          Nueva sección
        </PrimaryButton>
      </div>

      {loading && <p className="text-sm text-cream/50">Cargando secciones…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && sections.length === 0 && (
        <EmptyState
          title="Sin secciones todavía"
          description="Crea la primera sección para poder asignar productos del catálogo."
          action={
            <PrimaryButton onClick={openCreate}>
              <Plus className="size-4" />
              Crear sección
            </PrimaryButton>
          }
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.id} className="flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-medium text-cream">{section.name}</h3>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-cream/60">
                  {section.productCount} producto{section.productCount === 1 ? "" : "s"}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-cream/55">
                {section.description || "Sin descripción"}
              </p>
              <p className="mt-3 text-[11px] text-cream/35">Actualizada {formatDate(section.updatedAt)}</p>
            </div>
            <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
              <SecondaryButton className="flex-1" onClick={() => openEdit(section)}>
                <Pencil className="size-3.5" />
                Editar
              </SecondaryButton>
              <DangerButton onClick={() => handleDelete(section)}>
                <Trash2 className="size-3.5" />
              </DangerButton>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar sección" : "Nueva sección"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Nombre">
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Jarras de autor"
            />
          </Field>
          <Field label="Descripción">
            <TextTextarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Breve descripción de la colección o línea"
              rows={4}
            />
          </Field>
          {formError && <p className="text-sm text-red-300">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear sección"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}

"use client"

import { Pencil, Plus, Trash2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import ImageUpload from "@/components/admin/ImageUpload"
import Modal from "@/components/admin/Modal"
import RichTextEditor from "@/components/admin/RichTextEditor"
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
import { categoryLabel, formatDate, POST_CATEGORIES, POST_STATUSES } from "@/lib/cms/constants"
import { api } from "@/lib/cms/client"

const emptyForm = {
  title: "",
  category: "noticia",
  excerpt: "",
  coverImage: "",
  body: "",
  author: "Equipo Thay Art",
  status: "draft",
}

export default function AdminNewsPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api("/api/admin/posts")
      setPosts(data.posts || [])
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
    if (filter === "all") return posts
    return posts.filter((post) => post.category === filter)
  }, [posts, filter])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError("")
    setModalOpen(true)
  }

  function openEdit(post) {
    setEditing(post)
    setForm({
      title: post.title || "",
      category: post.category || "noticia",
      excerpt: post.excerpt || "",
      coverImage: post.coverImage || "",
      body: post.body || "",
      author: post.author || "Equipo Thay Art",
      status: post.status || "draft",
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
        await api(`/api/admin/posts/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        })
      } else {
        await api("/api/admin/posts", {
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

  async function handleDelete(post) {
    if (!window.confirm(`¿Eliminar “${post.title}”?`)) return
    try {
      await api(`/api/admin/posts/${post.id}`, { method: "DELETE" })
      await load()
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-sm text-cream/55">
          Crea blogs, noticias y talleres con un editor CMS: negrita, cursiva, tipografías, títulos, listas y
          más.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]" aria-label="Filtrar por categoría">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {POST_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <PrimaryButton onClick={openCreate}>
            <Plus className="size-4" />
            Nueva publicación
          </PrimaryButton>
        </div>
      </div>

      {loading && <p className="text-sm text-cream/50">Cargando publicaciones…</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          title="Sin publicaciones"
          description="Crea un blog, una noticia o un taller con el editor enriquecido."
          action={
            <PrimaryButton onClick={openCreate}>
              <Plus className="size-4" />
              Crear publicación
            </PrimaryButton>
          }
        />
      )}

      <div className="space-y-3">
        {filtered.map((post) => (
          <Card key={post.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-white/5 sm:h-20 sm:w-28">
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-cream/30">Sin portada</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <StatusBadge tone="accent">{categoryLabel(post.category)}</StatusBadge>
                <StatusBadge tone={post.status === "published" ? "success" : "warn"}>
                  {post.status === "published" ? "Publicado" : "Borrador"}
                </StatusBadge>
                <span className="text-[11px] text-cream/40">
                  {formatDate(post.publishedAt || post.updatedAt || post.createdAt)}
                </span>
              </div>
              <h3 className="truncate text-base font-medium text-cream">{post.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-cream/50">{post.excerpt || "Sin extracto"}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <SecondaryButton onClick={() => openEdit(post)}>
                <Pencil className="size-3.5" />
                Editar
              </SecondaryButton>
              <DangerButton onClick={() => handleDelete(post)}>
                <Trash2 className="size-3.5" />
              </DangerButton>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar publicación" : "Nueva publicación"}
        wide
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Título">
            <TextInput
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Título del artículo, noticia o taller"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Categoría">
              <Select
                value={form.category}
                onValueChange={(value) => setForm((f) => ({ ...f, category: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Estado">
              <Select
                value={form.status}
                onValueChange={(value) => setForm((f) => ({ ...f, status: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_STATUSES.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Autor">
              <TextInput
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Equipo Thay Art"
              />
            </Field>
          </div>

          <Field label="Extracto / resumen">
            <TextTextarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Texto corto para listados y previews"
              rows={2}
            />
          </Field>

          <ImageUpload
            label="Imagen de portada"
            value={form.coverImage}
            onChange={(coverImage) => setForm((f) => ({ ...f, coverImage }))}
          />

          <div className="space-y-1.5">
            <span className="block text-sm text-cream/70">Contenido (editor CMS)</span>
            <RichTextEditor
              value={form.body}
              onChange={(body) => setForm((f) => ({ ...f, body }))}
              placeholder="Escribe el cuerpo del artículo. Usa negrita, tipografías, títulos, listas…"
            />
          </div>

          {formError && <p className="text-sm text-red-300">{formError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <SecondaryButton type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear publicación"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </div>
  )
}

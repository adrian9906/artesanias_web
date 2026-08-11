"use client"

import { ImagePlus, Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

export default function GalleryUpload({ value, onChange, label = "Fotos", className }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const photos = Array.isArray(value) ? value : []

  async function uploadFiles(files) {
    if (!files || files.length === 0) return
    setError("")
    setUploading(true)
    try {
      const urls = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error al subir")
        urls.push(data.url)
      }
      onChange([...photos, ...urls])
    } catch (err) {
      setError(err.message || "No se pudieron subir las imágenes")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function remove(index) {
    onChange(photos.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-cream/70">{label}</p>
      <div className="flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-white/5"
          >
            <img src={photo} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-cream hover:bg-black/80"
              aria-label="Quitar imagen"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-white/5 text-cream/40 transition hover:bg-white/10 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-[11px]">{uploading ? "Guardando…" : "Elegir"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files)}
      />
      <p className="text-xs leading-5 text-cream/40">Puedes elegir varias fotos a la vez.</p>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  )
}

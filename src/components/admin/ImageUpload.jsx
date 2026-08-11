"use client"

import { ImagePlus, Loader2, X } from "lucide-react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

export default function ImageUpload({ value, onChange, label = "Foto", className }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file) {
    if (!file) return
    setError("")
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al subir")
      onChange(data.url)
    } catch (err) {
      setError(err.message || "No se pudo subir la imagen")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm text-cream/70">{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/5 sm:w-48">
          {value ? (
            <>
              <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-cream hover:bg-black/80"
                aria-label="Quitar imagen"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center text-cream/40">
              <ImagePlus className="size-6" />
              <span className="text-xs">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gold-accent/30 bg-gold-accent/10 px-4 text-sm text-gold-light transition hover:bg-gold-accent/20 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            {uploading ? "Guardando…" : value ? "Cambiar imagen" : "Elegir imagen"}
          </button>
          <p className="text-xs leading-5 text-cream/40">Elige una foto guardada en tu equipo.</p>
          {error && <p className="text-xs text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  )
}

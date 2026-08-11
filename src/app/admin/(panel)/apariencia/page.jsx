"use client"

import { Check, Palette } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import AdminBrandIcon from "@/components/admin/AdminBrandIcon"
import { Card, Field, PrimaryButton, SecondaryButton, StatusBadge, TextInput } from "@/components/admin/ui"
import { api } from "@/lib/cms/client"

const COLOR_FIELDS = [
  { key: "primary", label: "Color principal" },
  { key: "primarySoft", label: "Principal suave" },
  { key: "secondary", label: "Color secundario" },
  { key: "secondarySoft", label: "Secundario claro" },
  { key: "accentSoft", label: "Acento suave" },
  { key: "background", label: "Fondo base" },
  { key: "surface", label: "Fondo de paneles" },
  { key: "text", label: "Texto principal" },
  { key: "cursor", label: "Color del cursor" },
]

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent"
        />
        <TextInput value={value} onChange={(event) => onChange(event.target.value)} className="h-10 bg-black/10" />
      </div>
    </Field>
  )
}

export default function AdminAppearancePage() {
  const [settings, setSettings] = useState(null)
  const [presets, setPresets] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    let alive = true

    api("/api/admin/appearance")
      .then((data) => {
        if (!alive) return
        setSettings(data.settings)
        setPresets(data.presets || [])
        setForm(data.settings)
      })
      .catch((err) => {
        if (alive) setError(err.message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const activePreset = useMemo(
    () => presets.find((preset) => preset.id === form?.presetId) || presets[0],
    [form?.presetId, presets],
  )

  async function save(nextSettings) {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const data = await api("/api/admin/appearance", {
        method: "POST",
        body: JSON.stringify(nextSettings),
      })

      setSettings(data.settings)
      setPresets(data.presets || [])
      setForm(data.settings)
      setSuccess(data.message || "Apariencia actualizada.")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function applyPreset(presetId) {
    const selected = presets.find((preset) => preset.id === presetId)
    if (!selected) return

    const nextSettings = {
      mode: "preset",
      presetId: selected.id,
      colors: selected.colors,
    }

    setForm(nextSettings)
    save(nextSettings)
  }

  function updateCustomColor(key, value) {
    setForm((current) => ({
      mode: "custom",
      presetId: current?.presetId || presets[0]?.id || "bosque-rosa",
      colors: {
        ...(current?.colors || {}),
        [key]: value,
      },
    }))
  }

  if (loading) {
    return <p className="text-sm text-cream/50">Cargando configuración de apariencia...</p>
  }

  if (!form) {
    return <p className="text-sm text-red-300">{error || "No fue posible cargar la apariencia."}</p>
  }

  const previewColors = form.mode === "custom" ? form.colors : activePreset?.colors || form.colors

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-accent/75">Apariencia</p>
          <h2 className="mt-2 text-2xl font-medium text-cream">Colores de Thay Art</h2>
          <p className="mt-2 max-w-3xl text-sm text-cream/55">
            Elige una combinación preparada o crea la tuya. Los colores se aplicarán al sitio y a esta área privada.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">{form.mode === "custom" ? "Personalizada" : "Preparada"}</StatusBadge>
          <StatusBadge tone="success">{activePreset?.name || "Colores actuales"}</StatusBadge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-accent/10 text-gold-light">
              <Palette className="size-5" />
            </div>
            <div>
              <h3 className="text-lg text-cream">Combinaciones preparadas</h3>
              <p className="mt-1 text-sm text-cream/50">
                Selecciona la que más te guste y se aplicará al momento.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {presets.map((preset) => {
              const active = form.mode !== "custom" && preset.id === form.presetId

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-gold-accent/40 bg-gold-accent/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-cream">{preset.name}</p>
                      <p className="mt-1 text-xs text-cream/45">{preset.description}</p>
                    </div>
                    {active && <Check className="mt-0.5 size-4 text-gold-light" />}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {Object.values(preset.colors).slice(0, 5).map((color) => (
                      <span
                        key={`${preset.id}-${color}`}
                        className="block size-8 rounded-full border border-white/10"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/15">
              <AdminBrandIcon className="size-11" />
            </div>
            <div>
              <h3 className="text-lg text-cream">Vista previa</h3>
              <p className="mt-1 text-sm text-cream/50">
                Mira cómo se verán el sitio y el área privada con los colores elegidos.
              </p>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-[1.75rem] border border-white/10"
            style={{
              background: `linear-gradient(180deg, ${previewColors.background}, ${previewColors.surface})`,
              color: previewColors.text,
            }}
          >
            <div className="border-b border-white/10 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: previewColors.secondarySoft }}>
                    Área privada + sitio
                  </p>
                  <p className="mt-2 text-xl">Thay Art</p>
                </div>
                <span
                  className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/10"
                  style={{ backgroundColor: previewColors.secondary, color: previewColors.background }}
                >
                  •
                </span>
              </div>
            </div>

            <div className="space-y-4 px-5 py-5 text-sm">
              <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: previewColors.surface }}>
                Fondo del panel y tarjetas
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-2xl px-4 py-3" style={{ backgroundColor: previewColors.primary }}>
                  Principal
                </div>
                <div
                  className="flex-1 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: previewColors.secondary, color: previewColors.background }}
                >
                  Secundario
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                <span>Color del puntero</span>
                <span className="block size-5 rounded-full" style={{ backgroundColor: previewColors.cursor }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-accent/10 text-gold-light">
            <Palette className="size-5" />
          </div>
          <div>
            <h3 className="text-lg text-cream">Crear mi combinación</h3>
            <p className="mt-1 text-sm text-cream/50">
              Elige cada color para crear una apariencia propia.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {COLOR_FIELDS.map((field) => (
            <ColorField
              key={field.key}
              label={field.label}
              value={form.colors?.[field.key] || "#000000"}
              onChange={(value) => updateCustomColor(field.key, value)}
            />
          ))}
        </div>

        {error && <div className="mt-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {success && <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div>}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <SecondaryButton
            type="button"
            disabled={saving}
            onClick={() =>
              setForm({
                mode: "preset",
                presetId: settings?.presetId || presets[0]?.id || "bosque-rosa",
                colors: settings?.colors || presets[0]?.colors || form.colors,
              })
            }
          >
            Deshacer cambios
          </SecondaryButton>
          <PrimaryButton type="button" disabled={saving} onClick={() => save({ ...form, mode: "custom" })}>
            {saving ? "Guardando..." : "Guardar mis colores"}
          </PrimaryButton>
        </div>
      </Card>
    </div>
  )
}

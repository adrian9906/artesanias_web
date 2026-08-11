"use client"

import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, Field, PrimaryButton, StatusBadge, TextInput } from "@/components/admin/ui"
import { api } from "@/lib/cms/client"

const emptyForm = {
  currentPassword: "",
  nextPassword: "",
  confirmPassword: "",
}

export default function AdminSecurityPage() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState(null)
  const [visible, setVisible] = useState({
    currentPassword: false,
    nextPassword: false,
    confirmPassword: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  function toggleVisibility(field) {
    setVisible((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  useEffect(() => {
    let alive = true

    api("/api/admin/auth/password")
      .then((data) => {
        if (alive) setStatus(data)
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

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const data = await api("/api/admin/auth/password", {
        method: "POST",
        body: JSON.stringify(form),
      })

      setStatus(data.status)
      setSuccess(data.message || "Contraseña actualizada.")
      setForm(emptyForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold-accent/75">Tu acceso</p>
          <h2 className="mt-2 text-2xl font-medium text-cream">Cambiar contraseña</h2>
          <p className="mt-2 max-w-3xl text-sm text-cream/55">
            Escribe tu contraseña actual y elige una nueva. La usarás la próxima vez que entres.
          </p>
        </div>

        {status && (
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="accent">{status.username}</StatusBadge>
            <StatusBadge tone="success">Acceso activo</StatusBadge>
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gold-accent/10 text-gold-light">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h3 className="text-lg text-cream">Actualizar contraseña</h3>
              <p className="mt-1 text-sm text-cream/50">
                Usa al menos 8 caracteres. Cuando guardes, la nueva contraseña sustituirá la de acceso actual.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-cream/50">Preparando el formulario...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Contraseña actual">
                <div className="relative">
                  <TextInput
                    type={visible.currentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.currentPassword}
                    onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
                    placeholder="Escribe la contraseña actual"
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("currentPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/45 transition hover:text-gold-light"
                    aria-label={visible.currentPassword ? "Ocultar contraseña actual" : "Mostrar contraseña actual"}
                  >
                    {visible.currentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Nueva contraseña" hint="Mínimo 8 caracteres. Mejor si mezclas letras, números y símbolos.">
                <div className="relative">
                  <TextInput
                    type={visible.nextPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.nextPassword}
                    onChange={(event) => setForm((current) => ({ ...current, nextPassword: event.target.value }))}
                    placeholder="Escribe la nueva contraseña"
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("nextPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/45 transition hover:text-gold-light"
                    aria-label={visible.nextPassword ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
                  >
                    {visible.nextPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <Field label="Confirmar nueva contraseña">
                <div className="relative">
                  <TextInput
                    type={visible.confirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    placeholder="Repite la nueva contraseña"
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility("confirmPassword")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/45 transition hover:text-gold-light"
                    aria-label={visible.confirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                  >
                    {visible.confirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              {error && <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
              {success && <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div>}

              <div className="flex justify-end pt-2">
                <PrimaryButton type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar nueva contraseña"}
                </PrimaryButton>
              </div>
            </form>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary-fixed">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-lg text-cream">Consejos para tu contraseña</h3>
              <p className="mt-1 text-sm text-cream/50">
                Una buena contraseña ayuda a mantener privada la administración de tu sitio.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-cream/65">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              Usa al menos 8 caracteres y combina letras, números y símbolos.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              Evita usar nombres, fechas de nacimiento o contraseñas que ya uses en otros lugares.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              Tu nombre de usuario es <span className="text-gold-light">{status?.username || "admin"}</span>.
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

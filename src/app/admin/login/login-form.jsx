"use client"

import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import BrandName from "@/components/BrandName"
import { SmoothCursor } from "@/components/ui/smooth-cursor"

function getSafeNextPath(value) {
  if (!value || !value.startsWith("/admin")) return "/admin"
  if (value.startsWith("//") || value.includes("://")) return "/admin"
  return value
}

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        credentials: "same-origin",
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || "No fue posible iniciar sesion.")
      }

      const nextPath = getSafeNextPath(searchParams.get("next"))
      router.replace(nextPath)
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0c160b] text-cream">
      <SmoothCursor />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,172,162,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(200,228,157,0.16),transparent_28%),linear-gradient(180deg,rgba(12,22,11,0.84),rgba(12,22,11,0.98))]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-accent/25 bg-gold-accent/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold-light">
              <ShieldCheck className="size-4" />
              Acceso protegido
            </div>

            <div className="mt-6">
              <BrandName className="text-2xl sm:text-3xl" />
              <h1 className="mt-6 max-w-3xl font-display text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.92] text-cream">
                Entra al taller privado del admin.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-cream/68 sm:text-lg">
                Gestiona catalogo, promociones, noticias y galeria desde una sesion protegida con cookie `httpOnly`,
                firma del servidor y bloqueo automatico de rutas privadas.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                "Cookie segura y no accesible desde JS",
                "Proteccion de /admin y /api/admin",
                "Sesion con expiracion controlada",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-cream/70 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gold-accent/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-gold-accent/20 bg-[#132012]/92 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gold-accent/75">Inicio de sesion</p>
                  <h2 className="mt-3 text-2xl text-cream">Panel de administracion</h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-gold-accent/20 bg-gold-accent/10 text-gold-light">
                  <Sparkles className="size-5" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-cream/65">Usuario</span>
                  <input
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/15 px-4 text-base text-cream outline-none transition focus:border-gold-accent/45 focus:bg-black/25"
                    placeholder="admin"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm text-cream/65">Contrasena</span>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-cream/35" />
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/15 pl-11 pr-4 text-base text-cream outline-none transition focus:border-gold-accent/45 focus:bg-black/25"
                      placeholder="Tu clave segura"
                      required
                    />
                  </div>
                </label>

                {error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full border border-gold-accent bg-gold-accent px-6 text-base font-semibold text-forest-deep shadow-glow-button transition hover:-translate-y-0.5 hover:bg-gold-light disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar al admin"}
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-cream/48 sm:flex-row sm:items-center sm:justify-between">
                <span>Acceso interno de Thay Art</span>
                <Link href="/" className="text-gold-light transition hover:text-gold-pale">
                  Volver al sitio
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

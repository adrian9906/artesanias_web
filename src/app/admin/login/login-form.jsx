"use client"

import { Eye, EyeOff, LockKeyhole } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import AdminBrandIcon from "@/components/admin/AdminBrandIcon"
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
  const [passwordVisible, setPasswordVisible] = useState(false)
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

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "No fue posible iniciar sesión.")
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
    <main className="relative isolate min-h-screen overflow-hidden bg-[#071007] text-cream">
      <SmoothCursor />
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562866/thay-art/images/admin-login-botanical-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[38%_center] opacity-80 sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,14,7,0.68)_0%,rgba(5,14,7,0.48)_42%,rgba(5,14,7,0.86)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,14,7,0.78)_0%,rgba(5,14,7,0.52)_48%,rgba(5,14,7,0.76)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,transparent_0%,rgba(3,10,5,0.2)_50%,rgba(3,10,5,0.62)_100%)]" />
        <div className="noise-overlay absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 xl:gap-28">
          <section className="max-w-2xl">

            <div className="mt-10 sm:mt-12">
              <BrandName className="text-3xl sm:text-4xl" />
              <h1 className="mt-10 max-w-3xl font-display text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.96] text-cream sm:mt-12">
                Entra al espacio de administración.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-cream/68 sm:text-lg">
                Gestiona el catálogo, las promociones, las noticias y la galería de Thay Art desde un solo lugar.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Todo organizado en un solo lugar",
                "Acceso solo para personas autorizadas",
                "Tu información se mantiene privada",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/12 bg-[#0b1b0d]/50 px-4 py-4 text-sm text-cream/75 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="relative lg:pl-2 xl:pl-4">
            <div className="absolute -inset-4 rounded-[2rem] bg-gold-accent/10 blur-3xl" />
            <div
              className="relative overflow-hidden rounded-[2rem] border border-gold-accent/20 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-8"
              style={{ backgroundColor: "color-mix(in srgb, var(--theme-forest-dark) 86%, transparent)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-artisan text-lg tracking-[0.08em] text-gold-accent/75">Bienvenida</p>
                  <h2 className="font-artisan mt-3 text-3xl leading-tight text-cream">Administración de Thay Art</h2>
                </div>
                <div className="flex size-12 items-center justify-center bg-transparent">
                  <AdminBrandIcon className="size-11" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
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

                <div className="flex flex-col gap-2">
                  <label htmlFor="admin-password" className="text-sm text-cream/65">Contraseña</label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-cream/35" />
                    <input
                      id="admin-password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/15 pl-11 pr-12 text-base text-cream outline-none transition focus:border-gold-accent/45 focus:bg-black/25"
                      placeholder="Tu clave segura"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/45 transition hover:text-gold-light"
                      aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

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
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-cream/48 sm:flex-row sm:items-center sm:justify-between">
                <span>Área privada de Thay Art</span>
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

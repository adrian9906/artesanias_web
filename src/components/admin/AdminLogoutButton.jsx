"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminLogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)

    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        cache: "no-store",
      })
    } finally {
      router.replace("/admin/login")
      router.refresh()
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-gold-accent/25 bg-gold-accent/10 px-4 text-sm text-gold-light transition hover:bg-gold-accent/15 disabled:opacity-60"
    >
      <LogOut className="size-4" />
      {loading ? "Saliendo..." : "Cerrar sesion"}
    </button>
  )
}

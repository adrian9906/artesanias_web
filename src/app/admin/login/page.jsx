import { Suspense } from "react"
import AdminLoginForm from "./login-form"

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0c160b] text-cream">
          <p className="text-sm text-cream/60">Cargando acceso...</p>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}

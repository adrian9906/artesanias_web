'use client'

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Layout from "@/components/Layout"
import { I18nProvider } from "@/i18n"
import { trackPageview } from "@/lib/analytics/tracker"

export default function ClientShell({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  useEffect(() => {
    if (isAdmin || !pathname) return
    trackPageview(pathname, document.referrer || "")
  }, [pathname, isAdmin])

  return (
    <I18nProvider>
      {isAdmin ? children : <Layout>{children}</Layout>}
    </I18nProvider>
  )
}
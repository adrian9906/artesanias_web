'use client'

import { usePathname } from "next/navigation"
import Layout from "@/components/Layout"
import { I18nProvider } from "@/i18n"

export default function ClientShell({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <I18nProvider>
      {isAdmin ? children : <Layout>{children}</Layout>}
    </I18nProvider>
  )
}


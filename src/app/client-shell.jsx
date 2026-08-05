'use client'

import Layout from "@/components/Layout"
import { I18nProvider } from "@/i18n"

export default function ClientShell({ children }) {
  return <I18nProvider><Layout>{children}</Layout></I18nProvider>
}

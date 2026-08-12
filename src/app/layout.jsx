import "../index.css"
import ClientShell from "./client-shell"
import { getThemePresentation, themeTokensToCssVariables } from "@/lib/theme/settings"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Thay Art",
  description: "Artesanías únicas modeladas a mano.",
  applicationName: "Thay Art",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Thay Art",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#4e6b3e",
    "msapplication-TileImage": "/mstile-150x150.png",
  },
}

export const viewport = {
  themeColor: "#4e6b3e",
  colorScheme: "dark",
}

export default async function RootLayout({ children }) {
  const theme = await getThemePresentation()
  const themeStyle = themeTokensToCssVariables(theme.tokens)

  return (
    <html lang="es">
      <body suppressHydrationWarning style={themeStyle}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}

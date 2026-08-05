import "../index.css"
import ClientShell from "./client-shell"

export const metadata = {
  title: "Thay Art",
  description: "Artesanías únicas modeladas a mano.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body><ClientShell>{children}</ClientShell></body>
    </html>
  )
}

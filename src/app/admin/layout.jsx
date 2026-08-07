import AdminShell from "@/components/admin/AdminShell"

export const metadata = {
  title: "Admin CMS · Thay Art",
  description: "Panel de administración de contenido de Thay Art.",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>
}

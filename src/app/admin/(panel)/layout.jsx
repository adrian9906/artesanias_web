import { redirect } from "next/navigation"
import AdminLayoutShell from "@/components/admin/AdminLayoutShell"
import { getAdminSession } from "@/lib/auth/session"

export default async function AdminPanelLayout({ children }) {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login?next=/admin")
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>
}

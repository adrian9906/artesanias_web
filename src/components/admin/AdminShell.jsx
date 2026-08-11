"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Palette,
  Boxes,
  ChartColumn,
  FolderTree,
  GalleryVerticalEnd,
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  RectangleEllipsis,
} from "lucide-react"
import { useState } from "react"
import AdminBrandIcon from "@/components/admin/AdminBrandIcon"
import AdminLogoutButton from "@/components/admin/AdminLogoutButton"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: ChartColumn },
  { href: "/admin/secciones", label: "Secciones", icon: FolderTree },
  { href: "/admin/productos", label: "Productos", icon: Boxes },
  { href: "/admin/seguridad", label: "Cambiar contraseña", icon: ShieldCheck },
  { href: "/admin/apariencia", label: "Apariencia", icon: Palette },
  { href: "/admin/promocion", label: "Promoción", icon: RectangleEllipsis },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/voces", label: "Voces", icon: MessagesSquare },
  { href: "/admin/galeria", label: "Galería", icon: GalleryVerticalEnd },
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--theme-forest-deep)] font-branding text-cream antialiased">
      <SmoothCursor />
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 flex h-screen flex-col border-r border-white/10 bg-[var(--theme-forest-dark)] transition-all duration-300",
            collapsed ? "w-[72px]" : "w-64",
          )}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-accent/10">
              <AdminBrandIcon className="size-8" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-wide text-cream">Thay Art</p>
                <p className="truncate text-[11px] text-cream/45">Administración</p>
              </div>
            )}
          </div>

          <nav className="flex flex-1 flex-col gap-1 p-3">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-gold-accent/15 text-gold-light ring-1 ring-gold-accent/30"
                      : "text-cream/65 hover:bg-white/5 hover:text-cream",
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-gold-light" : "text-cream/50")} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/55 transition-colors hover:bg-white/5 hover:text-cream"
            >
              {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              {!collapsed && <span>Colapsar</span>}
            </button>
            {!collapsed && (
              <Link
                href="/"
                className="mt-1 block rounded-xl px-3 py-2 text-xs text-cream/40 transition-colors hover:bg-white/5 hover:text-cream/70"
              >
                Volver al sitio
              </Link>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className="sticky top-0 z-20 border-b border-white/10 px-6 py-4 backdrop-blur-md"
            style={{ backgroundColor: "color-mix(in srgb, var(--theme-forest-deep) 90%, transparent)" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-gold-accent/80">Administración</p>
                <h1 className="mt-1 text-lg font-medium text-cream">
                  {NAV.find((item) =>
                    item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`),
                  )?.label || "Administración"}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cream/55 md:block">
                  Acceso privado
                </div>
                <AdminLogoutButton />
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

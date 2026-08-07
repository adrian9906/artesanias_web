"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Boxes,
  FolderTree,
  LayoutDashboard,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { SmoothCursor } from "@/components/ui/smooth-cursor"

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/secciones", label: "Secciones", icon: FolderTree },
  { href: "/admin/productos", label: "Productos", icon: Boxes },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
]

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f1a0d] text-cream font-branding antialiased">
      <SmoothCursor />
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 flex h-screen flex-col border-r border-white/10 bg-[#152314] transition-all duration-300",
            collapsed ? "w-[72px]" : "w-64",
          )}
        >
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold-accent/20 text-gold-light">
              <Sparkles className="size-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-wide text-cream">Thay Art CMS</p>
                <p className="truncate text-[11px] text-cream/45">Panel de contenido</p>
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
              onClick={() => setCollapsed((v) => !v)}
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
                ← Volver al sitio
              </Link>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0f1a0d]/90 px-6 py-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-gold-accent/80">Administración</p>
                <h1 className="mt-1 text-lg font-medium text-cream">
                  {NAV.find((item) =>
                    item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`),
                  )?.label || "CMS"}
                </h1>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cream/55">
                Contenido local · data/cms.json
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

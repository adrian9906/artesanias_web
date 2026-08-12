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
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  RectangleEllipsis,
} from "lucide-react"
import AdminBrandIcon from "@/components/admin/AdminBrandIcon"
import AdminLogoutButton from "@/components/admin/AdminLogoutButton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
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

function AdminSidebar({ pathname }) {
  const { setOpenMobile, state, toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center bg-transparent">
            <AdminBrandIcon className="size-12" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]/sidebar:hidden">
            <p className="truncate text-sm font-semibold tracking-wide text-sidebar-foreground">Thay Art</p>
            <p className="truncate text-[11px] text-sidebar-foreground/45">Administración</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarMenu>
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href} title={item.label} onClick={() => setOpenMobile(false)}>
                      <Icon className={cn(active ? "text-sidebar-primary" : "text-sidebar-foreground/50")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem className="hidden md:block">
            <SidebarMenuButton title={state === "collapsed" ? "Expandir" : "Colapsar"} onClick={toggleSidebar}>
              {state === "collapsed" ? <PanelLeftOpen /> : <PanelLeftClose />}
              <span>{state === "collapsed" ? "Expandir" : "Colapsar"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/"
                title="Volver al sitio"
                onClick={() => setOpenMobile(false)}
              >
                <ExternalLink />
                <span>Volver al sitio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function AdminShell({ children }) {
  const pathname = usePathname()

  return (
    <SidebarProvider className="bg-[var(--theme-forest-deep)] font-branding text-cream antialiased">
      <SmoothCursor />
      <AdminSidebar pathname={pathname} />

      <SidebarInset>
        <header
          className="sticky top-0 z-20 border-b border-white/10 px-4 py-3 backdrop-blur-md sm:px-6 sm:py-4"
          style={{ backgroundColor: "color-mix(in srgb, var(--theme-forest-deep) 90%, transparent)" }}
        >
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="shrink-0 border border-white/10 bg-white/5 text-cream hover:bg-white/10 hover:text-cream" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gold-accent/80 sm:text-[11px] sm:tracking-[0.22em]">Administración</p>
                <h1 className="mt-1 truncate text-base font-medium text-cream sm:text-lg">
                  {NAV.find((item) =>
                    item.exact
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`),
                  )?.label || "Administración"}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cream/55 md:block">
                Acceso privado
              </div>
              <AdminLogoutButton />
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

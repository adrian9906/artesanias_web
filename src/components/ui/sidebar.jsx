"use client"

import { createContext, use, useEffect, useState } from "react"
import { PanelLeft } from "lucide-react"
import { Dialog as DialogPrimitive, Slot } from "radix-ui"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SidebarContext = createContext(null)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mediaQuery.matches)

    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])

  return isMobile
}

function SidebarProvider({ defaultOpen = true, className, style, children }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(defaultOpen)
  const [openMobile, setOpenMobile] = useState(false)
  const state = open ? "expanded" : "collapsed"
  const toggleSidebar = () => {
    if (isMobile) {
      setOpenMobile((value) => !value)
      return
    }

    setOpen((value) => !value)
  }

  return (
    <SidebarContext
      value={{ isMobile, open, openMobile, setOpenMobile, state, toggleSidebar }}
    >
      <div
        data-slot="sidebar-wrapper"
        style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "4.5rem", ...style }}
        className={cn("flex min-h-svh w-full items-stretch", className)}
      >
        {children}
      </div>
    </SidebarContext>
  )
}

function useSidebar() {
  const context = use(SidebarContext)

  if (!context) {
    throw new Error("useSidebar debe usarse dentro de SidebarProvider.")
  }

  return context
}

function Sidebar({ className, children, collapsible = "offcanvas" }) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar()

  if (isMobile) {
    return (
      <DialogPrimitive.Root open={openMobile} onOpenChange={setOpenMobile}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Content
            data-slot="sidebar"
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-[min(88vw,var(--sidebar-width))] flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl outline-none data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left",
              className,
            )}
          >
            <DialogPrimitive.Title className="sr-only">Menú de administración</DialogPrimitive.Title>
            {children}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    )
  }

  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      className={cn(
        "group/sidebar sticky top-0 flex h-svh w-[var(--sidebar-width)] shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-out data-[collapsible=icon]:w-[var(--sidebar-width-icon)]",
        className,
      )}
    >
      {children}
    </aside>
  )
}

function SidebarHeader({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("flex shrink-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex shrink-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn("flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuButton({ asChild = false, isActive = false, className, ...props }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "flex min-h-10 w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-sidebar-foreground/65 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[active=true]:bg-sidebar-primary/15 data-[active=true]:text-sidebar-primary data-[active=true]:ring-1 data-[active=true]:ring-sidebar-primary/30 [&>svg]:shrink-0 group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:px-2 group-data-[collapsible=icon]/sidebar:[&>span]:hidden",
        className,
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

function SidebarTrigger({ className, ...props }) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Abrir o cerrar el menú"
      onClick={toggleSidebar}
      className={className}
      {...props}
    >
      <PanelLeft />
    </Button>
  )
}

export {
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
}

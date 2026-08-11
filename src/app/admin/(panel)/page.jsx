"use client"

import Link from "next/link"
import { Boxes, FolderTree, MessagesSquare, Newspaper, Palette, Plus, RectangleEllipsis, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"
import { Card, PrimaryButton, SecondaryButton, StatusBadge } from "@/components/admin/ui"
import { categoryLabel, feedbackTypeLabel, formatDate, formatPrice } from "@/lib/cms/constants"
import { api } from "@/lib/cms/client"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    api("/api/admin/stats")
      .then((data) => {
        if (alive) setStats(data)
      })
      .catch((err) => {
        if (alive) setError(err.message)
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  if (loading) {
    return <p className="text-sm text-cream/50">Preparando el inicio…</p>
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>
  }

  const cards = [
    {
      label: "Secciones",
      value: stats.sections,
      href: "/admin/secciones",
      icon: FolderTree,
      hint: "Agrupan los productos del catálogo",
    },
    {
      label: "Productos",
      value: stats.products,
      href: "/admin/productos",
      icon: Boxes,
      hint: "Fotos, materiales, variantes y tiempos de elaboración",
    },
    {
      label: "Promociones",
      value: stats.promotions,
      href: "/admin/promocion",
      icon: RectangleEllipsis,
      hint: stats.promotionEnabled
        ? stats.promotionTitle || "Lista para mostrar producto nuevo"
        : "Gestiona varias promociones y activa la que quieras mostrar",
    },
    {
      label: "Publicaciones",
      value: stats.posts,
      href: "/admin/noticias",
      icon: Newspaper,
      hint: `${stats.publishedPosts} publicadas · ${stats.draftPosts} borradores`,
    },
    {
      label: "Voces",
      value: stats.feedback,
      href: "/admin/voces",
      icon: MessagesSquare,
      hint: `${stats.publishedFeedback} visibles en el sitio`,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium text-cream">Bienvenida a Thay Art</h2>
          <p className="mt-1 max-w-2xl text-sm text-cream/55">
            Administra el catálogo público, la galería, las noticias y las voces recibidas desde el sitio en un solo panel.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/productos">
            <PrimaryButton>
              <Plus className="size-4" />
              Nuevo producto
            </PrimaryButton>
          </Link>
          <Link href="/admin/noticias">
            <SecondaryButton>
              <Plus className="size-4" />
              Nueva publicación
            </SecondaryButton>
          </Link>
          <Link href="/admin/promocion/nueva">
            <SecondaryButton>
              <RectangleEllipsis className="size-4" />
              Nueva promoción
            </SecondaryButton>
          </Link>
          <Link href="/admin/seguridad">
            <SecondaryButton>
              <ShieldCheck className="size-4" />
              Cambiar contraseña
            </SecondaryButton>
          </Link>
          <Link href="/admin/apariencia">
            <SecondaryButton>
              <Palette className="size-4" />
              Apariencia
            </SecondaryButton>
          </Link>
          <Link href="/admin/voces">
            <SecondaryButton>
              <Plus className="size-4" />
              Nueva voz
            </SecondaryButton>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.href} href={card.href}>
              <Card className="h-full transition hover:border-gold-accent/30 hover:bg-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-cream/40">{card.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-cream">{card.value}</p>
                    <p className="mt-2 text-xs text-cream/45">{card.hint}</p>
                  </div>
                  <div className="rounded-xl bg-gold-accent/10 p-2.5 text-gold-light">
                    <Icon className="size-5" />
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-cream">Productos recientes</h3>
            <Link href="/admin/productos" className="text-xs text-gold-light hover:underline">
              Ver todos
            </Link>
          </div>
          <ul className="space-y-3">
            {(stats.recentProducts || []).length === 0 && (
              <li className="text-sm text-cream/45">Aún no hay productos.</li>
            )}
            {(stats.recentProducts || []).map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">{product.name}</p>
                  <p className="text-xs text-cream/40">{product.elaborationTime || "Sin tiempo estimado"}</p>
                </div>
                <span className="shrink-0 text-sm text-gold-light">
                  {formatPrice(product.price, product.currency)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-cream">Publicaciones recientes</h3>
            <Link href="/admin/noticias" className="text-xs text-gold-light hover:underline">
              Ver todas
            </Link>
          </div>
          <ul className="space-y-3">
            {(stats.recentPosts || []).length === 0 && (
              <li className="text-sm text-cream/45">Aún no hay publicaciones.</li>
            )}
            {(stats.recentPosts || []).map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-cream">{post.title}</p>
                  <p className="text-xs text-cream/40">{formatDate(post.publishedAt || post.createdAt)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge tone="accent">{categoryLabel(post.category)}</StatusBadge>
                  <StatusBadge tone={post.status === "published" ? "success" : "warn"}>
                    {post.status === "published" ? "Publicado" : "Borrador"}
                  </StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-cream">Voces recientes</h3>
            <Link href="/admin/voces" className="text-xs text-gold-light hover:underline">
              Ver todas
            </Link>
          </div>
          <ul className="space-y-3">
            {(stats.recentFeedback || []).length === 0 && (
              <li className="text-sm text-cream/45">Aún no hay opiniones o testimonios.</li>
            )}
            {(stats.recentFeedback || []).map((item) => (
              <li key={item.id} className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-cream">{item.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-cream/40">{item.text}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge tone="accent">{feedbackTypeLabel(item.type)}</StatusBadge>
                    <span className="text-[11px] text-cream/40">{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-cream">Contraseña de acceso</h3>
            <Link href="/admin/seguridad" className="text-xs text-gold-light hover:underline">
              Abrir
            </Link>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <p className="text-sm text-cream">Cambia la contraseña que utilizas para entrar.</p>
              <p className="mt-1 text-xs text-cream/45">
                Recuerda elegir una contraseña segura y que puedas recordar.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-cream/45">
              Solo las personas con la contraseña correcta pueden entrar.
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-medium text-cream">Apariencia de la marca</h3>
            <Link href="/admin/apariencia" className="text-xs text-gold-light hover:underline">
              Abrir
            </Link>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <p className="text-sm text-cream">Elige una combinación de colores o crea la tuya.</p>
              <p className="mt-1 text-xs text-cream/45">
                Cambia los colores del sitio y de esta área de administración.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-xs text-cream/45">
              Los cambios de apariencia no afectan tus productos ni publicaciones.
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

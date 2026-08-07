export const POST_CATEGORIES = [
  { id: "blog", label: "Blog" },
  { id: "noticia", label: "Noticia" },
  { id: "taller", label: "Taller" },
]

export const POST_STATUSES = [
  { id: "draft", label: "Borrador" },
  { id: "published", label: "Publicado" },
]

export const EDITOR_FONTS = [
  { id: "Branding Aliskaje, cursive", label: "Branding Aliskaje" },
  { id: "Playwrite GB, cursive", label: "Playwrite GB" },
  { id: "The Artisan, cursive", label: "The Artisan" },
  { id: "Bitcount Grid, sans-serif", label: "Bitcount Grid" },
  { id: "Georgia, serif", label: "Georgia" },
  { id: "Arial, sans-serif", label: "Arial" },
  { id: "Times New Roman, serif", label: "Times New Roman" },
]

export const EDITOR_FONT_SIZES = [
  { id: "3", label: "Pequeño" },
  { id: "4", label: "Normal" },
  { id: "5", label: "Mediano" },
  { id: "6", label: "Grande" },
  { id: "7", label: "Muy grande" },
]

export function categoryLabel(id) {
  return POST_CATEGORIES.find((item) => item.id === id)?.label || id
}

export function statusLabel(id) {
  return POST_STATUSES.find((item) => item.id === id)?.label || id
}

export function formatPrice(amount, currency = "USD") {
  const value = Number(amount)
  if (Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(iso) {
  if (!iso) return "—"
  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

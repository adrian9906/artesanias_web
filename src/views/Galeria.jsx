import { useEffect, useMemo, useState } from "react"
import { ImageGallery } from "@/components/ImageGallery"
import { useI18n } from "../i18n"
import { api } from "@/lib/cms/client"

export default function Galeria() {
  const { t } = useI18n()
  const [photos, setPhotos] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    api("/api/admin/gallery")
      .then((data) => {
        const gallery = (data.gallery || [])
          .slice()
          .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
          .map((img) => ({
            id: img.id,
            image: img.image,
            portrait: img.portrait,
            alt: img.alt || "",
          }))
        if (mounted) setPhotos(gallery)
      })
      .catch(() => {
        if (mounted) setPhotos([])
      })
      .finally(() => {
        if (mounted) setLoaded(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  const galleryTitle = useMemo(() => t("gallery.title"), [t])
  const gallerySubtitle = useMemo(() => t("gallery.subtitle"), [t])

  return (
    <div className="min-h-screen bg-forest-dark relative animate-blurred-fade-in">
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 pt-24 md:pt-32 pb-20 px-4 md:px-6">
        <section className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-7xl font-bold text-cream mb-6">{galleryTitle}</h1>
          <p className="text-cream/60 text-lg font-light leading-relaxed">{gallerySubtitle}</p>
        </section>

        <div className="mx-auto max-w-6xl">
          {loaded && <ImageGallery photos={photos} />}
        </div>
      </div>
    </div>
  )
}
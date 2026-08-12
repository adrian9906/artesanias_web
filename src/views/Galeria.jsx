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
    <div className="relative min-h-screen overflow-hidden bg-[#1b2d1c] font-branding text-cream animate-blurred-fade-in">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dxjnjcqax/image/upload/v1786562952/thay-art/images/gallery-ceramics-studio-bg.png')" }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(17,36,19,0.34)_0%,rgba(17,36,19,0.64)_44%,rgba(17,36,19,0.92)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(71,104,54,0.1),rgba(17,36,19,0.38)_72%)]" />
      <div className="fixed inset-0 noise-overlay opacity-30" />

      <div className="relative z-10 pt-24 md:pt-32 pb-20 px-4 md:px-6">
        <section className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold-accent">Archivo artesanal</p>
          <h1 className="font-display text-4xl md:text-7xl font-bold text-cream mb-6 drop-shadow-[0_3px_20px_rgba(8,20,9,0.5)]">{galleryTitle}</h1>
          <p className="text-cream/75 text-lg font-light leading-relaxed">{gallerySubtitle}</p>
          <div className="mx-auto mt-7 h-px w-20 bg-gold-accent/80" />
        </section>

        <div className="mx-auto max-w-6xl rounded-[2rem] border border-gold-accent/20 bg-[#203b27]/80 p-3 shadow-[0_28px_90px_rgba(5,18,7,0.48)] backdrop-blur-md sm:p-5 md:p-7">
          {loaded && <ImageGallery photos={photos} />}
        </div>
      </div>
    </div>
  )
}

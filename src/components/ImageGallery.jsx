'use client'

import { useMemo } from 'react'
import { LazyImage } from '@/components/lazy-image'

/**
 * Galería tipo masonry. Recibe las fotos desde el CMS (urls reales) y las
 * reparte en 4 columnas. Cada imagen puede ser vertical u horizontal; la
 * columna mira a sumar alturas similares para balancear el grid.
 */
export function ImageGallery({ photos = [], columns = 4 }) {
  // Divide las fotos en N columnas balanceando las proporciones.
  const cols = useMemo(() => {
    const items = photos.map((p, i) => ({
      id: p.id ?? i,
      src: p.image ?? p.src,
      alt: p.alt ?? `Imagen ${i + 1}`,
      portrait: p.portrait ?? false,
    }))
    const buckets = Array.from({ length: Math.min(columns, items.length) || 1 }, () => [])
    const heavis = Array.from({ length: buckets.length }, () => 0)
    items.forEach((item) => {
      const target = heavis.indexOf(Math.min(...heavis))
      buckets[target].push(item)
      heavis[target] += item.portrait ? (9 / 16) * 1080 : (16 / 9) * 1080
    })
    return buckets
  }, [photos, columns])

	if (!photos.length) {
		return (
			<div className="rounded-2xl border border-dashed border-[#f9aca2]/35 bg-white/[0.02] px-6 py-16 text-center">
				<p className="text-cream/70">Aún no hay imágenes en la galería.</p>
			</div>
		)
	}

	return (
		<div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
			{cols.map((column, col) => (
				<div className="grid gap-4 md:gap-6" key={col}>
					{column.map((item) => (
						<LazyImage
							alt={item.alt}
							containerClassName="rounded-2xl"
							inView={true}
							key={item.id}
							ratio={item.portrait ? 9 / 16 : 16 / 9}
							src={item.src}
						/>
					))}
				</div>
			))}
		</div>
	)
}
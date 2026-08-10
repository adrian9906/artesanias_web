'use client'

import { cn } from "@/lib/utils"
import { useInView } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export function LazyImage({
	alt,
	src,
	ratio,
	fallback,
	inView = false,
	className,
	containerClassName,
}) {
	const ref = useRef(null)
	const imgRef = useRef(null)
	const isInView = useInView(ref, { once: true })
	const [imgSrc, setImgSrc] = useState()
	const [isLoading, setIsLoading] = useState(true)

	// with inView the src is only set once the element scrolls into view.
	useEffect(() => {
		if (inView && !isInView) return
		if (imgSrc === src) return
		const raf = requestAnimationFrame(() => setImgSrc(src))
		return () => cancelAnimationFrame(raf)
	}, [inView, isInView, src, imgSrc])

	const handleError = useCallback(() => {
		if (fallback) setImgSrc(fallback)
		setIsLoading(false)
	}, [fallback])

	const handleLoad = useCallback(() => {
		setIsLoading(false)
	}, [])

	// Cached images may fire complete before handlers attach.
	useEffect(() => {
		if (imgRef.current?.complete) setIsLoading(false)
	}, [imgSrc])

	return (
		<AspectRatio
			className={cn(
				"relative size-full overflow-hidden border bg-accent/30",
				containerClassName
			)}
			ratio={ratio}
			ref={ref}
		>
			<img
				ref={imgRef}
				src={imgSrc}
				alt={alt}
				className={cn(
					"size-full object-cover transition-opacity duration-500",
					isLoading ? "opacity-0" : "opacity-100",
					className
				)}
				decoding="async"
				fetchPriority={inView ? "high" : "low"}
				loading="lazy"
				onError={handleError}
				onLoad={handleLoad}
				role="presentation"
			/>
		</AspectRatio>
	)
}
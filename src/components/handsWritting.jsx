'use client'

import { useEffect } from 'react'

/**
 * "Thay Artisian" escrita a mano, dibujada por trazo con CSS y relleno
 * posterior. Llama a `onComplete` cuando termina de "escribirse" para que
 * el padre pueda disparar la animación tipo de tipeado con GSAP.
 */
export function HandsWritting({ onComplete }) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches


  useEffect(() => {
    if (reduced) return
    // draw 4.2s + fill delay 3.7s + ink 1.1s
    // el trazo se dibuja en 4.2s; avisamos al terminar para que entren los títulos
    const t = setTimeout(() => onComplete?.(), 4300)
    return () => clearTimeout(t)
  }, [onComplete, reduced])
  return (
    <div className="hw-wrap">
      <svg
        className="hw-svg hw-svg-desktop"
        viewBox="0 0 900 360"
        role="img"
        aria-label="Thay Artisian escrito a mano"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trazo que se dibuja: contorno de las letras, sin relleno */}
        <text
          className="hw-stroke"
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Thay Artesanías
        </text>
        {/* Relleno que aparece suavemente al terminar el trazo */}
        <text
          className="hw-fill"
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Thay Artesanías
        </text>
      </svg>
      <svg
        className="hw-svg hw-svg-compact"
        viewBox="0 0 720 420"
        role="img"
        aria-label="Thay Artisian escrito a mano"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          className="hw-stroke hw-stroke-compact"
          x="50%"
          y="31%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Thay
        </text>
        <text
          className="hw-stroke hw-stroke-compact"
          x="50%"
          y="79%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Artesanías
        </text>
        <text
          className="hw-fill hw-fill-compact"
          x="50%"
          y="31%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Thay
        </text>
        <text
          className="hw-fill hw-fill-compact"
          x="50%"
          y="79%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Artesanías
        </text>
      </svg>
    </div>
  )
}

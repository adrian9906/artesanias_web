'use client'

// Decorative SVG pieces for the forest card: leafy corner branches and edge vines.
// Vines are drawn with layered strokes (dark base + tone + top highlight) to fake
// a rounded, embossed 2D relief. Leaves have gradients + veins for depth.
// All are aria-hidden since they are purely ornamental.
//
// Animation hooks (targeted by GSAP in ForestMessageCard):
//   .draw-stroke  -> stroke paths that "grow" via stroke-dashoffset
//   .pop-leaf     -> leaves that scale/rotate in
//   .pop-berry    -> berries that pop in

import { useId } from 'react'

function Leaf({
  x,
  y,
  rotate,
  scale = 1,
  gradId,
}) {
  return (
    <g
      className="pop-leaf"
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      {/* underside shadow for depth */}
      <path
        d="M1 2 C 11 -12 27 -16 35 -8 C 31 4 15 12 1 2 Z"
        fill="var(--forest-vine)"
        opacity="0.5"
      />
      {/* leaf blade with gradient relief */}
      <path
        d="M0 0 C 10 -14 26 -18 34 -10 C 30 2 14 10 0 0 Z"
        fill={`url(#${gradId})`}
      />
      {/* mid rib */}
      <path
        d="M1 -0.5 C 12 -6 22 -9 33 -10"
        fill="none"
        stroke="var(--forest-leaf-light)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* side veins */}
      <path
        d="M11 -4 C 13 -7 15 -9 16 -12 M20 -6 C 22 -9 24 -10 25 -13"
        fill="none"
        stroke="var(--forest-leaf-light)"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* specular highlight */}
      <path
        d="M6 -4 C 12 -11 22 -14 29 -10"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.25"
      />
    </g>
  )
}

/** Shared gradient/filter defs. Rendered once per SVG with instance-unique ids. */
function Defs({
  leafGrad,
  vineGrad,
}) {
  return (
    <defs>
      <linearGradient id={leafGrad} x1="0" y1="-18" x2="20" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="var(--forest-leaf-light)" />
        <stop offset="0.55" stopColor="var(--forest-leaf)" />
        <stop offset="1" stopColor="var(--forest-vine)" />
      </linearGradient>
      <linearGradient id={vineGrad} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--forest-leaf-light)" />
        <stop offset="1" stopColor="var(--forest-vine)" />
      </linearGradient>
    </defs>
  )
}

/**
 * Draw a vine along `d` with a 3-layer relief: dark base (shadow), body tone,
 * and a thin offset top highlight. `w` is the body width.
 */
function ReliefVine({ d, w }) {
  return (
    <g style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.35))' }}>
      {/* dark base / shadow edge */}
      <path
        className="draw-stroke"
        d={d}
        stroke="var(--forest-vine)"
        strokeWidth={w + 3}
        strokeLinecap="round"
        fill="none"
        style={{ filter: 'brightness(0.6)' }}
      />
      {/* body tone */}
      <path
        className="draw-stroke"
        d={d}
        stroke="var(--forest-vine)"
        strokeWidth={w}
        strokeLinecap="round"
        fill="none"
      />
      {/* top highlight ridge */}
      <path
        className="draw-stroke"
        d={d}
        stroke="var(--forest-leaf-light)"
        strokeWidth={Math.max(1.2, w * 0.32)}
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />
    </g>
  )
}

/**
 * A branch that sprouts out from a card corner with a few leaves.
 * Drawn for the top-left corner; the parent rotates/mirrors it for others.
 */
export function CornerBranch({ className }) {
  const uid = useId().replace(/[:]/g, '')
  const leafGrad = `lg-${uid}`
  const vineGrad = `vg-${uid}`
  return (
    <svg
      className={className}
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      <Defs leafGrad={leafGrad} vineGrad={vineGrad} />
      {/* main branch */}
      <ReliefVine
        d="M136 136 C 96 126 56 110 30 76 C 16 58 10 34 12 8"
        w={6}
      />
      {/* offshoot */}
      <ReliefVine d="M46 96 C 34 88 26 74 26 58" w={4} />
      {/* curling tendril */}
      <ReliefVine
        d="M12 8 C 4 6 0 12 3 18 C 5 22 11 22 12 17"
        w={2.6}
      />

      <Leaf x={12} y={8} rotate={-100} scale={1.25} gradId={leafGrad} />
      <Leaf x={26} y={46} rotate={-150} scale={1} gradId={leafGrad} />
      <Leaf x={26} y={58} rotate={20} scale={0.9} gradId={leafGrad} />
      <Leaf x={30} y={76} rotate={-170} scale={1.1} gradId={leafGrad} />
      <Leaf x={60} y={108} rotate={200} scale={1.05} gradId={leafGrad} />

      {/* berries with a highlight for relief */}
      <g className="pop-berry" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="20" cy="26" r="3.4" fill="var(--form-accent)" />
        <circle cx="19" cy="25" r="1.1" fill="#ffffff" opacity="0.7" />
      </g>
      <g className="pop-berry" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="40" cy="86" r="3" fill="var(--form-accent)" />
        <circle cx="39" cy="85" r="1" fill="#ffffff" opacity="0.7" />
      </g>
    </svg>
  )
}

/** A trailing vine that runs along a horizontal edge with alternating leaves. */
export function EdgeVine({ className }) {
  const uid = useId().replace(/[:]/g, '')
  const leafGrad = `lg-${uid}`
  const vineGrad = `vg-${uid}`
  return (
    <svg
      className={className}
      width="320"
      height="34"
      viewBox="0 0 320 34"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <Defs leafGrad={leafGrad} vineGrad={vineGrad} />
      <ReliefVine
        d="M0 17 C 40 4 80 30 120 17 C 160 4 200 30 240 17 C 280 4 320 30 320 17"
        w={5}
      />
      <Leaf x={40} y={9} rotate={-40} scale={0.7} gradId={leafGrad} />
      <Leaf x={120} y={24} rotate={40} scale={0.7} gradId={leafGrad} />
      <Leaf x={200} y={9} rotate={-40} scale={0.7} gradId={leafGrad} />
      <Leaf x={280} y={24} rotate={40} scale={0.7} gradId={leafGrad} />
    </svg>
  )
}

/** A trailing vine that runs along a vertical edge with alternating leaves. */
export function EdgeVineVertical({ className }) {
  const uid = useId().replace(/[:]/g, '')
  const leafGrad = `lg-${uid}`
  const vineGrad = `vg-${uid}`
  return (
    <svg
      className={className}
      width="34"
      height="320"
      viewBox="0 0 34 320"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <Defs leafGrad={leafGrad} vineGrad={vineGrad} />
      <ReliefVine
        d="M17 0 C 4 40 30 80 17 120 C 4 160 30 200 17 240 C 4 280 30 320 17 320"
        w={5}
      />
      <Leaf x={9} y={40} rotate={50} scale={0.7} gradId={leafGrad} />
      <Leaf x={24} y={120} rotate={-50} scale={0.7} gradId={leafGrad} />
      <Leaf x={9} y={200} rotate={50} scale={0.7} gradId={leafGrad} />
      <Leaf x={24} y={280} rotate={-50} scale={0.7} gradId={leafGrad} />
    </svg>
  )
}

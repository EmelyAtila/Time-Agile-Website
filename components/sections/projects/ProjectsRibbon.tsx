'use client'

import { useScrollDraw } from '@/animations/useScrollDraw'
import { cn } from '@/lib/utils'

// Fita de docs/Desktop - 1.svg invertida (desenha da esquerda para a direita), com os arcos de entrada e
// saída alargados e as pontas prolongadas como na fita das tags. O viewBox é só o trecho do palco, para
// centrar nele o gatilho da rolagem.
const VIEWBOX = { x: 0, y: 4270, width: 1480, height: 300 }
const STAGE_BOTTOM = 4572
const D =
  'M-867.78 4779.33C-421.22 4707.76 -338.88 4594.61 -210 4539.92C-98.2 4492.48 78.72 4476.26 278.41 4476.27C550.45 4476.3 896.64 4550.5 987.57 4535.14C1218.72 4496.08 1014.5 4252.5 912.12 4351.86C865.15 4397.45 895.86 4414.8 963.71 4414.81C1147.77 4414.82 1526.13 4327.72 1690 4258.78C1800.61 4212.24 1927.14 4126.18 2472.52 4092.45'

// O pai é o palco da vitrine: define `--u` e é ancorado pelo fundo, como no mockup
export function ProjectsRibbon({ className }: { className?: string }) {
  const ref = useScrollDraw()

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
      fill="none"
      className={cn('pointer-events-none absolute h-auto overflow-visible', className)}
      style={{
        left: `calc(50% - ${740 - VIEWBOX.x} * var(--u))`,
        bottom: `calc(${STAGE_BOTTOM - (VIEWBOX.y + VIEWBOX.height)} * var(--u))`,
        width: `calc(${VIEWBOX.width} * var(--u))`,
      }}
    >
      <path
        d={D}
        pathLength={1}
        stroke="var(--color-pink)"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="[stroke-width:20] md:[stroke-width:17] lg:[stroke-width:15]"
      />
    </svg>
  )
}

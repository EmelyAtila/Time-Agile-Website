'use client'

import { useScrollDraw } from '@/animations/useScrollDraw'
import { cn } from '@/lib/utils'

// Coordenadas de docs/Desktop - 1.svg; STRIP_CENTER é o centro das tags no mockup.
// O path está invertido em relação ao mockup para a fita se desenhar da esquerda para a direita.
const VIEWBOX = { y: 2149, width: 1480, height: 285 }
const STRIP_CENTER = 2311.5
const D =
  'M-18 2160C21.3943 2323.18 368.356 2258.65 542.126 2232.99C666.867 2214.57 939.389 2192.99 1044.92 2253.48C1115.3 2293.82 1176.83 2365.88 1118.49 2412.45C1100.8 2426.57 1051.52 2430.45 1063.18 2398.95C1083.79 2343.35 1529.45 2340.46 1533 2421.45'

// O pai precisa de `relative` e `overflow-x-clip`: abaixo de 640px as pontas passam das bordas
export function TagRibbon({ className }: { className?: string }) {
  const ref = useScrollDraw()

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 ${VIEWBOX.y} ${VIEWBOX.width} ${VIEWBOX.height}`}
      fill="none"
      className={cn(
        'pointer-events-none absolute left-1/2 top-1/2 h-auto w-[max(100%,40rem)]',
        className
      )}
      style={{
        transform: `translate(-50%, -${((STRIP_CENTER - VIEWBOX.y) / VIEWBOX.height) * 100}%)`,
      }}
    >
      <path
        d={D}
        pathLength={1}
        stroke="var(--color-orange)"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="[stroke-width:20] md:[stroke-width:16] lg:[stroke-width:14]"
      />
    </svg>
  )
}

'use client'

import { useScrollDraw } from '@/animations/useScrollDraw'
import { cn } from '@/lib/utils'

// Coordenadas de docs/Desktop - 1.svg; STRIP_CENTER é o centro das tags no mockup.
// Path invertido (desenha da esquerda para a direita). O arco de entrada foi alargado até x -210 e as pontas
// seguem a curva: quando o palco (--stage-width) é mais estreito que a tela, a fita entra pela borda dela.
const VIEWBOX = { y: 2149, width: 1480, height: 285 }
const STRIP_CENTER = 2311.5
const D =
  'M-640.96 1620.12C-272.43 1862.82 -310.43 2074.2 -210 2171.73C-134.85 2244.72 31.61 2267.34 219.42 2267.35C330.95 2267.35 457.22 2245.53 542.13 2232.99C666.87 2214.57 939.39 2192.99 1044.92 2253.48C1115.3 2293.82 1176.83 2365.88 1118.49 2412.45C1100.8 2426.57 1051.52 2430.45 1063.18 2398.95C1079.45 2355.06 1360.54 2344.02 1480 2381.14C1594.6 2416.75 1626.24 2517.11 2080 2470'

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
        'pointer-events-none absolute left-1/2 top-1/2 h-auto w-[max(100%,40rem)] overflow-visible lg:w-[var(--stage-width)]',
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

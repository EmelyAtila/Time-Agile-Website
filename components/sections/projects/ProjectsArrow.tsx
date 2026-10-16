'use client'

import { useArrowDraw } from '@/animations/useArrowDraw'
import { cn } from '@/lib/utils'

// Seta exportada do Figma refeita como traço (a linha do meio do contorno exportado, com 15 de
// espessura) para poder se desenhar. As abas saem da ponta. O viewBox corrige o corte na borda esquerda
const ARC =
  'M-19.86 82.99C-16 70.76 -4.61 58.32 8.99 48.16C22.6 38.01 38.41 30.15 51.11 27.08C97.7 15.83 140.53 43.79 160.59 98.05C162.06 102.04 163.13 108.56 163.83 115.12C164.53 121.69 164.85 128.3 164.81 132.45'
const TABS = [
  'M167.58 144.28C167.8 138.3 168.16 131.24 170.38 125.67C172.97 119.14 176.44 111.4 181.24 104.84C186.05 98.28 192.21 92.89 200.19 91.07',
  'M167.58 144.28L160.96 133.27C155.71 127.11 147.52 121.7 138.69 118.6C129.87 115.5 120.4 114.72 112.59 117.8',
]

// Cada <g> tem um movimento (balanço do hover, quique da entrada, estalo da ponta), para não brigarem.
// A área do hover é uma cópia mais grossa e invisível do traço, parada fora deles
export function ProjectsArrow({ className }: { className?: string }) {
  const ref = useArrowDraw()

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="-28 17 236 135"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('pointer-events-none overflow-visible', className)}
    >
      <g
        data-arrow-hit
        stroke="transparent"
        strokeWidth={44}
        className="[@media(hover:hover)]:pointer-events-auto"
      >
        {[ARC, ...TABS].map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g data-arrow="swing" stroke="var(--color-yellow)" strokeWidth={15}>
        <g data-arrow="body">
          <path data-arrow="arc" d={ARC} pathLength={1} />
          <g data-arrow="head">
            {TABS.map((d) => (
              <path key={d} data-arrow="tab" d={d} pathLength={1} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  )
}

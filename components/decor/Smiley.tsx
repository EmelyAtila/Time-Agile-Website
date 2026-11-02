'use client'

import { useSmileyLoop } from '@/animations/useSmileyLoop'
import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

type SmileyProps = {
  color: BrandColor
  className?: string
}

// Inline para a cor vir dos tokens; o viewBox corrige o corte na borda esquerda do arquivo exportado.
// A elipse é a área do hover, fora do <g> que gira. O pop da entrada vai em [data-pop]: o <svg> já tem o
// transform do Tailwind
export function Smiley({ color, className }: SmileyProps) {
  const faceRef = useSmileyLoop()

  return (
    // overflow-visible: girando, o desenho passa um pouco do viewBox
    <svg
      aria-hidden
      data-reveal="pop"
      data-reveal-mode="play"
      viewBox="-32 21 138 131"
      fill={`var(--color-${color})`}
      className={cn('pointer-events-none overflow-visible', className)}
    >
      <g data-pop>
        <ellipse
          data-face-hit
          cx={36.5}
          cy={84.8}
          rx={70}
          ry={64.5}
          fill="transparent"
          className="[@media(hover:hover)]:pointer-events-auto"
        />
        <g ref={faceRef} data-face="wobble">
          <path d="M69.67 34.96C94.43 45.45 106.82 63.11 105.14 82.93C103.46 102.75 93.11 120.56 80.47 130.33C65.07 143.32 44.72 149.25 23.49 144.42C2.45 139.22 -17.36 127.51 -25.38 109.74C-33.88 92.89 -33.53 73.55 -24.04 55.32C-14.55 37.09 2.56 24.95 22.35 22.18C38.43 20.32 55 25.81 69.67 34.96ZM63.97 45.9C50.83 37.97 36.45 34.48 23.04 37.44C8.48 40.52 -5.01 49.87 -11.66 62.63C-18.3 75.39 -18.47 90.23 -11.98 102.65C-5.67 115.43 7.38 125.6 22.61 129.52C37.84 133.43 53.35 130.6 65.52 121.73C77.5 113.24 85.66 99.63 86.3 83.88C86.66 68.67 77.88 54.43 63.97 45.9Z" />
          <path d="M85.4 56.57C88.26 59.37 90.74 62.9 91.98 66.74C89.68 65.36 86.91 62.37 85.31 58.82L85.4 56.57Z" />
          <path d="M15.42 31.35C16.07 32.59 16.18 34.02 15.27 34.95C14.43 34.07 14.32 32.63 15.42 31.35Z" />
          <path d="M9.87 34.55C10.44 35.53 10.48 36.7 9.66 37.44C8.99 36.64 8.95 35.48 9.87 34.55Z" />
          <path d="M65.07 143.32C65.63 144.75 65.48 146.28 64.4 147.12C63.65 146.06 63.9 144.34 65.07 143.32Z" />
          <path d="M58.99 146.72C59.47 147.88 59.33 148.96 58.52 149.7C57.85 148.91 58.08 147.64 58.99 146.72Z" />
          <path d="M53.47 149.02C53.87 149.91 53.84 150.81 53.11 151.37C52.62 150.66 52.66 149.76 53.47 149.02Z" />
          <path d="M30.02 59.29C32.97 59.84 35.53 61.57 34.69 64.83L30.1 74.48C28.05 77.59 24.59 76.78 22.76 74.49C21.27 72.37 22.1 69.12 23.96 66.37L27.68 60.88C28.42 59.87 29.15 59.31 30.02 59.29Z" />
          <path d="M54.92 70.77C58.04 71.4 60.4 73.5 59.4 76.67L54.63 86.24C52.58 89.35 49.12 88.54 47.29 86.25C45.8 84.13 46.63 80.87 48.49 78.13L52.22 72.63C52.96 71.63 53.68 71.07 54.92 70.77Z" />
          <path d="M6.82 70.69C7.71 70.22 9.08 70.9 9.54 72.51C4.12 85.41 6.58 98.12 14.77 107.25C23.64 117.18 37.67 120.49 49.62 114.96C53.8 113.15 57.18 109.55 59.44 105.62C60.39 103.8 62.31 103.84 63.3 105.25C63.95 106.49 63.88 108.29 62.95 109.67C59.4 115.25 54.15 119.52 47.76 121.85C34.98 126.5 19.94 122.22 10.06 111.33C0.68 101.15 -2.23 86.84 3.51 72.48C4 71.12 5.6 70.54 6.82 70.69Z" />
        </g>
      </g>
    </svg>
  )
}

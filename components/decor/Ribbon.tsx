import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

type RibbonProps = {
  /** Atributo `d` do path — copie as curvas do mockup (docs/Desktop - 1.svg) */
  d: string
  color: BrandColor
  strokeWidth?: number
  viewBox?: string
  className?: string
}

/** Fita decorativa (as curvas coloridas do mockup). Puramente visual. */
export function Ribbon({
  d,
  color,
  strokeWidth = 80,
  viewBox = '0 0 1480 900',
  className,
}: RibbonProps) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      fill="none"
      className={cn('pointer-events-none absolute', className)}
      preserveAspectRatio="none"
    >
      <path
        d={d}
        stroke={`var(--color-${color})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

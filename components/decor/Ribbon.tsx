import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

type RibbonProps = {
  d: string
  color: BrandColor
  strokeWidth?: number
  viewBox?: string
  className?: string
}

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

import { cn } from '@/lib/utils'
import type { BrandColor } from '@/types'

type SmileyProps = {
  color: BrandColor
  className?: string
}

// Placeholder dos "smileys" desenhados à mão do mockup — substituir pelo SVG exportado do Figma/Canva
export function Smiley({ color, className }: SmileyProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      stroke={`var(--color-${color})`}
      strokeWidth={8}
      strokeLinecap="round"
      className={cn('pointer-events-none', className)}
    >
      <circle cx="50" cy="50" r="42" />
      <path d="M38 36v8M62 36v8" />
      <path d="M30 60c10 14 30 14 40 0" />
    </svg>
  )
}

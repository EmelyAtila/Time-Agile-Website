import { cn } from '@/lib/utils'
import { site } from '@/content/site'

type LogoProps = {
  className?: string
  /** Mostra o "Marketing e Gestão" abaixo da marca */
  withTagline?: boolean
}

// TODO: trocar pelo SVG oficial da logomarca (public/images/logo.svg) quando disponível
export function Logo({ className, withTagline = true }: LogoProps) {
  return (
    <span className={cn('inline-flex flex-col leading-none', className)}>
      <span>
        <span className="font-serif italic">Time</span>
        <span className="font-sans font-extrabold">agile.</span>
      </span>
      {withTagline && (
        <span className="font-sans text-[0.25em] font-semibold uppercase">{site.tagline}</span>
      )}
    </span>
  )
}

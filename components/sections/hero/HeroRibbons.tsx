import { cn } from '@/lib/utils'
import { HERO_ART_DESKTOP, HERO_ART_MOBILE, type HeroArt } from './heroPaths'

type HeroRibbonsProps = {
  title: string
  mark: string
}

function Art({
  art,
  title,
  mark,
  className,
}: HeroRibbonsProps & { art: HeroArt; className?: string }) {
  const guideId = `hero-title-guide-${art.id}`

  // suppressHydrationWarning: o script inline do Hero (animations/heroBoot.ts) estica as curvas e prepara
  // o deslize do título antes de o React hidratar
  return (
    <svg
      suppressHydrationWarning
      data-intro="art"
      data-hero-art={art.id}
      data-stretch={art.stretch?.join(',')}
      aria-hidden
      viewBox={art.viewBox}
      preserveAspectRatio={art.preserveAspectRatio}
      fill="none"
      className={cn('pointer-events-none absolute inset-0 size-full', className)}
    >
      <defs>
        {/* Cópia sem pathLength: o da fita é normalizado para 1 e mexeria no startOffset */}
        <path suppressHydrationWarning id={guideId} d={art.title.guide} />
      </defs>

      {art.ribbons.map((ribbon) => (
        <path
          key={ribbon.color}
          suppressHydrationWarning
          data-ribbon={ribbon.color}
          d={ribbon.d}
          pathLength={1}
          stroke={`var(--color-${ribbon.color})`}
          strokeWidth={ribbon.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={ribbon.opacity}
        />
      ))}

      <text
        suppressHydrationWarning
        fontSize={art.title.fontSize}
        dy="0.36em"
        className="fill-white font-sans font-bold"
        style={{
          filter: `drop-shadow(0 ${art.title.fontSize * 0.05}px ${art.title.fontSize * 0.04}px rgb(0 0 0 / 0.25))`,
        }}
      >
        <textPath
          suppressHydrationWarning
          data-hero-title
          href={`#${guideId}`}
          startOffset={art.title.startOffset}
        >
          {`${title} `}
          <tspan data-hero-mark rotate={0}>
            {mark}
          </tspan>
        </textPath>
      </text>
    </svg>
  )
}

// As duas variantes vão para o HTML e o CSS mostra uma; o corte (lg) é o mesmo de useHeroIntro.ts
export function HeroRibbons(props: HeroRibbonsProps) {
  return (
    <>
      <Art art={HERO_ART_MOBILE} {...props} className="lg:hidden" />
      <Art art={HERO_ART_DESKTOP} {...props} className="hidden lg:block" />
    </>
  )
}

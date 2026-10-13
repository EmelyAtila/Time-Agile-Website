import { cn } from '@/lib/utils'
import { HERO_ART_DESKTOP, HERO_ART_MOBILE, type HeroArt } from './heroPaths'

type HeroRibbonsProps = {
  /** Texto que corre sobre a fita laranja (o <h1> acessível fica no Hero) */
  title: string
  /** Pontuação final do título: fica num <tspan> próprio para balançar sozinha (heroLoops.ts) */
  mark: string
}

function Art({
  art,
  title,
  mark,
  className,
}: HeroRibbonsProps & { art: HeroArt; className?: string }) {
  const guideId = `hero-title-guide-${art.id}`

  return (
    <svg
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
        <path id={guideId} d={art.title.guide} />
      </defs>

      {art.ribbons.map((ribbon) => (
        <path
          key={ribbon.color}
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
        fontSize={art.title.fontSize}
        dy="0.36em"
        className="fill-white font-sans font-bold"
        style={{
          filter: `drop-shadow(0 ${art.title.fontSize * 0.05}px ${art.title.fontSize * 0.04}px rgb(0 0 0 / 0.25))`,
        }}
      >
        <textPath data-hero-title href={`#${guideId}`} startOffset={art.title.startOffset}>
          {`${title} `}
          <tspan data-hero-mark rotate={0}>
            {mark}
          </tspan>
        </textPath>
      </text>
    </svg>
  )
}

/**
 * Fitas do Hero com o título sobre a laranja. As duas variantes vão para o HTML e o
 * CSS mostra uma só; o corte (lg) é o mesmo usado em animations/useHeroIntro.ts.
 */
export function HeroRibbons(props: HeroRibbonsProps) {
  return (
    <>
      <Art art={HERO_ART_MOBILE} {...props} className="lg:hidden" />
      <Art art={HERO_ART_DESKTOP} {...props} className="hidden lg:block" />
    </>
  )
}

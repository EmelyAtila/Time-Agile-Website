// Medidas em px de docs/Desktop - 1.svg, contadas do topo da faixa rosa (y 2958.56).
// No desktop `--u` vale 1px do mockup, por isso as classes lg: usam calc(N*var(--u)).
export const STAGE = { width: 1480, height: 1613.44 }

type Box = { x: number; y: number; width: number; height: number }

// Relativa à galeria; `photo` é relativa à moldura. Com `pull`, o hover puxa a foto para cima e para esse lado,
// como uma carta do baralho, sem passar por cima das outras; sem ele, ela sobe e gira por cima
export type Frame = Box & { photo: Box; z: number; pull?: 'left' | 'right' }

export type Gallery = Box & {
  // Maior largura da galeria abaixo do lg, para o `sizes` das fotos
  widthBelowLg: number
  className: string
  frames: Frame[]
}

export type ShowcaseArt = {
  band?: boolean
  article: string
  header: string
  title: string
  subtitle?: string
  description?: string
  // Cópia decorativa que mostra as linhas que passam da faixa rosa
  afterBand?: string
  gallery?: Gallery
}

const SCRIPT =
  'font-script text-[2.125rem] leading-none md:text-[2.5rem] lg:whitespace-nowrap lg:text-[length:calc(51.8*var(--u))]'

// Na ordem de PROJECTS (content/projects.ts)
export const SHOWCASE: ShowcaseArt[] = [
  {
    band: true,
    article:
      'relative pt-[5.25rem] md:col-span-2 md:grid md:grid-cols-[var(--frame)_1fr] md:grid-rows-[auto_1fr] md:gap-x-10 md:pt-[6.5rem] lg:static lg:block lg:p-0',
    header:
      'md:col-start-2 lg:absolute lg:left-[calc(398.9*var(--u))] lg:top-[calc(79.1*var(--u))]',
    title: SCRIPT,
    // Vinho sobre a faixa rosa: o branco do mockup dá 3,4:1, e texto corrido pede 4,5:1
    description:
      'mt-4 md:col-start-2 lg:absolute lg:left-[calc(524.4*var(--u))] lg:top-[calc(139.9*var(--u))] lg:mt-0 lg:max-w-[26em]',
    gallery: {
      x: 110,
      y: 144.44,
      width: 399,
      height: 559,
      widthBelowLg: 280,
      className: 'mt-8 w-[var(--frame)] md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0',
      frames: [
        {
          x: 0,
          y: 0,
          width: 399,
          height: 559,
          z: 1,
          photo: { x: 36, y: 35, width: 326, height: 489 },
        },
      ],
    },
  },
  {
    article:
      'mt-14 text-right md:col-span-2 md:mt-16 md:grid md:grid-cols-[1fr_var(--frame)] md:grid-rows-[auto_1fr] md:gap-x-10 lg:static lg:mt-0 lg:block',
    header:
      'md:col-start-1 lg:absolute lg:left-[calc(680.3*var(--u))] lg:top-[calc(365.5*var(--u))]',
    title: SCRIPT,
    // Duas linhas dentro da faixa; o resto aparece na cópia, deslocada como no mockup
    description:
      'mt-4 md:col-start-1 lg:absolute lg:right-[calc(552.5*var(--u))] lg:top-[calc(421.7*var(--u))] lg:mt-0 lg:h-[3.08em] lg:max-w-[13.3em] lg:overflow-hidden',
    afterBand:
      'lg:right-[calc(559.8*var(--u))] lg:top-[calc(438.7*var(--u))] lg:max-w-[13.3em] lg:[clip-path:inset(3.08em_0_0_0)]',
    gallery: {
      x: 946,
      y: 425.44,
      width: 400,
      height: 557,
      widthBelowLg: 280,
      className:
        'ml-auto mt-8 w-[var(--frame)] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0',
      frames: [
        {
          x: 0,
          y: 0,
          width: 400,
          height: 557,
          z: 1,
          photo: { x: 37, y: 34, width: 326, height: 488 },
        },
      ],
    },
  },
  {
    article: 'mt-16 md:mt-20 lg:mt-0',
    // Na frente das fotos, que sobem no hover
    header: 'relative z-10 lg:absolute lg:left-[calc(295.5*var(--u))] lg:top-[calc(801*var(--u))]',
    title: `${SCRIPT} text-brand-pink`,
    subtitle: `${SCRIPT} ml-[2.8em] mt-[0.1em] text-brand-orange-dark`,
    gallery: {
      x: 75,
      y: 881.44,
      width: 597,
      height: 732,
      widthBelowLg: 352,
      className: 'mt-6 w-full max-w-[22rem] lg:mt-0 lg:max-w-none',
      frames: [
        {
          x: 0,
          y: 0,
          width: 340,
          height: 496,
          z: 2,
          pull: 'left',
          photo: { x: 21, y: 24, width: 299, height: 449 },
        },
        {
          x: 244,
          y: 44,
          width: 353,
          height: 498,
          z: 1,
          pull: 'right',
          photo: { x: 26, y: 25, width: 300, height: 449 },
        },
        {
          x: 148,
          y: 396,
          width: 244,
          height: 336,
          z: 3,
          photo: { x: 22, y: 17, width: 201, height: 302 },
        },
      ],
    },
  },
  {
    article: 'mt-12 md:mt-20 md:self-center lg:mt-0',
    header: 'lg:absolute lg:left-[calc(727.4*var(--u))] lg:top-[calc(1084.2*var(--u))]',
    title:
      'font-sans text-[1.5rem] font-black leading-[1.35] md:text-[1.75rem] lg:whitespace-nowrap lg:text-[length:calc(40*var(--u))]',
    description:
      'mt-3 lg:absolute lg:left-[calc(732.4*var(--u))] lg:top-[calc(1160*var(--u))] lg:mt-0 lg:max-w-[25.5em]',
  },
]

'use client'

import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'
import { startHeroLoops } from './heroLoops'

type Variant = 'desktop' | 'mobile'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// Mesmo corte (lg) que troca a arte em components/sections/hero/HeroRibbons.tsx
const VARIANT_QUERY: Record<Variant, string> = {
  desktop: `(min-width: 1024px) and ${MOTION_OK}`,
  mobile: `(max-width: 1023.98px) and ${MOTION_OK}`,
}

/** Fitas na ordem de entrada: [cor, início (s), duração (s)]. A laranja puxa o título. */
const RIBBONS = [
  ['orange', 0, 1.4],
  ['pink', 0.25, 1.2],
  ['yellow', 0.4, 1.3],
  ['pink-light', 0.55, 1.2],
] as const

/** Atraso do título em relação à fita laranja: é o que faz o texto vir "atrás" dela */
const TITLE_DELAY = 0.2

/** Quanto esperar pelas fontes antes de tocar mesmo assim */
const FONT_TIMEOUT_MS = 400

/** Desliga o CSS anti-flash de styles/base.css: daqui em diante o GSAP cuida do estado inicial */
const READY_ATTR = 'data-intro-ready'

function buildIntro(section: HTMLElement, variant: Variant) {
  const art = section.querySelector<SVGSVGElement>(`[data-hero-art="${variant}"]`)
  if (!art) return null

  const inSection = gsap.utils.selector(section)
  const inArt = gsap.utils.selector(art)
  // O Header fica fora da <section>, então a busca é no documento
  const inHeader = (name: string) =>
    Array.from(document.querySelectorAll<HTMLElement>(`[data-intro="${name}"]`))

  const tl = gsap.timeline({ paused: true })

  // 1. Fitas se desenrolando a partir das bordas
  RIBBONS.forEach(([color, at, duration]) => {
    tl.fromTo(
      inArt(`[data-ribbon="${color}"]`),
      // pathLength=1 no SVG, então 1 = fita inteira. A folga (2 e 1.001) evita o
      // pontinho que a ponta arredondada deixaria antes de a fita começar.
      { strokeDasharray: '1 2', strokeDashoffset: 1.001 },
      {
        strokeDashoffset: 0,
        duration,
        ease: 'power2.out',
        // O GSAP arredonda px para inteiro; numa escala de 0 a 1 a fita só piscaria
        autoRound: false,
        clearProps: 'strokeDasharray,strokeDashoffset',
      },
      at
    )
  })

  // 2. Título deslizando pela fita laranja, sempre atrás da ponta dela
  const title = art.querySelector<SVGTextPathElement>('[data-hero-title]')
  const guide = art.querySelector<SVGPathElement>('defs path')
  if (title && guide) {
    const rest = parseFloat(title.getAttribute('startOffset') ?? '0')
    const length = (title.getComputedTextLength() / guide.getTotalLength()) * 100
    tl.fromTo(
      title,
      // Começa todo antes do início do path: letras fora do path não são desenhadas
      { attr: { startOffset: `${-(length + 2)}%` } },
      { attr: { startOffset: `${rest}%` }, duration: 1.6, ease: 'back.out(1.1)' },
      TITLE_DELAY
    )
  }

  // 3. Logo, peça por peça
  const logoPart = (name: string) => inSection(`[data-intro="logo"] [data-part="${name}"]`)
  const logoLetters = (name: string) => inSection(`[data-intro="logo"] [data-part="${name}"] path`)
  const fromBase = { transformOrigin: '50% 100%' }

  tl.addLabel('logo', 0.95)
    .fromTo(
      logoLetters('time'),
      { ...fromBase, y: 26, rotation: -6, autoAlpha: 0 },
      { y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'back.out(1.7)' },
      'logo'
    )
    .fromTo(
      logoLetters('agile'),
      { ...fromBase, scale: 0 },
      { scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(2.2)' },
      'logo+=0.15'
    )
    .fromTo(
      logoLetters('bars'),
      { ...fromBase, scaleY: 0 },
      { scaleY: 1, duration: 0.45, stagger: 0.05, ease: 'back.out(3)' },
      'logo+=0.3'
    )
    .fromTo(
      logoPart('dot'),
      { y: -70, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: 'bounce.out' },
      'logo+=0.5'
    )
    .fromTo(
      logoPart('tagline'),
      { x: -14, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' },
      'logo+=0.75'
    )

  // 4. Navegação e redes sociais
  const navItems = inHeader('nav-item')
  if (navItems.length) {
    tl.fromTo(
      navItems,
      { y: -24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.8)' },
      1.1
    )
  }

  // A posição da barra é de useNavScrollSpy (x e scaleX); aqui ela só brota da base
  const navIndicator = document.querySelector<HTMLElement>('[data-nav-indicator]')
  if (navIndicator) {
    tl.fromTo(
      navIndicator,
      { transformOrigin: '50% 100%', scaleY: 0, autoAlpha: 0 },
      { scaleY: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(3)' },
      1.5
    )
  }

  const headerButtons = [...inHeader('cta'), ...inHeader('menu-button')]
  if (headerButtons.length) {
    tl.fromTo(
      headerButtons,
      { scale: 0.6, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.4)' },
      1.35
    )
  }

  tl.fromTo(
    inSection('[data-intro="social"]'),
    { scale: 0, rotation: -12, autoAlpha: 0 },
    { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)' },
    1.45
  ).fromTo(
    inSection('[data-intro="social"] li'),
    { scale: 0 },
    { scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(3)' },
    1.6
  )

  // Terminou: devolve tudo ao CSS (sem transform/opacity inline sobrando para hovers e futuras animações)
  tl.set(
    [
      ...inSection('[data-intro="logo"] [data-part], [data-intro="logo"] [data-part] path'),
      ...inSection('[data-intro="social"], [data-intro="social"] li'),
      ...navItems,
      ...headerButtons,
    ],
    { clearProps: 'all' }
  )

  return tl
}

/**
 * Animação de entrada do Hero: as fitas se desenrolam, o título vem atrás pela laranja
 * e depois entram logo, navegação e redes. Toca uma vez por carregamento da página.
 * Quando termina, liga os loops de animations/heroLoops.ts.
 * Uso: const ref = useRef(null); useHeroIntro(ref); <section ref={ref}>…</section>
 * Mapa dos tempos e ideias adiadas: docs/HERO-ANIMATIONS.md
 */
export function useHeroIntro(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = ref.current
      if (!section) return

      let played = false
      const mm = gsap.matchMedia()

      const run = (variant: Variant) => (context: gsap.Context) => {
        // Pelo contexto do matchMedia: trocar de variante desfaz os loops da anterior
        const startLoops = () => {
          context.add(() => startHeroLoops(section, variant))
        }

        // Cruzar o breakpoint depois da entrada não repete a animação, só religa os loops
        if (played) return startLoops()
        played = true

        const tl = buildIntro(section, variant)
        document.documentElement.setAttribute(READY_ATTR, '')
        if (!tl) return

        tl.eventCallback('onComplete', startLoops)

        // Espera a Satoshi para o título não mudar de largura no meio do caminho
        let cancelled = false
        const timeout = new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS))
        Promise.race([document.fonts.ready, timeout]).then(() => {
          if (!cancelled) tl.play()
        })

        return () => {
          cancelled = true
        }
      }

      mm.add(VARIANT_QUERY.desktop, run('desktop'))
      mm.add(VARIANT_QUERY.mobile, run('mobile'))
    },
    { scope: ref }
  )
}

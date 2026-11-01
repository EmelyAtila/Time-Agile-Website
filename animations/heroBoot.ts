// Nada de fora dentro das funções (imports só no CONFIG): elas vão como texto para o <script> inline do Hero
// (HERO_BOOT) e rodam durante o parse do HTML, antes do React. Mapa dos tempos: docs/HERO-ANIMATIONS.md

import { PRELOADER_ATTR, PRELOADER_REVEAL_ATTR, PRELOADER_REVEAL_EVENT } from './preloaderBoot'

export const INTRO_BOOT_ATTR = 'data-intro-boot'
export const INTRO_PLAY_ATTR = 'data-intro-play'
export const INTRO_DONE_ATTR = 'data-intro-done'

// Estica só o x das curvas em vez de ampliar e cortar o SVG, que comia os laços em telas largas
export function stretchHeroArt(section: HTMLElement) {
  const NUMBER = /-?\d*\.?\d+(?:e-?\d+)?/g
  // Só comandos M e C absolutos: aí os números alternam x, y e dá para esticar só o x
  const ONLY_ABSOLUTE_M_C = /^[MC\d\s.,e+-]+$/
  const round = (value: number) => Math.round(value * 100) / 100

  const svg = section.querySelector<SVGSVGElement>('svg[data-stretch]')
  if (!svg) return

  const [min, max] = (svg.dataset.stretch ?? '1,1').split(',').map(Number)
  // Os valores do mockup ficam guardados em data-* para sempre partir do original
  svg.dataset.viewBox ??= svg.getAttribute('viewBox') ?? ''
  const [, , baseWidth, baseHeight] = svg.dataset.viewBox.split(/\s+/).map(Number)
  const { width, height } = section.getBoundingClientRect()
  if (!baseWidth || !baseHeight || !width || !height) return

  const k = round(Math.min(max, Math.max(min, width / height / (baseWidth / baseHeight))))
  if (svg.dataset.k === String(k)) return
  svg.dataset.k = String(k)

  const thickness = Math.sqrt(k)
  svg.setAttribute('viewBox', `0 0 ${round(baseWidth * k)} ${baseHeight}`)
  svg.querySelectorAll('path').forEach((path) => {
    path.dataset.d ??= path.getAttribute('d') ?? ''
    if (!ONLY_ABSOLUTE_M_C.test(path.dataset.d)) return
    let index = 0
    path.setAttribute(
      'd',
      path.dataset.d.replace(NUMBER, (n) => (index++ % 2 === 0 ? String(round(Number(n) * k)) : n))
    )
    path.dataset.strokeWidth ??= path.getAttribute('stroke-width') ?? ''
    if (path.dataset.strokeWidth) {
      path.setAttribute('stroke-width', String(round(Number(path.dataset.strokeWidth) * thickness)))
    }
  })
  svg.querySelectorAll('text').forEach((text) => {
    text.dataset.fontSize ??= text.getAttribute('font-size') ?? ''
    if (text.dataset.fontSize) {
      text.setAttribute('font-size', String(round(Number(text.dataset.fontSize) * thickness)))
    }
  })
}

type BootConfig = {
  bootAttr: string
  playAttr: string
  doneAttr: string
  introMs: number
  fontTimeoutMs: number
  titleDelay: number
  titleDuration: number
  preloaderAttr: string
  revealAttr: string
  revealEvent: string
}

// O resto da entrada é CSS (styles/hero-intro.css), que começa quando playAttr aparece no <html>
export function bootHero(stretch: (section: HTMLElement) => void, config: BootConfig) {
  const html = document.documentElement
  const section = document.currentScript?.closest('section')
  if (!section) return
  // Avisa o React que a entrada já começou
  html.setAttribute(config.bootAttr, '')

  const play = () => {
    html.setAttribute(config.playAttr, '')
    setTimeout(() => html.setAttribute(config.doneAttr, ''), config.introMs)
  }

  const fail = () => {
    if (!html.hasAttribute(config.playAttr)) play()
  }

  const start = () => {
    try {
      const variant = matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'mobile'
      const title = section.querySelector<SVGTextPathElement>(
        `[data-hero-art="${variant}"] [data-hero-title]`
      )
      const guide = title?.closest('svg')?.querySelector<SVGPathElement>('defs path')
      if (!title || !guide) return play()

      // Só o título espera a fonte dele, senão mudaria de largura no meio do caminho; o resto começa já
      const { fontWeight, fontFamily } = getComputedStyle(title)
      const fontReady = document.fonts.load(`${fontWeight} 1em ${fontFamily}`)
      const timeout = new Promise((resolve) => setTimeout(resolve, config.fontTimeoutMs))
      const rest = title.getAttribute('startOffset') ?? '0'

      // Fora do path até a fonte chegar: letras fora do path não são desenhadas
      title.setAttribute('startOffset', '-100%')
      play()
      const titleAt = performance.now() + config.titleDelay * 1000

      // O startOffset muda a cada quadro, no relógio das animações de CSS. Um <animate> do SVG só andaria
      // quando a linha do tempo de animação do documento começa, que no Chrome é perto do fim do carregamento
      const slide = () => {
        try {
          // Começa todo antes do início do path
          const from = -((title.getComputedTextLength() / guide.getTotalLength()) * 100 + 2)
          const to = parseFloat(rest)
          const begin = Math.max(titleAt, performance.now())
          const duration = config.titleDuration * 1000
          const frame = (now: number) => {
            const p = Math.min(Math.max((now - begin) / duration, 0), 1)
            // back.out(1.1) do GSAP
            const q = p - 1
            const value = from + (to - from) * (q * q * (2.1 * q + 1.1) + 1)
            title.setAttribute('startOffset', p < 1 ? `${Math.round(value * 1000) / 1000}%` : rest)
            if (p < 1) requestAnimationFrame(frame)
          }
          title.setAttribute('startOffset', `${Math.round(from * 1000) / 1000}%`)
          requestAnimationFrame(frame)
        } catch {
          title.setAttribute('startOffset', rest)
        }
      }

      Promise.race([fontReady, timeout]).then(slide, slide)
    } catch {
      fail()
    }
  }

  try {
    stretch(section)
    if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return

    // Com o pre-loader na tela, a entrada espera a cortina dele começar a subir
    if (html.hasAttribute(config.preloaderAttr) && !html.hasAttribute(config.revealAttr)) {
      document.addEventListener(config.revealEvent, start, { once: true })
    } else {
      start()
    }
  } catch {
    fail()
  }
}

const CONFIG: BootConfig = {
  bootAttr: INTRO_BOOT_ATTR,
  playAttr: INTRO_PLAY_ATTR,
  doneAttr: INTRO_DONE_ATTR,
  // Fim da última entrada (redes: 1,45s + 0,9s)
  introMs: 2350,
  fontTimeoutMs: 400,
  titleDelay: 0.2,
  titleDuration: 1.6,
  preloaderAttr: PRELOADER_ATTR,
  revealAttr: PRELOADER_REVEAL_ATTR,
  revealEvent: PRELOADER_REVEAL_EVENT,
}

export const HERO_BOOT = `(${bootHero})(${stretchHeroArt},${JSON.stringify(CONFIG)})`

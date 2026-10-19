// Sem imports nem nada de fora nas funções: elas vão como texto para o <script> inline do Hero
// (HERO_BOOT) e rodam durante o parse do HTML, antes do React. Mapa dos tempos: docs/HERO-ANIMATIONS.md

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
}

// O resto da entrada é CSS (styles/hero-intro.css), que começa quando playAttr aparece no <html>
export function bootHero(stretch: (section: HTMLElement) => void, config: BootConfig) {
  const html = document.documentElement
  const section = document.currentScript?.closest('section')
  if (!section) return
  // Avisa o React que a entrada já está a caminho, mesmo enquanto espera a fonte
  html.setAttribute(config.bootAttr, '')

  let started = false
  let title: SVGTextPathElement | null = null

  // O título desliza pelo path com um <animate> no startOffset (CSS não anima atributo)
  const slideTitle = () => {
    const art = title?.closest('svg')
    const guide = art?.querySelector<SVGPathElement>('defs path')
    const slide = title?.querySelector<SVGAnimateElement>('animate')
    if (!title || !guide || !slide) return

    const rest = parseFloat(title.getAttribute('startOffset') ?? '0')
    // Começa todo antes do início do path: letras fora do path não são desenhadas
    const length = (title.getComputedTextLength() / guide.getTotalLength()) * 100
    const from = -Math.round((length + 2) * 1000) / 1000
    const total = config.titleDelay + config.titleDuration
    const hold = config.titleDelay / total
    const steps = 30
    const values = [from]
    const keyTimes = [0]
    for (let i = 0; i <= steps; i++) {
      // back.out(1.1) do GSAP
      const p = i / steps - 1
      const eased = p * p * (2.1 * p + 1.1) + 1
      values.push(Math.round((from + (rest - from) * eased) * 1000) / 1000)
      keyTimes.push(Math.round((hold + (1 - hold) * (i / steps)) * 10000) / 10000)
    }
    slide.setAttribute('dur', `${total}s`)
    slide.setAttribute('values', values.map((value) => `${value}%`).join(';'))
    slide.setAttribute('keyTimes', keyTimes.join(';'))
    slide.beginElement()
  }

  const start = () => {
    if (started) return
    started = true
    try {
      slideTitle()
    } finally {
      html.setAttribute(config.playAttr, '')
      setTimeout(() => html.setAttribute(config.doneAttr, ''), config.introMs)
    }
  }

  try {
    stretch(section)
    if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return

    const variant = matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'mobile'
    title = section.querySelector(`[data-hero-art="${variant}"] [data-hero-title]`)
    if (!title) return start()

    // Só a fonte do título: o título não muda de largura no meio do caminho
    const { fontWeight, fontFamily } = getComputedStyle(title)
    const timeout = new Promise((resolve) => setTimeout(resolve, config.fontTimeoutMs))
    Promise.race([document.fonts.load(`${fontWeight} 1em ${fontFamily}`), timeout]).then(
      start,
      start
    )
  } catch {
    start()
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
}

export const HERO_BOOT = `(${bootHero})(${stretchHeroArt},${JSON.stringify(CONFIG)})`

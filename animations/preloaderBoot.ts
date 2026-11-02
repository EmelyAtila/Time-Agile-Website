// Sem imports nem nada de fora na função: ela vai como texto para o <script> inline do Preloader e roda
// no começo do <body>, antes do React. O resto é CSS (styles/preloader.css). Tempos: docs/HERO-ANIMATIONS.md

import { RESTORE_ATTR } from './scrollRestoreBoot'

export const PRELOADER_ATTR = 'data-preloader'
export const PRELOADER_REVEAL_ATTR = 'data-preloader-reveal'
export const PRELOADER_DONE_ATTR = 'data-preloader-done'
export const PRELOADER_REVEAL_EVENT = 'preloader:reveal'

type PreloaderConfig = {
  attr: string
  restoreAttr: string
  readyAttr: string
  exitAttr: string
  revealAttr: string
  doneAttr: string
  revealEvent: string
  barSelector: string
  settleRate: number
  storageKey: string
  minMs: number
  maxMs: number
  holdMs: number
  revealMs: number
  doneMs: number
}

export function bootPreloader(config: PreloaderConfig) {
  const html = document.documentElement
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return
  // Recarregou no meio da página (animations/scrollRestoreBoot.ts): volta direto para lá
  if (html.hasAttribute(config.restoreAttr)) return
  try {
    if (sessionStorage.getItem(config.storageKey)) return
  } catch {}

  html.setAttribute(config.attr, '')
  const start = performance.now()
  let isReady = false

  const ready = () => {
    if (isReady) return
    isReady = true
    html.setAttribute(config.readyAttr, '')

    // As barras terminam a batida em curso, mais rápido, em vez de saltar para a altura cheia; mexer só no
    // tempo da animação a mantém no compositor
    try {
      document.querySelectorAll(config.barSelector).forEach((bar) =>
        bar.getAnimations().forEach((animation) => {
          const iteration = animation.effect?.getComputedTiming().currentIteration
          if (iteration == null) return
          animation.effect?.updateTiming({ iterations: iteration + 1 })
          animation.updatePlaybackRate(config.settleRate)
        })
      )
    } catch {}

    setTimeout(() => {
      html.setAttribute(config.exitAttr, '')
      setTimeout(() => {
        html.setAttribute(config.revealAttr, '')
        document.dispatchEvent(new Event(config.revealEvent))
      }, config.revealMs)
      setTimeout(() => {
        html.setAttribute(config.doneAttr, '')
        try {
          sessionStorage.setItem(config.storageKey, '1')
        } catch {}
      }, config.doneMs)
    }, config.holdMs)
  }

  // O loop das barras dura pelo menos minMs e no máximo maxMs. Espera o HTML, não o load: imagens e fontes
  // continuam chegando por trás, e cada segundo aqui atrasa o Hero (e o LCP)
  const onParsed = () => setTimeout(ready, Math.max(0, config.minMs - (performance.now() - start)))
  if (document.readyState !== 'loading') onParsed()
  else addEventListener('DOMContentLoaded', onParsed, { once: true })
  setTimeout(ready, config.maxMs)
}

const CONFIG: PreloaderConfig = {
  attr: PRELOADER_ATTR,
  restoreAttr: RESTORE_ATTR,
  readyAttr: 'data-preloader-ready',
  exitAttr: 'data-preloader-exit',
  revealAttr: PRELOADER_REVEAL_ATTR,
  doneAttr: PRELOADER_DONE_ATTR,
  revealEvent: PRELOADER_REVEAL_EVENT,
  barSelector: '[data-pl-bar]',
  // A batida dura 0,9s: no dobro da velocidade, termina junto com a volta das barras (0,45s)
  settleRate: 2,
  storageKey: 'time-agile:preloader',
  minMs: 250,
  maxMs: 800,
  // Montagem da logo (~0,85s) mais uma pausa curta para ela ser vista inteira
  holdMs: 1050,
  // A borda da cortina vinho passa do meio da tela (pl-lift em styles/preloader.css)
  revealMs: 550,
  // Fim do pl-lift: as faixas de cor já saíram
  doneMs: 1100,
}

export const PRELOADER_BOOT = `(${bootPreloader})(${JSON.stringify(CONFIG)})`

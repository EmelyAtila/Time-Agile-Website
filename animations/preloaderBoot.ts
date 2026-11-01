// Sem imports nem nada de fora na função: ela vai como texto para o <script> inline do Preloader e roda
// no começo do <body>, antes do React. O resto é CSS (styles/preloader.css). Tempos: docs/HERO-ANIMATIONS.md

export const PRELOADER_ATTR = 'data-preloader'
export const PRELOADER_REVEAL_ATTR = 'data-preloader-reveal'
export const PRELOADER_DONE_ATTR = 'data-preloader-done'
export const PRELOADER_REVEAL_EVENT = 'preloader:reveal'

type PreloaderConfig = {
  attr: string
  readyAttr: string
  exitAttr: string
  revealAttr: string
  doneAttr: string
  revealEvent: string
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

  // O loop das barras dura pelo menos minMs, mesmo com a página em cache, e no máximo maxMs
  const onLoad = () => setTimeout(ready, Math.max(0, config.minMs - (performance.now() - start)))
  if (document.readyState === 'complete') onLoad()
  else addEventListener('load', onLoad, { once: true })
  setTimeout(ready, config.maxMs)
}

const CONFIG: PreloaderConfig = {
  attr: PRELOADER_ATTR,
  readyAttr: 'data-preloader-ready',
  exitAttr: 'data-preloader-exit',
  revealAttr: PRELOADER_REVEAL_ATTR,
  doneAttr: PRELOADER_DONE_ATTR,
  revealEvent: PRELOADER_REVEAL_EVENT,
  storageKey: 'time-agile:preloader',
  minMs: 700,
  // Com a saída, o Hero começa antes do failsafe de 4s de styles/base.css
  maxMs: 1800,
  // Montagem da logo (~1,3s) mais uma pausa para ela ser vista inteira
  holdMs: 1500,
  // A borda da cortina vinho passa do meio da tela (pl-lift em styles/preloader.css)
  revealMs: 550,
  // Fim do pl-lift: as faixas de cor já saíram
  doneMs: 1100,
}

export const PRELOADER_BOOT = `(${bootPreloader})(${JSON.stringify(CONFIG)})`

// Sem imports nem nada de fora nas funções: elas vão como texto para <script> inline e rodam antes do React.
// A restauração do navegador chega em algum momento do carregamento, depois de as entradas de scroll e o intro
// do Hero já terem decidido o que fazer com base no topo da página: aqui ela acontece antes de todos eles

export const RESTORE_ATTR = 'data-restore'

type RestoreConfig = {
  attr: string
  storageKey: string
  heroId: string
}

type Saved = { path: string; id: string; offset: number }

// Começo do <body>: decide se vai restaurar e marca o <html> (valor "hero" dentro do Hero, vazio fora dele),
// para o pre-loader e o intro do Hero pularem
export function bootScrollRestore(config: RestoreConfig) {
  const html = document.documentElement
  try {
    history.scrollRestoration = 'manual'
  } catch {}

  // Relativo à seção, não em px da página: fontes e imagens que chegam depois mudam a altura do que vem antes
  addEventListener('pagehide', () => {
    try {
      // A última seção cujo topo já passou do topo da tela
      let saved: Saved | undefined
      for (const section of document.querySelectorAll<HTMLElement>('main section[id]')) {
        const top = section.getBoundingClientRect().top
        if (top > 0) break
        saved = { path: location.pathname, id: section.id, offset: -top }
      }
      if (saved && scrollY > 0) sessionStorage.setItem(config.storageKey, JSON.stringify(saved))
      else sessionStorage.removeItem(config.storageKey)
    } catch {}
  })

  try {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const raw = sessionStorage.getItem(config.storageKey)
    // Com #âncora na URL, quem manda é ela
    if (entry?.type !== 'reload' || !raw || location.hash) return
    const saved = JSON.parse(raw) as Saved
    if (saved.path !== location.pathname) return
    // Dentro do próprio Hero, ele aparece na tela e o intro toca
    html.setAttribute(config.attr, saved.id === config.heroId ? 'hero' : '')
  } catch {}
}

// Fim do <body>: a página inteira já está no HTML, então a seção tem o tamanho e o lugar certos
export function applyScrollRestore(config: RestoreConfig) {
  const html = document.documentElement
  if (!html.hasAttribute(config.attr)) return
  try {
    const saved = JSON.parse(sessionStorage.getItem(config.storageKey) ?? '') as Saved
    const section = document.getElementById(saved.id)
    if (!section) return
    const restore = () =>
      scrollTo({ top: section.getBoundingClientRect().top + scrollY + saved.offset, behavior: 'instant' })
    restore()

    // A troca das fontes (display: swap) ainda mexe nas alturas: acerta de novo se a pessoa não rolou antes
    let moved = false
    const stop = () => {
      moved = true
    }
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    events.forEach((type) => addEventListener(type, stop, { once: true, passive: true }))
    document.fonts.ready.then(() => {
      events.forEach((type) => removeEventListener(type, stop))
      if (!moved) restore()
    })
  } catch {}
}

const CONFIG: RestoreConfig = {
  attr: RESTORE_ATTR,
  storageKey: 'time-agile:scroll',
  heroId: 'inicio',
}

export const SCROLL_RESTORE_BOOT = `(${bootScrollRestore})(${JSON.stringify(CONFIG)})`
export const SCROLL_RESTORE_APPLY = `(${applyScrollRestore})(${JSON.stringify(CONFIG)})`

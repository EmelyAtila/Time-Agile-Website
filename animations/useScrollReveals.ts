'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from './gsap.config'
import { LEAD, REVEALS, type RevealEnv, type RevealName } from './reveals'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'
const DESKTOP = '(min-width: 1024px)'

const START_AT = 0.8
const FONT_TIMEOUT_MS = 400

// Desliga o CSS anti-flash de styles/base.css
const READY_ATTR = 'data-reveal-ready'

// O que as entradas deixam inline; no fim volta tudo ao CSS, para os hovers
const CLEAR = 'transform,transformOrigin,opacity,visibility,clipPath,filter,pointerEvents,transition'

type Group = Pick<RevealEnv, 'splits' | 'extras'>

// Topo do elemento a 80% da tela, mas nunca depois do fim da rolagem: o que fica perto do fim da página
// também dispara. O clamp() do ScrollTrigger não serve, porque parar exatamente no limite não conta como passar
const startFor = (trigger: Element) => () =>
  Math.min(
    trigger.getBoundingClientRect().top + window.scrollY - window.innerHeight * START_AT,
    ScrollTrigger.maxScroll(window) - 1
  )

// Cada [data-reveal] entra com o [data-reveal-group] mais próximo. Sem grupo, ou num grupo "lg" abaixo
// do lg (blocos altos no celular), ele dispara sozinho quando chega à tela. Quem está dentro de outro
// [data-reveal] (destaque no título, campos no formulário) entra sempre com ele
function collectGroups(desktop: boolean) {
  const groups = new Map<Element, HTMLElement[]>()
  const keyOf = new Map<Element, Element>()
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const outer = el.parentElement?.closest('[data-reveal]')
    const group = el.closest<HTMLElement>('[data-reveal-group]')
    const key =
      (outer && keyOf.get(outer)) ??
      (!group || (group.dataset.revealGroup === 'lg' && !desktop) ? el : group)
    keyOf.set(el, key)
    groups.set(key, [...(groups.get(key) ?? []), el])
  })
  return groups
}

function buildTimeline(items: HTMLElement[], env: Omit<RevealEnv, 'index'>) {
  const tl = gsap.timeline({ paused: true })
  const counts = new Map<RevealName, number>()
  let lead: number | null = null

  items.forEach((el) => {
    const name = el.dataset.reveal as RevealName
    if (!(name in REVEALS)) return
    const index = counts.get(name) ?? 0
    counts.set(name, index + 1)

    const animation = REVEALS[name](el, { ...env, index })
    // data-reveal-at (posição do GSAP) só vale dentro de um grupo
    const at = items.length > 1 ? el.dataset.revealAt : undefined
    tl.add(animation, at ?? (lead === null ? 0 : `<${lead}`))
    lead = LEAD[name]
  })

  return tl
}

// Elementos marcados com data-reveal entram uma vez, ao chegar à tela. Contrato: docs/SCROLL-ANIMATIONS.md
export function useScrollReveals() {
  // Cruzar o lg reconstrói as entradas e muda os grupos: o que já tocou fica pronto
  const played = useRef(new WeakSet<Element>())
  const markPlayed = (items: Element[]) => items.forEach((el) => played.current.add(el))
  // O revert do SplitText recria o HTML de dentro do título: o destaque vira outro nó, e vale o de fora
  const hasPlayed = (el: Element) =>
    played.current.has(el) || played.current.has(el.parentElement?.closest('[data-reveal]') ?? el)

  useGSAP(() => {
    const html = document.documentElement

    gsap.matchMedia().add({ motion: MOTION_OK, desktop: DESKTOP }, (context) => {
      const { motion, desktop } = context.conditions as { motion: boolean; desktop: boolean }
      if (!motion) {
        html.setAttribute(READY_ATTR, '')
        return
      }

      const groups: Group[] = []
      let cancelled = false

      const build = () => {
        collectGroups(desktop).forEach((all, key) => {
          const items = all.filter((el) => !hasPlayed(el))
          if (!items.length) return
          // Grupo sem altura (filhos todos absolutos) dispara pela posição do primeiro elemento
          const trigger = key.getBoundingClientRect().height ? key : items[0]
          // Já passou da tela (recarregou no meio da página): fica pronto, sem animar
          if (trigger.getBoundingClientRect().bottom <= 0) {
            markPlayed(items)
            return
          }

          const group: Group = { splits: [], extras: [] }
          groups.push(group)
          const tl = buildTimeline(items, { desktop, ...group })

          tl.eventCallback('onComplete', () => {
            // O alvo de um .call() é a própria função
            const targets = tl
              .getChildren(true, true, false)
              .flatMap((tween) => (tween as gsap.core.Tween).targets<unknown>())
              .filter((target): target is Element => target instanceof Element)
            gsap.set(targets, { clearProps: CLEAR })
            group.splits.forEach((split) => split.revert())
          })

          ScrollTrigger.create({
            trigger,
            start: startFor(trigger),
            once: true,
            onEnter: () => {
              markPlayed(items)
              tl.play()
            },
          })
        })
      }

      // Espera as fontes: o SplitText mede as palavras na fonte final
      const timeout = new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS))
      Promise.race([document.fonts.ready, timeout]).then(() => {
        if (cancelled) return
        context.add(build)
        html.setAttribute(READY_ATTR, '')
      })

      return () => {
        cancelled = true
        groups.forEach((group) => {
          group.splits.forEach((split) => split.revert())
          group.extras.forEach((animation) => animation.revert())
        })
      }
    })
  })
}

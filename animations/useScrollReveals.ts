'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from './gsap.config'
import { LEAD, REVEALS, type RevealEnv, type RevealName } from './reveals'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'
const DESKTOP = '(min-width: 1024px)'

// Frações da altura da tela: começa com o topo a 80%, termina com o bloco inteiro na tela (ou, se ele
// for mais alto que a tela, com o topo a 20%), sempre com pelo menos 35% de rolagem entre os dois
const START_AT = 0.8
const TALL_END_AT = 0.2
const MIN_RANGE = 0.35

// Segundos que a entrada leva para alcançar a rolagem
const LAG = 0.5
const FONT_TIMEOUT_MS = 400

// Desliga o CSS anti-flash de styles/base.css
const READY_ATTR = 'data-reveal-ready'

// O que as entradas deixam inline; no fim volta tudo ao CSS, para os hovers
const CLEAR =
  'transform,transformOrigin,opacity,visibility,clipPath,filter,pointerEvents,transition'

type Group = Pick<RevealEnv, 'splits' | 'extras'>

// Medida sem o transform da própria entrada (um pop em scale 0 teria altura 0)
function layoutRect(el: Element) {
  const { style } = el as HTMLElement
  const transform = style.transform
  style.transform = 'none'
  const rect = el.getBoundingClientRect()
  style.transform = transform
  return rect
}

// Trecho da rolagem (px) em que a entrada acontece. Nunca passa do fim da rolagem: o que fica perto do fim
// da página (rodapé) também termina
function scrollRange(trigger: Element) {
  const rect = layoutRect(trigger)
  const vh = window.innerHeight
  const top = rect.top + window.scrollY
  const last = ScrollTrigger.maxScroll(window) - 1

  let start = top - vh * START_AT
  let end = Math.max(
    Math.min(rect.bottom + window.scrollY - vh, top - vh * TALL_END_AT),
    start + vh * MIN_RANGE
  )
  if (end > last) {
    end = last
    start = Math.min(start, end - vh * MIN_RANGE)
  }
  return { start, end }
}

// Cada [data-reveal] entra com o [data-reveal-group] mais próximo. Sem grupo, ou num grupo "lg" abaixo
// do lg (blocos altos no celular), ele entra sozinho. Quem está dentro de outro [data-reveal]
// (destaque no título, campos no formulário) entra sempre com ele
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

// Elementos marcados com data-reveal entram presos à rolagem: avançam enquanto o bloco entra na tela e
// terminam com ele inteiro nela. Só avançam, nunca voltam. Contrato: docs/SCROLL-ANIMATIONS.md
export function useScrollReveals() {
  // Cruzar o lg reconstrói as entradas e muda os grupos: o que já terminou fica pronto
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
          // Grupo sem altura (filhos todos absolutos) acompanha a posição do primeiro elemento
          const trigger = layoutRect(key).height ? key : items[0]
          // Já passou (recarregou no meio da página): fica pronto, sem animar
          if (window.scrollY >= scrollRange(trigger).end) {
            markPlayed(items)
            return
          }

          const group: Group = { splits: [], extras: [] }
          groups.push(group)
          const tl = buildTimeline(items, { desktop, ...group })

          let done = false
          const finish = () => {
            if (done) return
            done = true
            markPlayed(items)
            scroll.kill()
            // O alvo de um .call() é a própria função
            const targets = tl
              .getChildren(true, true, false)
              .flatMap((tween) => (tween as gsap.core.Tween).targets<unknown>())
              .filter((target): target is Element => target instanceof Element)
            gsap.set(targets, { clearProps: CLEAR })
            group.splits.forEach((split) => split.revert())
          }

          // A entrada persegue a rolagem com atraso, para não andar aos trancos. false: dispara os .call()
          const shown = { progress: 0 }
          let reached = 0
          const follow = gsap.quickTo(shown, 'progress', {
            duration: LAG,
            ease: 'power1.out',
            onUpdate: () => {
              tl.progress(shown.progress, false)
              if (shown.progress >= 1) finish()
            },
          })

          const advance = ({ progress }: ScrollTrigger) => {
            if (progress <= reached) return
            reached = progress
            follow(progress)
          }

          const scroll = ScrollTrigger.create({
            trigger,
            start: () => scrollRange(trigger).start,
            end: () => scrollRange(trigger).end,
            onUpdate: advance,
            onRefresh: advance,
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

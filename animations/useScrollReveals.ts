'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { cancelIdle, whenIdle } from '@/lib/idle'
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

// Os grupos são montados aos poucos, nos intervalos livres: de uma vez, travaria a entrada do Hero
const SLICE_MS = 8
const IDLE_TIMEOUT_MS = 300

// Desligam o CSS anti-flash de styles/base.css: o primeiro por elemento, o segundo quando todos foram montados
const BUILT_ATTR = 'data-reveal-built'
const READY_ATTR = 'data-reveal-ready'

// O que as entradas deixam inline; no fim volta tudo ao CSS, para os hovers
const CLEAR =
  'transform,transformOrigin,opacity,visibility,clipPath,filter,pointerEvents,transition'

type Group = Pick<RevealEnv, 'splits' | 'extras'> & { items: HTMLElement[]; done: boolean }
type Pending = { items: HTMLElement[]; trigger: Element; distance: number; play: boolean }

// Posição na página sem transforms e só lendo: escrever antes de medir forçaria um layout por grupo.
// Nos SVGs, as entradas animam um <g data-pop> de dentro, então o <svg> pode ser medido como está
function layoutBox(el: Element) {
  if (el instanceof HTMLElement) {
    let top = 0
    for (let node: Element | null = el; node instanceof HTMLElement; node = node.offsetParent) {
      top += node.offsetTop
    }
    return { top, height: el.offsetHeight }
  }
  const rect = el.getBoundingClientRect()
  return { top: rect.top + window.scrollY, height: rect.height }
}

// Trecho da rolagem (px) em que a entrada acontece. Nunca passa do fim da rolagem: o que fica perto do fim
// da página (rodapé) também termina
function scrollRange(trigger: Element) {
  const { top, height } = layoutBox(trigger)
  const vh = window.innerHeight
  const last = ScrollTrigger.maxScroll(window) - 1

  let start = top - vh * START_AT
  let end = Math.max(Math.min(top + height - vh, top - vh * TALL_END_AT), start + vh * MIN_RANGE)
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

const markBuilt = (items: Element[]) => items.forEach((el) => el.setAttribute(BUILT_ATTR, ''))

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
      let pending: Pending[] | null = null
      let handle = 0
      let cancelled = false

      // Fila do mais perto da tela para o mais longe; o que já passou fica pronto, sem animar
      const collectPending = () => {
        const list: Pending[] = []
        // As marcas vão no fim: marcar no meio invalidaria o estilo antes de cada medida
        const ready: Element[] = []
        collectGroups(desktop).forEach((all, key) => {
          ready.push(...all.filter(hasPlayed))
          const items = all.filter((el) => !hasPlayed(el))
          if (!items.length) return
          // Grupo sem altura (filhos todos absolutos) acompanha a posição do primeiro elemento
          const trigger = layoutBox(key).height ? key : items[0]
          const { start, end } = scrollRange(trigger)
          if (window.scrollY >= end) {
            markPlayed(items)
            ready.push(...items)
            return
          }
          list.push({
            items,
            trigger,
            distance: Math.max(0, start - window.scrollY),
            // Já entrando na tela ao montar (recarregou no meio da página): presa à rolagem, ficaria parada
            // no meio até a próxima rolagem
            play: key.getAttribute('data-reveal-mode') === 'play' || window.scrollY >= start,
          })
        })
        markBuilt(ready)
        return list.sort((a, b) => a.distance - b.distance)
      }

      const buildGroup = ({ items, trigger, play }: Pending) => {
        const group: Group = { items, splits: [], extras: [], done: false }
        groups.push(group)
        const tl = buildTimeline(items, { desktop, splits: group.splits, extras: group.extras })

        const finish = () => {
          if (group.done) return
          group.done = true
          markPlayed(items)
          scroll?.kill()
          // O alvo de um .call() é a própria função
          const targets = tl
            .getChildren(true, true, false)
            .flatMap((tween) => (tween as gsap.core.Tween).targets<unknown>())
            .filter((target): target is Element => target instanceof Element)
          gsap.set(targets, { clearProps: CLEAR })
          group.splits.forEach((split) => split.revert())
        }

        // data-reveal-mode="play": toca inteira no seu tempo assim que o bloco começa a entrar
        let scroll: ScrollTrigger | undefined
        if (play) {
          tl.eventCallback('onComplete', finish)
          if (window.scrollY >= scrollRange(trigger).start) {
            tl.play()
            return
          }
          scroll = ScrollTrigger.create({
            trigger,
            start: () => scrollRange(trigger).start,
            onEnter: () => tl.play(),
          })
          return
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

        scroll = ScrollTrigger.create({
          trigger,
          start: () => scrollRange(trigger).start,
          end: () => scrollRange(trigger).end,
          onUpdate: advance,
          onRefresh: advance,
        })
      }

      // Uma fatia por intervalo livre, e pelo menos um grupo por fatia
      const step = (deadline?: IdleDeadline) => {
        if (cancelled) return
        const until = performance.now() + Math.min(SLICE_MS, deadline?.timeRemaining() ?? SLICE_MS)
        pending ??= collectPending()
        const queue = pending
        const built: Element[] = []
        do {
          const next = queue.shift()
          if (!next) break
          context.add(() => buildGroup(next))
          built.push(...next.items)
        } while (queue.length && performance.now() < until)
        // Já estão no estado inicial do GSAP: o CSS pode soltar. Em lote, para não invalidar o estilo
        // entre um grupo e outro da fatia
        markBuilt(built)

        if (queue.length) handle = whenIdle(step, IDLE_TIMEOUT_MS)
        else html.setAttribute(READY_ATTR, '')
      }

      handle = whenIdle(step, IDLE_TIMEOUT_MS)

      // Ao reverter (cruzar o lg), o que não terminou volta a se esconder até ser montado de novo
      return () => {
        cancelled = true
        cancelIdle(handle)
        html.removeAttribute(READY_ATTR)
        groups.forEach((group) => {
          group.splits.forEach((split) => split.revert())
          group.extras.forEach((animation) => animation.revert())
          if (!group.done) group.items.forEach((el) => el.removeAttribute(BUILT_ATTR))
        })
      }
    })
  })
}

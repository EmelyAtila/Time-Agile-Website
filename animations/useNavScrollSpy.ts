'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

/** A seção cujo topo já cruzou esta linha da tela é a ativa (fração da altura da janela) */
const ACTIVE_LINE = 0.4

/** Trecho antes da linha em que a barra desliza de um item para o próximo */
const SLIDE_ZONE = 0.35

/** Quanto a barra estica no meio do caminho entre dois itens (0 = não estica) */
const STRETCH = 0.8

/** Duração (s) do deslize quando o mouse troca de item no menu */
const POINTER_SLIDE = 0.45

/** Altura do pulo das letras de um link, em % da altura da linha */
const HOP_HEIGHT = 30

/** Atraso (s) entre uma letra e a seguinte no pulo: é o que faz a onda */
const HOP_STAGGER = 0.03

/** Rolagem (px) a partir da qual o header ganha fundo */
const SCROLLED_AFTER = 24

/**
 * Barra da navegação que acompanha a rolagem: fica sob o item da seção atual e, quando a
 * próxima seção se aproxima, desliza até o item dela no mesmo ritmo do scroll.
 * Com o mouse sobre o menu ela desliza até o item apontado e volta quando o mouse sai.
 * Cada link pula, letra por letra, quando a barra entra por baixo dele.
 * Uso: ligue `navRef` no <nav> (position: relative, itens com `data-nav-item` e letras
 * com `data-nav-letter`) e `indicatorRef` na barra (position: absolute, left: 0).
 */
export function useNavScrollSpy(hrefs: readonly string[]) {
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  useGSAP(
    () => {
      const nav = navRef.current
      const indicator = indicatorRef.current
      if (!nav || !indicator) return

      const items = Array.from(nav.querySelectorAll<HTMLElement>('[data-nav-item]'))
      if (!items.length) return

      const sections = hrefs.map((href) => document.querySelector<HTMLElement>(href))
      const last = items.length - 1
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const center = (item: HTMLElement) => item.offsetLeft + item.offsetWidth / 2

      // A barra tem duas origens: `scroll` (a rolagem) e `pointer` (o item sob o mouse).
      // `mix` vai de uma à outra: 0 = segue a rolagem, 1 = sob o item apontado.
      const scroll = { x: 0, scaleX: 1 }
      const pointer = { x: 0, mix: 0, pull: 0 }
      let pointed: HTMLElement | null = null
      // Item clicado: a barra espera nele a página chegar, mesmo que o mouse saia do menu
      let pinned: HTMLElement | null = null
      let slide: gsap.core.Timeline | undefined

      const hops = new Map<HTMLElement, gsap.core.Timeline>()
      // Centro da barra no quadro anterior; `undefined` quando o layout acabou de mudar
      let lastCenter: number | undefined

      /** As letras do link pulam em onda, no sentido em que a barra vem */
      const hop = (item: HTMLElement, forward: boolean) => {
        // Um pulo por vez: o excesso do deslize faz a barra cruzar a borda do item duas vezes
        if (reducedMotion || hops.get(item)?.isActive()) return
        const letters = item.querySelectorAll('[data-nav-letter]')
        if (!letters.length) return

        const stagger = { each: HOP_STAGGER, from: forward ? 'start' : 'end' } as const
        const tilt = (index: number) => (index % 2 ? 6 : -6)
        hops.set(
          item,
          gsap
            .timeline()
            .to(letters, {
              yPercent: -HOP_HEIGHT,
              rotation: tilt,
              duration: 0.16,
              ease: 'power2.out',
              stagger,
            })
            .to(
              letters,
              {
                yPercent: 0,
                rotation: 0,
                duration: 0.45,
                ease: 'bounce.out',
                stagger,
                clearProps: 'transform',
              },
              0.16
            )
        )
      }

      /** Faz pular os itens em que a barra acabou de entrar */
      const bump = (barCenter: number) => {
        const before = lastCenter
        lastCenter = barCenter
        if (before === undefined || before === barCenter) return

        items.forEach((item) => {
          const left = item.offsetLeft
          const right = left + item.offsetWidth
          // Só a entrada conta: a barra sair de baixo de um item não faz ele pular
          if (before < left && barCenter >= left) hop(item, true)
          else if (before > right && barCenter <= right) hop(item, false)
        })
      }

      const render = () => {
        const x = gsap.utils.interpolate(scroll.x, pointer.x, pointer.mix)
        const scaleX =
          gsap.utils.interpolate(scroll.scaleX, 1, pointer.mix) + STRETCH * pointer.pull
        // Antes de escrever o estilo, porque lê o layout dos itens
        bump(x + indicator.offsetWidth / 2)
        gsap.set(indicator, {
          x,
          // Os dois esticões (rolagem e mouse) podem coincidir: juntos não passam do máximo de um
          scaleX: Math.min(scaleX, 1 + STRETCH),
        })
      }

      /** Leva a barra até o item apontado; `null` devolve a barra à rolagem */
      const pointAt = (item: HTMLElement | null) => {
        if (item === pointed) return
        pointed = item

        const from = gsap.utils.interpolate(scroll.x, pointer.x, pointer.mix)
        const to = item
          ? { x: center(item) - indicator.offsetWidth / 2, mix: 1 }
          : { x: pointer.x, mix: 0 }
        // Vindo da rolagem, parte de onde a barra está, e não do último item apontado
        if (pointer.mix === 0) pointer.x = to.x

        if (reducedMotion) {
          Object.assign(pointer, to)
          render()
          return
        }

        // Estica em proporção ao trajeto, para não pulsar parada ao apontar o item em que já está
        const travel = Math.abs(gsap.utils.interpolate(scroll.x, to.x, to.mix) - from)
        const reach = gsap.utils.clamp(0, 1, travel / (indicator.offsetWidth * 2))
        const half = POINTER_SLIDE / 2

        slide?.kill()
        slide = gsap
          .timeline({ onUpdate: render })
          .to(pointer, { ...to, duration: POINTER_SLIDE, ease: 'back.out(1.2)' }, 0)
          .to(pointer, { pull: reach, duration: half, ease: 'sine.out' }, 0)
          .to(pointer, { pull: 0, duration: half, ease: 'sine.in' }, half)
      }

      const onPointerEnter = (event: PointerEvent) => {
        // Toque não tem hover: a barra iria e voltaria a cada toque
        if (event.pointerType === 'touch') return
        pinned = null
        pointAt(event.currentTarget as HTMLElement)
      }
      const onPointerLeave = () => {
        if (!pinned) pointAt(null)
      }
      // No topo o header sobe ao rolar e tira o item clicado de baixo do mouse: sem o `pinned`
      // a barra voltaria à seção atual para depois refazer o caminho até o item
      const onClick = (event: MouseEvent) => {
        if (event.currentTarget === pointed) pinned = pointed
      }
      const onWheel = () => {
        pinned = null
        pointAt(null)
      }

      const update = () => {
        const viewport = window.innerHeight
        const line = viewport * ACTIVE_LINE
        const zone = viewport * SLIDE_ZONE

        // Índice fracionário: 1.5 = a meio caminho entre o 2º e o 3º item
        let position = 0
        sections.forEach((section, index) => {
          if (!section || index === 0) return
          const top = section.getBoundingClientRect().top
          position += gsap.utils.clamp(0, 1, (line + zone - top) / zone)
        })

        // A última seção pode ser curta demais para o topo dela chegar até a linha
        const pageEnd = document.documentElement.scrollHeight - viewport
        if (pageEnd > 0 && window.scrollY >= pageEnd - 2) position = last
        // Com "reduzir movimento" a barra troca de item de uma vez, sem deslizar
        if (reducedMotion) position = Math.round(position)

        // A página chegou à seção do item clicado: a barra volta a ser da rolagem
        if (pinned && Math.round(position) === items.indexOf(pinned)) {
          pinned = null
          if (!nav.matches(':hover')) pointAt(null)
        }

        const from = Math.min(Math.floor(position), last)
        const to = Math.min(from + 1, last)
        const progress = position - from

        scroll.x =
          gsap.utils.interpolate(center(items[from]), center(items[to]), progress) -
          indicator.offsetWidth / 2
        scroll.scaleX = 1 + STRETCH * Math.sin(Math.PI * progress)
        render()
        setActiveIndex(Math.min(Math.round(position), last))
        setIsScrolled(window.scrollY > SCROLLED_AFTER)
      }

      // Só aparece depois de posicionada: sem JS ela não teria como achar o item
      gsap.set(indicator, { visibility: 'visible' })
      update()

      // O layout mudou: a barra muda de lugar sem ter passado por baixo de nenhum item
      const relayout = () => {
        lastCenter = undefined
        update()
      }

      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', relayout)
      // Largura dos itens muda quando a fonte carrega ou o menu aparece/some
      const observer = new ResizeObserver(relayout)
      observer.observe(nav)

      items.forEach((item) => {
        item.addEventListener('pointerenter', onPointerEnter)
        item.addEventListener('click', onClick)
      })
      // Sai do menu inteiro, e não de cada item: no vão entre dois itens a barra espera
      nav.addEventListener('pointerleave', onPointerLeave)
      // Rolar com o mouse parado sobre o menu devolve a barra à seção em que a página está
      window.addEventListener('wheel', onWheel, { passive: true })

      return () => {
        window.removeEventListener('scroll', update)
        window.removeEventListener('resize', relayout)
        observer.disconnect()
        hops.forEach((timeline) => timeline.kill())
        items.forEach((item) => {
          item.removeEventListener('pointerenter', onPointerEnter)
          item.removeEventListener('click', onClick)
        })
        nav.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('wheel', onWheel)
        slide?.kill()
      }
    },
    { dependencies: [hrefs] }
  )

  return { navRef, indicatorRef, activeIndex, isScrolled }
}

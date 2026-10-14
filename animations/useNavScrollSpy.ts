'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

// Frações da altura da janela
const ACTIVE_LINE = 0.4
const SLIDE_ZONE = 0.35

const STRETCH = 0.8
const POINTER_SLIDE = 0.45
const HOP_HEIGHT = 30
const HOP_STAGGER = 0.03

// `navRef` vai no <nav> (relative) e `indicatorRef` na barra (absolute, left: 0)
export function useNavScrollSpy(hrefs: readonly string[]) {
  const navRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

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

      // `mix`: 0 = barra segue a rolagem, 1 = sob o item apontado pelo mouse
      const scroll = { x: 0, scaleX: 1 }
      const pointer = { x: 0, mix: 0, pull: 0 }
      let pointed: HTMLElement | null = null
      // Item clicado: a barra espera nele a página chegar, mesmo que o mouse saia do menu
      let pinned: HTMLElement | null = null
      let slide: gsap.core.Timeline | undefined

      const hops = new Map<HTMLElement, gsap.core.Timeline>()
      let lastCenter: number | undefined

      const hop = (item: HTMLElement, forward: boolean) => {
        // O excesso do deslize faz a barra cruzar a borda do item duas vezes
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

      const bump = (barCenter: number) => {
        const before = lastCenter
        lastCenter = barCenter
        if (before === undefined || before === barCenter) return

        items.forEach((item) => {
          const left = item.offsetLeft
          const right = left + item.offsetWidth
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
          scaleX: Math.min(scaleX, 1 + STRETCH),
        })
      }

      // `null` devolve a barra à rolagem
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

        // Proporcional ao trajeto, para não pulsar ao apontar o item em que já está
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
        if (event.pointerType === 'touch') return
        pinned = null
        pointAt(event.currentTarget as HTMLElement)
      }
      const onPointerLeave = () => {
        if (!pinned) pointAt(null)
      }
      // O header sobe ao rolar e tira o item de baixo do mouse: sem o `pinned` a barra voltaria
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
        if (reducedMotion) position = Math.round(position)

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
      }

      // Só aparece depois de posicionada: sem JS ela não teria como achar o item
      gsap.set(indicator, { visibility: 'visible' })
      update()

      // A barra muda de lugar sem ter passado por baixo de nenhum item: nada pula
      const relayout = () => {
        lastCenter = undefined
        update()
      }

      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', relayout)
      // Largura dos itens muda quando a fonte carrega
      const observer = new ResizeObserver(relayout)
      observer.observe(nav)

      items.forEach((item) => {
        item.addEventListener('pointerenter', onPointerEnter)
        item.addEventListener('click', onClick)
      })
      // No menu inteiro: no vão entre dois itens a barra espera
      nav.addEventListener('pointerleave', onPointerLeave)
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

  return { navRef, indicatorRef, activeIndex }
}

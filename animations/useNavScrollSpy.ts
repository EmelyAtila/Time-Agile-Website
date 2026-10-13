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

/** Rolagem (px) a partir da qual o header ganha fundo */
const SCROLLED_AFTER = 24

/**
 * Barra da navegação que acompanha a rolagem: fica sob o item da seção atual e, quando a
 * próxima seção se aproxima, desliza até o item dela no mesmo ritmo do scroll.
 * Uso: ligue `navRef` no <nav> (position: relative, itens com `data-nav-item`) e
 * `indicatorRef` na barra (position: absolute, left: 0).
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

        const from = Math.min(Math.floor(position), last)
        const to = Math.min(from + 1, last)
        const progress = position - from

        gsap.set(indicator, {
          x:
            gsap.utils.interpolate(center(items[from]), center(items[to]), progress) -
            indicator.offsetWidth / 2,
          scaleX: 1 + STRETCH * Math.sin(Math.PI * progress),
        })
        setActiveIndex(Math.min(Math.round(position), last))
        setIsScrolled(window.scrollY > SCROLLED_AFTER)
      }

      // Só aparece depois de posicionada: sem JS ela não teria como achar o item
      gsap.set(indicator, { visibility: 'visible' })
      update()

      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      // Largura dos itens muda quando a fonte carrega ou o menu aparece/some
      const observer = new ResizeObserver(update)
      observer.observe(nav)

      return () => {
        window.removeEventListener('scroll', update)
        window.removeEventListener('resize', update)
        observer.disconnect()
      }
    },
    { dependencies: [hrefs] }
  )

  return { navRef, indicatorRef, activeIndex, isScrolled }
}

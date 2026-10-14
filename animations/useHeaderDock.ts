'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from './gsap.config'

const SOLID_AFTER = 96

// Preso ao scroll, sem animação por tempo, para a volta ao topo não dar tranco
export function useHeaderDock() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const header = ref.current
    if (!header) return

    const apply = ({ progress }: ScrollTrigger) => {
      const solid = progress * progress * (3 - 2 * progress)
      header.style.setProperty('--header-solid', solid.toFixed(3))
    }

    apply(ScrollTrigger.create({ start: 0, end: SOLID_AFTER, onUpdate: apply, onRefresh: apply }))
  })

  return ref
}

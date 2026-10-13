'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from './gsap.config'

/** Rolagem (px) em que o fundo do header termina de aparecer */
const SOLID_AFTER = 96

/**
 * Fundo do header no ritmo do scroll, sem animação por tempo: assim a volta ao topo da página
 * não dá tranco. Escreve no header a variável CSS `--header-solid` (0 no topo, 1 depois de
 * SOLID_AFTER), usada como opacidade do fundo. A posição do header é do CSS (sticky).
 * Uso: const ref = useHeaderDock(); <header ref={ref}>…</header>
 */
export function useHeaderDock() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    const header = ref.current
    if (!header) return

    const apply = ({ progress }: ScrollTrigger) => {
      // Suaviza as duas pontas: o fundo não some nem aparece de repente
      const solid = progress * progress * (3 - 2 * progress)
      header.style.setProperty('--header-solid', solid.toFixed(3))
    }

    apply(ScrollTrigger.create({ start: 0, end: SOLID_AFTER, onUpdate: apply, onRefresh: apply }))
  })

  return ref
}

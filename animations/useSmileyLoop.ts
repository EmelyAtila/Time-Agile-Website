'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/** Pausa (s) entre um balanço do smiley e o seguinte */
const SMILEY_EVERY = 3.2

/**
 * Loop dos smileys: de tempos em tempos a carinha balança de um lado para o outro e volta
 * com elástico, como o "!" do título (animations/heroLoops.ts). Só roda com o smiley na
 * tela e sem "reduzir movimento".
 * O ref vai num <g> de dentro do SVG, não no <svg>: a posição dele é feita com transform
 * do Tailwind, que o GSAP sobrescreveria.
 * Uso: const ref = useSmileyLoop(); <svg><g ref={ref}>…</g></svg>
 */
export function useSmileyLoop() {
  const ref = useRef<SVGGElement>(null)

  useGSAP(() => {
    const face = ref.current
    if (!face) return

    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.set(face, { transformOrigin: '50% 50%' })
      gsap
        .timeline({
          repeat: -1,
          repeatDelay: SMILEY_EVERY,
          delay: 1,
          scrollTrigger: {
            trigger: face.ownerSVGElement,
            start: 'top bottom',
            end: 'bottom top',
            toggleActions: 'play pause resume pause',
          },
        })
        .to(face, { rotation: 14, duration: 0.2, ease: 'power2.out' })
        .to(face, { rotation: -10, duration: 0.28, ease: 'sine.inOut' })
        .to(face, { rotation: 6, duration: 0.24, ease: 'sine.inOut' })
        .to(face, { rotation: 0, duration: 0.7, ease: 'elastic.out(1.4, 0.35)' })
    })
  })

  return ref
}

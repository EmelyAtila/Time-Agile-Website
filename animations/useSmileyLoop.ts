'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'
import { FACE_MOTIONS, replay } from './faceMotions'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

const SMILEY_EVERY = 3.2

// O ref vai num <g>, não no <svg>: o GSAP sobrescreveria o transform do Tailwind.
// Passar o mouse na elipse [data-face-hit] adianta o balanço
export function useSmileyLoop() {
  const ref = useRef<SVGGElement>(null)

  useGSAP(() => {
    const face = ref.current
    if (!face) return

    gsap.matchMedia().add(MOTION_OK, () => {
      const loop = gsap
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
        .add(FACE_MOTIONS.wobble(face))

      const hit = face.ownerSVGElement?.querySelector('[data-face-hit]')
      const onPointerEnter = () => replay(loop)
      hit?.addEventListener('pointerenter', onPointerEnter)

      return () => hit?.removeEventListener('pointerenter', onPointerEnter)
    })
  })

  return ref
}

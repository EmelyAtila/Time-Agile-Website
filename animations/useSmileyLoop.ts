'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

const SMILEY_EVERY = 3.2

// O ref vai num <g>, não no <svg>: o GSAP sobrescreveria o transform do Tailwind
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

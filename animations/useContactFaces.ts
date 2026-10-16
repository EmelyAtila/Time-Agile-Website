'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

// Os rostos só aparecem a partir do lg (ContactSmileys)
const MOTION_OK = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

const FACES_EVERY = 3

// O Beijinho manda um beijo e o Sorrizinho ri logo depois, como resposta. As partes vêm dos data-kiss e
// data-laugh de components/decor/Beijinho.tsx e Sorrizinho.tsx
export function useContactFaces() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const kiss = (part: string) => root.querySelectorAll<SVGElement>(`[data-kiss="${part}"]`)
      const laugh = (part: string) => root.querySelectorAll<SVGElement>(`[data-laugh="${part}"]`)

      gsap.matchMedia().add(MOTION_OK, () => {
        const kissFace = kiss('face')
        const kissMouth = kiss('mouth')
        const kissWink = kiss('wink')
        const kissSparks = kiss('spark')
        const laughFace = laugh('face')
        const laughEyes = laugh('eye')
        const laughMouth = laugh('mouth')
        const laughSparks = laugh('spark')

        gsap.set([kissFace, kissMouth, kissWink, kissSparks, laughEyes, laughSparks], {
          transformOrigin: '50% 50%',
        })
        // A boca abre para baixo, com as pontas presas no traço de cima; o rosto balança apoiado na base
        gsap.set(laughMouth, { transformOrigin: '50% 0%' })
        gsap.set(laughFace, { transformOrigin: '50% 100%' })

        gsap
          .timeline({
            repeat: -1,
            repeatDelay: FACES_EVERY,
            delay: 0.8,
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              toggleActions: 'play pause resume pause',
            },
          })
          // Beijinho franze a boca, aperta a piscadinha e inclina...
          .to(kissMouth, { scale: 0.78, duration: 0.3, ease: 'power2.out' })
          .to(kissWink, { scale: 0.85, duration: 0.3, ease: 'power2.out' }, '<')
          .to(kissFace, { rotation: -4, duration: 0.3, ease: 'power2.out' }, '<')
          .to(kissSparks, { scale: 0, opacity: 0, duration: 0.2, ease: 'power1.in' }, '<')
          // ...e solta o beijo: a boca estala e os risquinhos saem dela
          .addLabel('mwah', '+=0.12')
          .to(kissMouth, { scale: 1.16, duration: 0.14, ease: 'back.out(3)' }, 'mwah')
          .to(kissMouth, { scale: 1, duration: 0.7, ease: 'elastic.out(1.1, 0.4)' })
          .to(kissWink, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 'mwah')
          .to(kissFace, { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }, 'mwah')
          .to(
            kissSparks,
            {
              keyframes: { scale: [0.3, 1.4, 1], opacity: [0, 1, 1] },
              duration: 0.45,
              stagger: 0.06,
              ease: 'power2.out',
            },
            'mwah'
          )
          // Sorrizinho aperta os olhos e dá três risadas, cada uma mais fraca
          .addLabel('laugh', 'mwah+=0.5')
          .to(laughEyes, { scaleY: 0.7, y: -3, duration: 0.18, ease: 'power2.out' }, 'laugh')
          .to(
            laughFace,
            {
              keyframes: {
                y: [0, -9, 0, -7, 0, -4, 0],
                rotation: [0, -3, 2, -2, 1, -1, 0],
                easeEach: 'sine.inOut',
              },
              duration: 1,
              ease: 'none',
            },
            'laugh'
          )
          .to(
            laughMouth,
            {
              keyframes: { scaleY: [1, 1.22, 1.04, 1.18, 1.04, 1.12, 1], easeEach: 'sine.inOut' },
              duration: 1,
              ease: 'none',
            },
            'laugh'
          )
          .to(
            laughSparks,
            {
              keyframes: { scale: [1, 1.35, 1, 1.35, 1, 1.2, 1], easeEach: 'sine.inOut' },
              duration: 1,
              stagger: 0.04,
              ease: 'none',
            },
            'laugh'
          )
          .to(laughEyes, { scaleY: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }, 'laugh+=0.95')
      })
    },
    { scope: ref }
  )

  return ref
}

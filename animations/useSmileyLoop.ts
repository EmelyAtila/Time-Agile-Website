'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { cancelIdle, whenIdle } from '@/lib/idle'
import { isRendered } from '@/lib/rendered'
import { gsap } from './gsap.config'
import { FACE_MOTIONS, replay } from './faceMotions'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'
// Há smileys só a partir do lg (hidden lg:block): cruzar md ou lg confere de novo se ele aparece
const MD = '(min-width: 768px)'
const LG = '(min-width: 1024px)'

const SMILEY_EVERY = 3.2
const IDLE_TIMEOUT_MS = 1000

// O ref vai num <g>, não no <svg>: o GSAP sobrescreveria o transform do Tailwind.
// Passar o mouse na elipse [data-face-hit] adianta o balanço
export function useSmileyLoop() {
  const ref = useRef<SVGGElement>(null)

  useGSAP((_, contextSafe) => {
    const face = ref.current
    const svg = face?.ownerSVGElement
    if (!face || !svg || !contextSafe) return

    // Fora da tarefa da hidratação: os smileys ficam abaixo da dobra e o loop espera 1s
    const setup = contextSafe(() => {
      gsap.matchMedia().add({ motion: MOTION_OK, md: MD, lg: LG }, (context) => {
        if (!context.conditions?.motion || !isRendered(svg)) return

        const loop = gsap
          .timeline({
            repeat: -1,
            repeatDelay: SMILEY_EVERY,
            delay: 1,
            scrollTrigger: {
              trigger: svg,
              start: 'top bottom',
              end: 'bottom top',
              toggleActions: 'play pause resume pause',
            },
          })
          .add(FACE_MOTIONS.wobble(face))

        const hit = svg.querySelector('[data-face-hit]')
        const onPointerEnter = () => replay(loop)
        hit?.addEventListener('pointerenter', onPointerEnter)

        return () => hit?.removeEventListener('pointerenter', onPointerEnter)
      })
    })

    const handle = whenIdle(setup, IDLE_TIMEOUT_MS)
    return () => cancelIdle(handle)
  })

  return ref
}

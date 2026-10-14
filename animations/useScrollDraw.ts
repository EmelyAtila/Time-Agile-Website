'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from './gsap.config'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

const DRAW_FROM = 'top bottom'
const DRAWN_AT = 'center 55%'
const ERASE_FROM = 'center 45%'
const ERASED_AT = 'bottom top'

// Vão e deslocamento um pouco maiores que 1 para a ponta redonda não aparecer como um pontinho
const DASH = '1 1.02'
const OUT = 1.01

// Desenha do começo do path para o fim: inverta o `d` se o traço vier ao contrário
export function useScrollDraw() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const svg = ref.current
    if (!svg) return
    const paths = Array.from(svg.querySelectorAll('path'))

    gsap.matchMedia().add(MOTION_OK, () => {
      let drawn = 0
      let erased = 0

      // Direto no style: o GSAP arredondaria o deslocamento para px inteiros
      const render = () => {
        const offset = `${OUT * (1 - drawn) - OUT * erased}`
        paths.forEach((path) => {
          path.style.strokeDashoffset = offset
        })
      }

      const phase = (start: string, end: string, set: (progress: number) => void) => {
        const update = ({ progress }: ScrollTrigger) => {
          set(progress)
          render()
        }
        ScrollTrigger.create({ trigger: svg, start, end, onUpdate: update, onRefresh: update })
      }

      gsap.set(paths, { strokeDasharray: DASH })
      phase(DRAW_FROM, DRAWN_AT, (progress) => (drawn = progress))
      phase(ERASE_FROM, ERASED_AT, (progress) => (erased = progress))
      render()

      return () => paths.forEach((path) => path.style.removeProperty('stroke-dashoffset'))
    })
  })

  return ref
}

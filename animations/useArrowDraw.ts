'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'
import { replay } from './faceMotions'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// Vão e deslocamento um pouco maiores que 1 para a ponta redonda não aparecer como um pontinho
const DASH = '1 1.02'
const HIDDEN = 1.01

// Pontos do viewBox de ProjectsArrow: a ponta da seta e o alto do arco
const TIP = '167.58 144.28'
const TOP = '60 20'

// Entra bem mais rápida e elástica que as fitas: o arco risca de uma vez, as abas abrem com um estalo e
// a seta quica na ponta. Some quando a rolagem volta para cima dela, para se desenhar de novo.
// No hover ([data-arrow-hit]) ela balança pendurada pelo alto do arco
export function useArrowDraw() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const svg = ref.current
    const arc = svg?.querySelector('[data-arrow="arc"]')
    const tabs = svg?.querySelectorAll('[data-arrow="tab"]')
    const head = svg?.querySelector('[data-arrow="head"]')
    const body = svg?.querySelector('[data-arrow="body"]')
    const swinger = svg?.querySelector('[data-arrow="swing"]')
    const hit = svg?.querySelector('[data-arrow-hit]')
    if (!svg || !arc || !tabs?.length || !head || !body || !swinger || !hit) return

    gsap.matchMedia().add(MOTION_OK, () => {
      // Com pathLength=1 o arredondamento de px do GSAP deixaria um pontinho e faria a seta piscar
      gsap.set([arc, tabs], { strokeDasharray: DASH, strokeDashoffset: HIDDEN, autoRound: false })
      gsap.set([head, body], { svgOrigin: TIP })
      gsap.set(swinger, { svgOrigin: TOP })

      gsap
        .timeline({
          scrollTrigger: { trigger: svg, start: 'top 85%', toggleActions: 'play none none reset' },
        })
        .to(arc, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.in', autoRound: false })
        .addLabel('snap')
        .to(
          tabs,
          { strokeDashoffset: 0, duration: 0.12, ease: 'power2.out', autoRound: false },
          'snap'
        )
        .fromTo(head, { scale: 0.4 }, { scale: 1, duration: 0.45, ease: 'back.out(4)' }, 'snap')
        .to(
          body,
          {
            keyframes: { rotation: [0, -6, 4, -2, 0], easeEach: 'sine.inOut' },
            duration: 0.6,
            ease: 'none',
          },
          'snap'
        )

      const swing = gsap.timeline({ paused: true }).to(swinger, {
        keyframes: { rotation: [0, 10, -8, 5, -3, 1, 0], easeEach: 'sine.inOut' },
        duration: 1.1,
        ease: 'none',
      })

      const onPointerEnter = () => replay(swing)
      hit.addEventListener('pointerenter', onPointerEnter)

      return () => hit.removeEventListener('pointerenter', onPointerEnter)
    })
  })

  return ref
}

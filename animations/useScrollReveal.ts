'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

interface UseScrollRevealOptions {
  y?: number
  opacity?: number
  duration?: number
  delay?: number
  stagger?: number
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const ref = useRef<T>(null)
  const { y = 40, opacity = 0, duration = 0.8, delay = 0, stagger = 0.15 } = options

  useGSAP(
    () => {
      if (!ref.current) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      gsap.fromTo(
        '[data-reveal]',
        { y, opacity },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    },
    { scope: ref, dependencies: [y, opacity, duration, delay, stagger] }
  )

  return ref
}

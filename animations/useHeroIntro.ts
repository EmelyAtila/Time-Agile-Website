'use client'

import type { RefObject } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'
import { INTRO_BOOT_ATTR, INTRO_DONE_ATTR, INTRO_PLAY_ATTR } from './heroBoot'
import { startHeroLoops } from './heroLoops'

type Variant = 'desktop' | 'mobile'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

// Mesmo corte (lg) que troca a arte em components/sections/hero/HeroRibbons.tsx
const VARIANT_QUERY: Record<Variant, string> = {
  desktop: `(min-width: 1024px) and ${MOTION_OK}`,
  mobile: `(max-width: 1023.98px) and ${MOTION_OK}`,
}

// A entrada roda antes do React (heroBoot.ts + styles/hero-intro.css); aqui só os loops, quando ela termina.
// Mapa dos tempos: docs/HERO-ANIMATIONS.md
export function useHeroIntro(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = ref.current
      if (!section) return

      const html = document.documentElement
      // Navegação pelo cliente não roda o script inline: o Hero aparece pronto
      if (!html.hasAttribute(INTRO_BOOT_ATTR)) {
        html.setAttribute(INTRO_BOOT_ATTR, '')
        html.setAttribute(INTRO_PLAY_ATTR, '')
        html.setAttribute(INTRO_DONE_ATTR, '')
      }

      const mm = gsap.matchMedia()

      // No contexto do matchMedia: trocar de variante desfaz os loops da anterior
      const run = (variant: Variant) => (context: gsap.Context) => {
        const startLoops = () => {
          context.add(() => startHeroLoops(section, variant))
        }
        if (html.hasAttribute(INTRO_DONE_ATTR)) return startLoops()

        const observer = new MutationObserver(() => {
          if (!html.hasAttribute(INTRO_DONE_ATTR)) return
          observer.disconnect()
          startLoops()
        })
        observer.observe(html, { attributes: true, attributeFilter: [INTRO_DONE_ATTR] })
        return () => observer.disconnect()
      }

      mm.add(VARIANT_QUERY.desktop, run('desktop'))
      mm.add(VARIANT_QUERY.mobile, run('mobile'))
    },
    { scope: ref }
  )
}

'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/animations/gsap.config'
import { PRELOADER_ATTR, PRELOADER_DONE_ATTR } from '@/animations/preloaderBoot'

export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector<HTMLElement>(href)
      if (!target) return
      e.preventDefault()
      // Sem `offset`: o Lenis já desconta o scroll-margin-top da seção (styles/base.css)
      lenis.scrollTo(target)
      // O preventDefault também tira o foco do caminho: sem isso, o próximo Tab volta para o link clicado
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }

    document.addEventListener('click', handleAnchorClick)

    // Parado enquanto o pre-loader cobre a página (animations/preloaderBoot.ts)
    const html = document.documentElement
    const preloading = () =>
      html.hasAttribute(PRELOADER_ATTR) && !html.hasAttribute(PRELOADER_DONE_ATTR)
    const preloader = new MutationObserver(() => {
      if (preloading()) return
      lenis.start()
      preloader.disconnect()
    })
    if (preloading()) {
      lenis.stop()
      preloader.observe(html, { attributeFilter: [PRELOADER_DONE_ATTR] })
    }

    return () => {
      preloader.disconnect()
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(tickerFn)
      lenis.destroy()
    }
  }, [])
}

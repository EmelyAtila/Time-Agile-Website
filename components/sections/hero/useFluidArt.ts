'use client'

import { useLayoutEffect, type RefObject } from 'react'
import { stretchHeroArt } from '@/animations/heroBoot'

// O primeiro esticão já vem do script inline do Hero; aqui ele acompanha os resizes
export function useFluidArt(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = ref.current
    if (!section) return

    const apply = () => stretchHeroArt(section)
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(section)
    return () => observer.disconnect()
  }, [ref])
}

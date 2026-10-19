'use client'

import { useRef, type ComponentProps } from 'react'
import { useHeroIntro } from '@/animations/useHeroIntro'
import { useFluidArt } from './useFluidArt'

// Só este wrapper é client: os filhos continuam renderizados no servidor
export function HeroIntro(props: ComponentProps<'section'>) {
  const ref = useRef<HTMLElement>(null)

  // A entrada em si roda antes do React (animations/heroBoot.ts); aqui ficam o resize e os loops
  useFluidArt(ref)
  useHeroIntro(ref)

  return <section {...props} ref={ref} />
}

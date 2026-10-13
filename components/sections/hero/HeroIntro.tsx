'use client'

import { useRef, type ComponentProps } from 'react'
import { useHeroIntro } from '@/animations/useHeroIntro'
import { useFluidArt } from './useFluidArt'

/**
 * <section> do Hero que dispara a animação de entrada.
 * Só este wrapper é client: os filhos (fitas, logo) continuam renderizados no servidor.
 */
export function HeroIntro(props: ComponentProps<'section'>) {
  const ref = useRef<HTMLElement>(null)

  // Nesta ordem: a arte precisa estar na proporção final antes de a entrada medir o título
  useFluidArt(ref)
  useHeroIntro(ref)

  return <section {...props} ref={ref} />
}

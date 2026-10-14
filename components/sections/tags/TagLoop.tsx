'use client'

import type { ComponentProps } from 'react'
import { useTagMarquee } from '@/animations/useTagMarquee'

/**
 * Janela da faixa de tags que liga o loop (animations/useTagMarquee.ts).
 * Só este wrapper é client: as tags continuam renderizadas no servidor.
 */
export function TagLoop(props: ComponentProps<'div'>) {
  const ref = useTagMarquee()

  return <div {...props} ref={ref} />
}

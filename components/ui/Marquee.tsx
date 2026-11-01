'use client'

import type { ComponentProps } from 'react'
import { useMarquee } from '@/animations/useMarquee'

// Só este wrapper é client: o conteúdo da faixa continua renderizado no servidor
export function Marquee(props: ComponentProps<'div'>) {
  const ref = useMarquee()

  return <div {...props} ref={ref} />
}

'use client'

import type { ComponentProps } from 'react'
import { useServiceCardsHover } from '@/animations/useServiceCardsHover'

// Só este wrapper é client: os cards continuam renderizados no servidor
export function ServiceFan(props: ComponentProps<'ul'>) {
  const ref = useServiceCardsHover()

  return <ul {...props} ref={ref} />
}

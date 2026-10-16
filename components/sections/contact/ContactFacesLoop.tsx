'use client'

import type { ComponentProps } from 'react'
import { useContactFaces } from '@/animations/useContactFaces'

// Só este wrapper é client: os rostos continuam renderizados no servidor
export function ContactFacesLoop(props: ComponentProps<'div'>) {
  const ref = useContactFaces()

  return <div {...props} ref={ref} />
}

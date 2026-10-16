'use client'

import { useScrollReveals } from '@/animations/useScrollReveals'

// Só liga as entradas no scroll: as seções continuam renderizadas no servidor
export function ScrollReveals() {
  useScrollReveals()
  return null
}

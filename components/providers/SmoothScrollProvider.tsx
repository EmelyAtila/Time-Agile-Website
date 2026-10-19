'use client'

import { useLateScriptFont } from '@/hooks/useLateScriptFont'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useSmoothScroll()
  // Aqui porque este provider é o único client do layout e a troca de fonte pede um refresh do ScrollTrigger
  useLateScriptFont()
  return <>{children}</>
}

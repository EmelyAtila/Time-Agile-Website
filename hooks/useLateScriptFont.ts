'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/animations/gsap.config'
import { cancelIdle, whenIdle } from '@/lib/idle'

// Liga a Handelson no CSS (styles/base.css)
const READY_ATTR = 'data-script-font'

// A Handelson só aparece abaixo da dobra: entra depois do load, para não disputar a rede com o JS e as fontes
// do Hero. Até lá vale o fallback que o next/font ajusta às medidas dela
export function useLateScriptFont() {
  useEffect(() => {
    const html = document.documentElement
    let idle = 0

    const swap = () => {
      // Lida antes de escrever o atributo: depois, a leitura forçaria um recálculo de estilo
      const family = getComputedStyle(html).getPropertyValue('--font-handelson')
      html.setAttribute(READY_ATTR, '')
      // A troca pode mudar a altura dos blocos: as entradas e as fitas recalculam onde começam
      document.fonts.load(`1em ${family}`).then(
        () => ScrollTrigger.refresh(),
        () => undefined
      )
    }
    const afterLoad = () => {
      idle = whenIdle(swap, 1000)
    }

    if (document.readyState === 'complete') afterLoad()
    else window.addEventListener('load', afterLoad, { once: true })

    return () => {
      window.removeEventListener('load', afterLoad)
      cancelIdle(idle)
    }
  }, [])
}

'use client'

import { useLayoutEffect, type RefObject } from 'react'

const NUMBER = /-?\d*\.?\d+(?:e-?\d+)?/g
// Só comandos M e C absolutos: aí os números alternam x, y e dá para esticar só o x
const ONLY_ABSOLUTE_M_C = /^[MC\d\s.,e+-]+$/

const round = (value: number) => Math.round(value * 100) / 100

function stretchX(d: string, k: number) {
  let index = 0
  return d.replace(NUMBER, (n) => (index++ % 2 === 0 ? String(round(Number(n) * k)) : n))
}

// Estica só o x das curvas em vez de ampliar e cortar o SVG, que comia os laços em telas largas
export function useFluidArt(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = ref.current
    const svg = section?.querySelector<SVGSVGElement>('svg[data-stretch]')
    if (!section || !svg) return

    const [min, max] = (svg.dataset.stretch ?? '1,1').split(',').map(Number)
    // Os valores do mockup ficam guardados em data-* para sempre partir do original
    svg.dataset.viewBox ??= svg.getAttribute('viewBox') ?? ''
    const [, , baseWidth, baseHeight] = svg.dataset.viewBox.split(/\s+/).map(Number)
    if (!baseWidth || !baseHeight) return

    const paths = Array.from(svg.querySelectorAll('path')).filter((path) => {
      path.dataset.d ??= path.getAttribute('d') ?? ''
      path.dataset.strokeWidth ??= path.getAttribute('stroke-width') ?? ''
      return ONLY_ABSOLUTE_M_C.test(path.dataset.d)
    })
    const texts = Array.from(svg.querySelectorAll('text'))
    texts.forEach((text) => (text.dataset.fontSize ??= text.getAttribute('font-size') ?? ''))

    let current = 0

    const apply = () => {
      const { width, height } = section.getBoundingClientRect()
      if (!width || !height) return

      const k = round(Math.min(max, Math.max(min, width / height / (baseWidth / baseHeight))))
      if (k === current) return
      current = k

      const thickness = Math.sqrt(k)
      svg.setAttribute('viewBox', `0 0 ${round(baseWidth * k)} ${baseHeight}`)
      paths.forEach((path) => {
        path.setAttribute('d', stretchX(path.dataset.d!, k))
        if (path.dataset.strokeWidth) {
          path.setAttribute(
            'stroke-width',
            String(round(Number(path.dataset.strokeWidth) * thickness))
          )
        }
      })
      texts.forEach((text) => {
        if (text.dataset.fontSize) {
          text.setAttribute('font-size', String(round(Number(text.dataset.fontSize) * thickness)))
        }
      })
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(section)
    return () => observer.disconnect()
  }, [ref])
}

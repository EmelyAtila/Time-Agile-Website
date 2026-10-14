'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from './gsap.config'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

const DRAWN_AT = 'center 30%'
const ERASE_FROM = 'center 20%'
const ERASED_AT = 'bottom top'

// Vão e deslocamento um pouco maiores que 1 para a ponta redonda não aparecer como um pontinho
const DASH = '1 1.02'
const OUT = 1.01

// Segundos que o desenho leva para alcançar a rolagem
const LAG = 1.2

const STEPS = 400

type Visible = { from: number; to: number; entry: number }

const WHOLE: Visible = { from: 0, to: 1, entry: 0 }

// Trecho do path dentro da largura da tela (em fração do comprimento) e a distância do topo do svg até o
// começo dele: a rolagem anima só esse trecho, e as pontas que passam das bordas ficam fora de vista
function measureVisible(path: SVGPathElement, top: number): Visible {
  const ctm = path.getScreenCTM()
  const length = path.getTotalLength()
  if (!ctm || !length) return WHOLE
  const width = document.documentElement.clientWidth
  let first = -1
  let last = -1
  let entry = 0
  for (let step = 0; step <= STEPS; step++) {
    const { x, y } = path.getPointAtLength((length * step) / STEPS).matrixTransform(ctm)
    if (x < 0 || x > width) continue
    if (first < 0) {
      first = step
      entry = y - top
    }
    last = step
  }
  if (first < 0) return WHOLE
  // Um passo de folga para a ponta redonda não aparecer na borda
  return { from: Math.max(first - 1, 0) / STEPS, to: Math.min(last + 1, STEPS) / STEPS, entry }
}

// Desenha do começo do path para o fim: inverta o `d` se o traço vier ao contrário
export function useScrollDraw() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(() => {
    const svg = ref.current
    if (!svg) return
    const paths = Array.from(svg.querySelectorAll('path'))

    gsap.matchMedia().add(MOTION_OK, () => {
      let drawn = 0
      let erased = 0
      let visible = paths.map(() => WHOLE)
      // De 0 a 1 desenha, de 1 a 2 apaga: as fases não se sobrepõem, então um número só basta
      const shown = { progress: 0 }

      // Direto no style: o GSAP arredondaria o deslocamento para px inteiros
      const render = () => {
        const { progress } = shown
        paths.forEach((path, index) => {
          const { from, to } = visible[index]
          const at = (part: number) => from + (to - from) * part
          const offset = progress > 1 ? -OUT * at(progress - 1) : OUT * (1 - at(progress))
          path.style.strokeDashoffset = `${offset}`
        })
      }

      // A fita persegue a rolagem com atraso: mesmo rolando rápido, dá para vê-la se desenhar
      const follow = gsap.quickTo(shown, 'progress', {
        duration: LAG,
        ease: 'power1.out',
        onUpdate: render,
      })

      // Recalculado a cada refresh (resize): começa a desenhar quando a fita, não o svg, entra na tela
      const drawFrom = () => {
        const { top } = svg.getBoundingClientRect()
        visible = paths.map((path) => measureVisible(path, top))
        const entry = Math.round(Math.min(...visible.map((part) => part.entry)))
        return `top${entry < 0 ? '-' : '+'}=${Math.abs(entry)} bottom`
      }

      const phase = (
        start: string | (() => string),
        end: string,
        set: (progress: number) => void
      ) => {
        const update = ({ progress }: ScrollTrigger) => {
          set(progress)
          follow(drawn + erased)
        }
        ScrollTrigger.create({ trigger: svg, start, end, onUpdate: update, onRefresh: update })
      }

      gsap.set(paths, { strokeDasharray: DASH })
      phase(drawFrom, DRAWN_AT, (progress) => (drawn = progress))
      phase(ERASE_FROM, ERASED_AT, (progress) => (erased = progress))
      render()

      return () => paths.forEach((path) => path.style.removeProperty('stroke-dashoffset'))
    })
  })

  return ref
}

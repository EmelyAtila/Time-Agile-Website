'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/** Velocidade da faixa sozinha, em px por segundo */
const MARQUEE_SPEED = 45
/** A rolagem acelera a faixa em +1x a cada SCROLL_BOOST px/s */
const SCROLL_BOOST = 600
/** Aceleração máxima vinda da rolagem: 3 = até 4x a velocidade normal */
const MAX_BOOST = 3
/** Quanto do embalo da rolagem sobra a cada quadro (a 60fps): some em ~1s */
const BOOST_DECAY = 0.94
/** Fração da diferença até a velocidade-alvo vencida a cada quadro: freia e arranca macio */
const SPEED_EASE = 0.06

/**
 * Faixa de tags em loop infinito. Anda sozinha para a esquerda; rolando a página ela
 * acelera e segue o sentido da rolagem (subindo a página, a faixa volta), e com o mouse
 * em cima freia até parar, para dar tempo de ler.
 * Marcação: o ref vai na janela da faixa (overflow-hidden), que tem dentro um
 * `[data-marquee-track]` com duas cópias iguais da lista. A faixa anda uma cópia e volta ao
 * início sem salto, então cada cópia precisa ter a mesma largura, incluindo o espaço
 * depois do último item.
 * Sem JS ou com "reduzir movimento" a faixa fica parada.
 * Uso: const ref = useTagMarquee(); <div ref={ref}><div data-marquee-track>…</div></div>
 */
export function useTagMarquee() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const viewport = ref.current
    const track = viewport?.querySelector<HTMLElement>('[data-marquee-track]')
    const copy = track?.firstElementChild
    if (!viewport || !track || !(copy instanceof HTMLElement)) return

    gsap.matchMedia().add(MOTION_OK, () => {
      const setX = gsap.quickSetter(track, 'x', 'px')
      let width = copy.getBoundingClientRect().width
      let x = 0
      /** 1: para a esquerda (página descendo); -1: para a direita (página subindo) */
      let direction = 1
      let speed = 1
      let boost = 0
      let hovered = false
      let visible = false
      let lastScroll = window.scrollY

      const tick = (_time: number, deltaTime: number) => {
        // A rolagem é lida mesmo com a faixa fora da tela, para não virar um tranco ao voltar
        const scrolled = window.scrollY - lastScroll
        lastScroll = window.scrollY
        if (!visible || !width) return

        const ratio = gsap.ticker.deltaRatio()
        if (scrolled) {
          direction = scrolled > 0 ? 1 : -1
          const velocity = Math.abs(scrolled) / (deltaTime / 1000)
          boost = Math.max(boost, Math.min(MAX_BOOST, velocity / SCROLL_BOOST))
        }
        boost *= BOOST_DECAY ** ratio

        const target = hovered ? 0 : direction * (1 + boost)
        speed += (target - speed) * Math.min(1, SPEED_EASE * ratio)
        x = gsap.utils.wrap(-width, 0, x - MARQUEE_SPEED * speed * (deltaTime / 1000))
        setX(x)
      }

      // A largura muda com a janela e quando a fonte termina de carregar
      const resize = new ResizeObserver(() => {
        width = copy.getBoundingClientRect().width
      })
      const onScreen = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
      })
      const onPointerEnter = (event: PointerEvent) => {
        if (event.pointerType !== 'touch') hovered = true
      }
      const onPointerLeave = () => {
        hovered = false
      }

      resize.observe(copy)
      onScreen.observe(viewport)
      track.addEventListener('pointerenter', onPointerEnter)
      track.addEventListener('pointerleave', onPointerLeave)
      gsap.ticker.add(tick)

      return () => {
        gsap.ticker.remove(tick)
        resize.disconnect()
        onScreen.disconnect()
        track.removeEventListener('pointerenter', onPointerEnter)
        track.removeEventListener('pointerleave', onPointerLeave)
        gsap.set(track, { clearProps: 'transform' })
      }
    })
  })

  return ref
}

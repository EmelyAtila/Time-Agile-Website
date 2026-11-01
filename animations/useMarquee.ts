'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

const MARQUEE_SPEED = 45
// +1x de velocidade a cada SCROLL_BOOST px/s de rolagem
const SCROLL_BOOST = 600
const MAX_BOOST = 3
const BOOST_DECAY = 0.94
const SPEED_EASE = 0.06

// `[data-marquee-track]` precisa de duas cópias da lista com a mesma largura, senão o loop salta
export function useMarquee() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const viewport = ref.current
    const track = viewport?.querySelector<HTMLElement>('[data-marquee-track]')
    const copy = track?.firstElementChild
    if (!viewport || !track || !(copy instanceof HTMLElement)) return

    const mm = gsap.matchMedia()

    // Sem animação a faixa pode virar rolagem na mão (Testimonials): precisa ser alcançável pelo teclado
    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (viewport.scrollWidth <= viewport.clientWidth || viewport.hasAttribute('tabindex')) return
      viewport.tabIndex = 0
      return () => viewport.removeAttribute('tabindex')
    })

    mm.add(MOTION_OK, () => {
      const setX = gsap.quickSetter(track, 'x', 'px')
      let width = copy.getBoundingClientRect().width
      let x = 0
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

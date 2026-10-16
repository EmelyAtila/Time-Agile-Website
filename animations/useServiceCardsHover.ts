'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'
import { FACE_MOTIONS, replay, type FaceMotion } from './faceMotions'

const HOVER_OK = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

export type CardHover = 'pop' | 'draw' | 'pull' | 'swing'

type CardParts = {
  card: HTMLElement
  sticker: HTMLElement
  // 1 = mouse entrou pela metade esquerda, -1 = pela direita
  side: 1 | -1
}

const ORIGINS: Record<CardHover, { card: string; sticker: string }> = {
  pop: { card: '50% 100%', sticker: '50% 50%' },
  draw: { card: '50% 100%', sticker: '0% 100%' },
  pull: { card: '50% 50%', sticker: '50% 50%' },
  swing: { card: '50% 0%', sticker: '50% 100%' },
}

// Deslocamentos em % do próprio elemento, para valer em qualquer largura de card
const ENTER: Record<CardHover, (parts: CardParts) => gsap.core.Timeline> = {
  pop: ({ card, sticker }) =>
    gsap
      .timeline()
      .to(card, { scaleX: 1.03, scaleY: 0.96, duration: 0.12, ease: 'power2.out' })
      .to(card, { scale: 1.05, yPercent: -3, rotation: 2.5, duration: 0.6, ease: 'back.out(2.2)' })
      .to(
        sticker,
        {
          keyframes: [
            { scale: 0.9, duration: 0.08, ease: 'power2.in' },
            { scale: 1.06, duration: 0.6, ease: 'elastic.out(1, 0.4)' },
          ],
        },
        '<0.1'
      ),

  draw: ({ card, sticker }) =>
    gsap
      .timeline()
      .to(card, { yPercent: 1, duration: 0.1, ease: 'power1.out' })
      .to(card, { yPercent: -6, rotation: -1.5, duration: 0.6, ease: 'back.out(1.5)' })
      .to(sticker, { rotation: -5, duration: 0.7, ease: 'back.out(2.5)' }, '<0.1'),

  pull: ({ card, sticker }) =>
    gsap
      .timeline()
      .to(card, { xPercent: -1.5, duration: 0.12, ease: 'power2.out' })
      .to(card, { xPercent: 7, rotation: 1.5, duration: 0.6, ease: 'back.out(1.7)' })
      // Só para a esquerda: o celular vem cortado na base, e para a direita o corte apareceria
      .to(
        sticker,
        {
          keyframes: [
            { xPercent: -5, duration: 0.2, ease: 'power2.out' },
            { xPercent: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' },
          ],
        },
        '<'
      ),

  swing: ({ card, sticker, side }) =>
    gsap
      .timeline()
      .to(card, { rotation: 4 * side, yPercent: -1.5, duration: 0.22, ease: 'power2.out' })
      .to(card, { rotation: 0, duration: 1.2, ease: 'elastic.out(1.2, 0.3)' })
      .to(
        sticker,
        {
          keyframes: [
            { rotation: -6 * side, duration: 0.25, ease: 'power2.out' },
            { rotation: 0, duration: 1.1, ease: 'elastic.out(1.2, 0.35)' },
          ],
        },
        0.05
      ),
}

const REST = { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 }

// O <li> só escuta o mouse e quem se mexe é o <article>: o transform do leque fica intacto
// e a área do hover não foge do ponteiro
export function useServiceCardsHover() {
  const ref = useRef<HTMLUListElement>(null)

  useGSAP(() => {
    const list = ref.current
    if (!list) return

    gsap.matchMedia().add(HOVER_OK, () => {
      const cleanups = Array.from(
        list.querySelectorAll<HTMLElement>('[data-card-hover]'),
        (item) => {
          const hover = item.dataset.cardHover as CardHover
          const card = item.querySelector<HTMLElement>('article')
          const sticker = item.querySelector<HTMLElement>('[data-card-sticker]')
          if (!card || !sticker) return () => {}

          gsap.set(card, { transformOrigin: ORIGINS[hover].card })
          gsap.set(sticker, { transformOrigin: ORIGINS[hover].sticker })

          // O rosto de fundo (CardFace) se mexe com o mouse em qualquer ponto do card
          const face = item.querySelector<SVGGElement>('[data-face]')
          const faceMotion = face && FACE_MOTIONS[face.dataset.face as FaceMotion](face).pause()

          let motion: gsap.core.Animation | undefined

          const onPointerEnter = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return
            const box = item.getBoundingClientRect()
            motion?.kill()
            motion = ENTER[hover]({
              card,
              sticker,
              side: event.clientX < box.left + box.width / 2 ? 1 : -1,
            })
            if (faceMotion) replay(faceMotion)
          }

          const onPointerLeave = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return
            motion?.kill()
            motion = gsap.to([card, sticker], { ...REST, duration: 0.5, ease: 'power3.out' })
          }

          item.addEventListener('pointerenter', onPointerEnter)
          item.addEventListener('pointerleave', onPointerLeave)

          // Os tweens do hover nascem fora do contexto do matchMedia, e o revert não os desfaz
          return () => {
            item.removeEventListener('pointerenter', onPointerEnter)
            item.removeEventListener('pointerleave', onPointerLeave)
            motion?.kill()
            gsap.set([card, sticker], { clearProps: 'transform' })
          }
        }
      )

      return () => cleanups.forEach((cleanup) => cleanup())
    })
  })

  return ref
}

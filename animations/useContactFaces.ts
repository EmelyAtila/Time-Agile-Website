'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from './gsap.config'
import { FACE_MOTIONS, replay } from './faceMotions'

// Os rostos só aparecem a partir do lg (ContactSmileys)
const MOTION_OK = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'

const FACES_EVERY = 3
// Quanto depois do estalo do beijo o Sorrizinho começa a rir
const LAUGH_AFTER_KISS = 0.5

// O Beijinho manda um beijo em loop e o Sorrizinho ri logo depois, como resposta. Passar o mouse
// num deles ([data-face-hit]) adianta o movimento daquele rosto
export function useContactFaces() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      const beijinho = root?.querySelector<SVGGElement>('[data-face="kiss"]')
      const sorrizinho = root?.querySelector<SVGGElement>('[data-face="laugh"]')
      if (!root || !beijinho || !sorrizinho) return

      gsap.matchMedia().add(MOTION_OK, () => {
        const laugh = FACE_MOTIONS.laugh(sorrizinho).pause()
        const kiss = FACE_MOTIONS.kiss(beijinho)
        const loop = gsap
          .timeline({
            repeat: -1,
            repeatDelay: FACES_EVERY,
            delay: 0.8,
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              toggleActions: 'play pause resume pause',
            },
          })
          .add(kiss)
          .call(() => replay(laugh), undefined, kiss.labels.mwah + LAUGH_AFTER_KISS)

        const hovers = [
          { face: beijinho, play: () => replay(loop) },
          { face: sorrizinho, play: () => replay(laugh) },
        ].map(({ face, play }) => {
          const hit = face.ownerSVGElement?.querySelector('[data-face-hit]')
          hit?.addEventListener('pointerenter', play)
          return () => hit?.removeEventListener('pointerenter', play)
        })

        return () => hovers.forEach((cleanup) => cleanup())
      })
    },
    { scope: ref }
  )

  return ref
}

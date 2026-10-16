import { gsap } from './gsap.config'

export type FaceMotion = 'kiss' | 'laugh' | 'wink' | 'wobble'

type FaceTimeline = (face: SVGGElement) => gsap.core.Timeline

const parts = (face: SVGGElement, name: string) =>
  face.querySelectorAll<SVGElement>(`[data-part="${name}"]`)

// Franze a boca, aperta a piscadinha e inclina; depois solta o beijo: a boca estala e os risquinhos saem dela
const kiss: FaceTimeline = (face) => {
  const mouth = parts(face, 'mouth')
  const wink = parts(face, 'wink')
  const sparks = parts(face, 'spark')
  gsap.set([face, mouth, wink, sparks], { transformOrigin: '50% 50%' })

  return gsap
    .timeline()
    .to(mouth, { scale: 0.78, duration: 0.3, ease: 'power2.out' })
    .to(wink, { scale: 0.85, duration: 0.3, ease: 'power2.out' }, '<')
    .to(face, { rotation: -4, duration: 0.3, ease: 'power2.out' }, '<')
    .to(sparks, { scale: 0, opacity: 0, duration: 0.2, ease: 'power1.in' }, '<')
    .addLabel('mwah', '+=0.12')
    .to(mouth, { scale: 1.16, duration: 0.14, ease: 'back.out(3)' }, 'mwah')
    .to(mouth, { scale: 1, duration: 0.7, ease: 'elastic.out(1.1, 0.4)' })
    .to(wink, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 'mwah')
    .to(face, { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' }, 'mwah')
    .to(
      sparks,
      {
        keyframes: { scale: [0.3, 1.4, 1], opacity: [0, 1, 1] },
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
      },
      'mwah'
    )
}

// Aperta os olhos e dá três risadas, cada uma mais fraca. A boca abre para baixo a partir do topo
// e o rosto balança apoiado na base
const laugh: FaceTimeline = (face) => {
  const eyes = parts(face, 'eye')
  const mouth = parts(face, 'mouth')
  const sparks = parts(face, 'spark')
  gsap.set([eyes, sparks], { transformOrigin: '50% 50%' })
  gsap.set(mouth, { transformOrigin: '50% 0%' })
  gsap.set(face, { transformOrigin: '50% 100%' })

  const beats = { duration: 1, ease: 'none' }

  return gsap
    .timeline()
    .to(eyes, { scaleY: 0.7, y: -3, duration: 0.18, ease: 'power2.out' }, 0)
    .to(
      face,
      {
        keyframes: {
          y: [0, -9, 0, -7, 0, -4, 0],
          rotation: [0, -3, 2, -2, 1, -1, 0],
          easeEach: 'sine.inOut',
        },
        ...beats,
      },
      0
    )
    .to(
      mouth,
      {
        keyframes: { scaleY: [1, 1.22, 1.04, 1.18, 1.04, 1.12, 1], easeEach: 'sine.inOut' },
        ...beats,
      },
      0
    )
    .to(
      sparks,
      {
        keyframes: { scale: [1, 1.35, 1, 1.35, 1, 1.2, 1], easeEach: 'sine.inOut' },
        stagger: 0.04,
        ...beats,
      },
      0
    )
    .to(eyes, { scaleY: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }, 0.95)
}

// Inclina para o lado da piscadinha, aperta o olho fechado e sobe a bochecha; o olho aberto se arregala
const wink: FaceTimeline = (face) => {
  const closed = parts(face, 'wink')
  const open = parts(face, 'eye')
  const mouth = parts(face, 'mouth')
  gsap.set([face, closed, open, mouth], { transformOrigin: '50% 50%' })

  return gsap
    .timeline()
    .to(face, { rotation: 6, duration: 0.25, ease: 'power2.out' })
    .to(closed, { scale: 0.6, duration: 0.2, ease: 'power2.in' }, '<')
    .to(open, { scale: 1.15, duration: 0.25, ease: 'power2.out' }, '<')
    .to(mouth, { scale: 1.08, y: -4, duration: 0.25, ease: 'power2.out' }, '<')
    .addLabel('release', '+=0.15')
    .to(closed, { scale: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' }, 'release')
    .to(open, { scale: 1, duration: 0.4, ease: 'power2.out' }, 'release')
    .to(mouth, { scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 'release')
    .to(face, { rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' }, 'release')
}

// Balança de um lado para o outro e assenta com um quique
const wobble: FaceTimeline = (face) => {
  gsap.set(face, { transformOrigin: '50% 50%' })

  return gsap
    .timeline()
    .to(face, { rotation: 14, duration: 0.2, ease: 'power2.out' })
    .to(face, { rotation: -10, duration: 0.28, ease: 'sine.inOut' })
    .to(face, { rotation: 6, duration: 0.24, ease: 'sine.inOut' })
    .to(face, { rotation: 0, duration: 0.7, ease: 'elastic.out(1.4, 0.35)' })
}

// Cada rosto desenhado marca o <g> que se mexe com data-face e as peças com data-part
export const FACE_MOTIONS: Record<FaceMotion, FaceTimeline> = { kiss, laugh, wink, wobble }

// Toca do começo, a não ser que o rosto já esteja no meio do movimento. Num loop, o intervalo entre
// as voltas conta como parado: ali time() fica em duration()
export function replay(motion: gsap.core.Timeline) {
  const time = motion.time()
  if (motion.isActive() && time > 0 && time < motion.duration()) return

  motion.restart()
}

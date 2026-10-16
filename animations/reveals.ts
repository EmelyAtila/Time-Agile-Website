import { gsap, SplitText } from './gsap.config'
import { FACE_MOTIONS, type FaceMotion } from './faceMotions'

export type RevealEnv = {
  desktop: boolean
  // Posição do elemento entre os do mesmo preset no grupo: alterna o lado dos giros
  index: number
  // Desfeitos quando o grupo termina (splits) ou quando o contexto reverte (os dois)
  splits: SplitText[]
  extras: gsap.core.Animation[]
}

type Preset = (el: HTMLElement, env: RevealEnv) => gsap.core.Animation

const side = (index: number) => (index % 2 ? 1 : -1)

// Em palavras, não em linhas: a divisão não depende da largura e um resize não a quebra.
// Destaques com animação própria ([data-reveal] por dentro) ficam inteiros
function splitWords(el: HTMLElement, env: RevealEnv, vars: Partial<SplitText.Vars> = {}) {
  const split = SplitText.create(el, {
    type: 'words',
    aria: 'auto',
    ignore: el.querySelectorAll('[data-reveal]'),
    ...vars,
  })
  env.splits.push(split)
  return split.words
}

// A primeira animação de cada preset é from/fromTo: o estado inicial é aplicado na hora e esconde o elemento
export const REVEALS = {
  // Palavras sobem de dentro de uma máscara
  heading: (el, env) =>
    gsap.from(splitWords(el, env, { mask: 'words' }), {
      yPercent: 115,
      rotation: 6,
      transformOrigin: '0% 100%',
      duration: 0.75,
      stagger: 0.06,
      ease: 'power3.out',
    }),

  // reduceWhiteSpace: false mantém as quebras de linha do whitespace-pre-line
  text: (el, env) => {
    const words = splitWords(el, env, { reduceWhiteSpace: false })
    return gsap.from(words, {
      yPercent: 60,
      opacity: 0,
      duration: 0.6,
      stagger: { amount: Math.min(0.8, words.length * 0.015) },
      ease: 'power2.out',
    })
  },

  // Carimbo: cai grande e girado, bate e treme. Precisa de display inline-block
  stamp: (el, { desktop }) =>
    gsap
      .timeline()
      .from(el, {
        scale: desktop ? 2 : 1.5,
        rotation: -16,
        opacity: 0,
        transformOrigin: '50% 60%',
        duration: 0.45,
        ease: 'back.out(2.6)',
      })
      .to(el, { keyframes: { rotation: [0, -4, 3, -1, 0] }, duration: 0.5, ease: 'none' }),

  // Opacidade à parte: o elastic passa de 1 e voltaria abaixo dele, piscando
  blob: (el) =>
    gsap
      .timeline()
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' })
      .from(
        el,
        { scale: 0.3, transformOrigin: '50% 50%', duration: 1.2, ease: 'elastic.out(1, 0.5)' },
        0
      ),

  // Adesivo colado: vem de cima, maior e girado, e assenta
  sticker: (el, { desktop, index }) =>
    gsap.from(el, {
      yPercent: desktop ? -14 : -8,
      xPercent: 5 * side(index),
      scale: desktop ? 1.22 : 1.12,
      rotation: (desktop ? 12 : 7) * side(index),
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }),

  // Escrita à mão: abre da esquerda para a direita. Folga negativa para a letra cursiva não ser cortada
  handwrite: (el) =>
    gsap.fromTo(
      el,
      { clipPath: 'inset(-40% 100% -40% -15%)' },
      { clipPath: 'inset(-40% -15% -40% -15%)', duration: 0.9, ease: 'power1.inOut' }
    ),

  // Em quem tem transform do Tailwind, o pop vai num <g data-pop> por dentro
  pop: (el, { index }) =>
    gsap.from(el.querySelector(':scope > [data-pop]') ?? el, {
      scale: 0,
      rotation: 30 * side(index),
      transformOrigin: '50% 50%',
      duration: 0.8,
      ease: 'back.out(2)',
    }),

  rise: (el, { desktop }) =>
    gsap.from(el, { y: desktop ? 40 : 28, opacity: 0, duration: 0.7, ease: 'power3.out' }),

  // Bloco grande que sobe com um quique leve
  lift: (el, { desktop }) =>
    gsap.from(el, { y: desktop ? 80 : 48, opacity: 0, duration: 0.9, ease: 'back.out(1.4)' }),

  // Entra pela direita
  slide: (el, { desktop }) =>
    gsap.from(el, { x: desktop ? 90 : 40, opacity: 0, duration: 0.8, ease: 'power3.out' }),

  fade: (el) => gsap.from(el, { opacity: 0, duration: 0.5, ease: 'none' }),

  // data-reveal-from="center" abre do meio; sem ele, da esquerda
  wipe: (el) =>
    gsap.fromTo(
      el,
      {
        clipPath:
          el.dataset.revealFrom === 'center' ? 'inset(0% 50% 0% 50%)' : 'inset(0% 100% 0% 0%)',
      },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }
    ),

  // Cartas dadas: cada uma aparece no meio do leque e voa até o lugar; ao assentar, o rosto do fundo se
  // mexe. Anima o <li>, não o <article> do hover; sem cliques até o grupo terminar
  card: (el, env) => {
    const { desktop, index } = env
    const face = el.querySelector<SVGGElement>('[data-face]')
    gsap.set(el, { pointerEvents: 'none' })

    let from: gsap.TweenVars = { y: 60, rotation: `+=${7 * side(index)}`, opacity: 0 }
    if (desktop && el.parentElement) {
      const fan = el.parentElement.getBoundingClientRect()
      const card = el.getBoundingClientRect()
      from = {
        x: fan.left + fan.width / 2 - (card.left + card.width / 2),
        y: fan.top + fan.height * 0.65 - (card.top + card.height / 2),
        rotation: 8 * side(index),
        scale: 0.7,
        opacity: 0,
      }
    }

    const tl = gsap
      .timeline()
      .from(el, { ...from, duration: desktop ? 0.9 : 0.8, ease: 'back.out(1.3)' })
    if (face) {
      const motion = face.dataset.face as FaceMotion
      tl.call(() => env.extras.push(FACE_MOTIONS[motion](face)), undefined, '-=0.3')
    }
    return tl
  },

  // Polaroide jogada na mesa: cai girada e assenta
  polaroid: (el, { desktop, index }) =>
    gsap.from(el, {
      y: desktop ? -80 : -40,
      rotation: (desktop ? 16 : 9) * side(index),
      scale: 1.15,
      opacity: 0,
      duration: 0.85,
      ease: 'back.out(1.5)',
    }),

  // Pílulas que estouram como bolhas. Sem a transição de CSS do hover, que atrasaria cada quadro
  bubbles: (el) => {
    const tags = el.querySelectorAll('li')
    gsap.set(tags, { transition: 'none' })
    return gsap.from(tags, {
      scale: 0,
      opacity: 0,
      duration: 0.55,
      stagger: 0.05,
      ease: 'back.out(3)',
    })
  },

  'card-up': (el, { desktop, index }) =>
    gsap.from(el, {
      y: desktop ? 70 : 44,
      rotation: 5 * side(index),
      opacity: 0,
      duration: 0.75,
      ease: 'back.out(1.5)',
    }),
} satisfies Record<string, Preset>

export type RevealName = keyof typeof REVEALS

// Quanto depois do começo deste elemento o próximo do grupo começa (s)
export const LEAD: Record<RevealName, number> = {
  heading: 0.3,
  text: 0.15,
  stamp: 0.15,
  blob: 0.15,
  sticker: 0.18,
  handwrite: 0.3,
  pop: 0.1,
  rise: 0.08,
  lift: 0.25,
  slide: 0.15,
  fade: 0.1,
  wipe: 0.25,
  card: 0.12,
  polaroid: 0.15,
  bubbles: 0.1,
  'card-up': 0.1,
}

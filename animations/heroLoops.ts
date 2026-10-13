import { gsap } from './gsap.config'

/** Pausa (s) entre um balanço do "!" do título e o seguinte */
const MARK_EVERY = 2.6

/** Pausa (s) entre um chamado do botão do header e o seguinte */
const CTA_EVERY = 4.5

/**
 * Loops sutis que começam quando a entrada do Hero termina: o "!" do título balança e o
 * botão do header dá um pulinho de gelatina com a seta.
 * Chame dentro de um contexto do GSAP (context.add): o revert dele desfaz tudo.
 */
export function startHeroLoops(section: HTMLElement, variant: 'desktop' | 'mobile') {
  // 1. "!" do título: balança apoiado na base, como um joão-bobo
  const mark = section.querySelector(`[data-hero-art="${variant}"] [data-hero-mark]`)
  if (mark) {
    gsap
      .timeline({
        repeat: -1,
        repeatDelay: MARK_EVERY,
        delay: 0.6,
        // Só com o Hero na tela: fora dela não há por que redesenhar o título
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play pause resume pause',
        },
      })
      // `rotate` é atributo do <tspan> (gira o glifo); transform de CSS não vale em <tspan>
      .to(mark, { attr: { rotate: 18 }, duration: 0.16, ease: 'power2.out' })
      .to(mark, { attr: { rotate: -13 }, duration: 0.22, ease: 'sine.inOut' })
      .to(mark, { attr: { rotate: 8 }, duration: 0.2, ease: 'sine.inOut' })
      .to(mark, { attr: { rotate: 0 }, duration: 0.6, ease: 'elastic.out(1.4, 0.35)' })
  }

  // 2. Botão do header: o wrapper, e não o Button, que tem transition-all e brigaria com o GSAP
  const cta = document.querySelector<HTMLElement>('[data-intro="cta"]')
  const arrow = cta?.querySelector('svg')
  if (cta && arrow) {
    gsap
      .timeline({ repeat: -1, repeatDelay: CTA_EVERY, delay: 1.5 })
      .to(cta, { scaleX: 1.07, scaleY: 0.92, duration: 0.14, ease: 'power2.out' })
      .to(cta, { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1.1, 0.35)' })
      // A seta dá um bote para a frente junto com o pulinho
      .to(arrow, { x: 7, duration: 0.18, ease: 'power2.out' }, 0.05)
      .to(arrow, { x: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, 0.23)
  }
}

import { gsap } from './gsap.config'
import { animateHeaderCta } from './headerCta'

/** Pausa (s) entre um balanço do "!" do título e o seguinte */
const MARK_EVERY = 2.6

/**
 * O que começa quando a entrada do Hero termina: o "!" do título passa a balançar em loop
 * e o botão do header ganha vida (animations/headerCta.ts).
 * Chame dentro de um contexto do GSAP (context.add): o revert dele desfaz as animações e
 * chama a limpeza devolvida aqui.
 */
export function startHeroLoops(section: HTMLElement, variant: 'desktop' | 'mobile') {
  // "!" do título: balança apoiado na base, como um joão-bobo
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

  const cta = document.querySelector<HTMLElement>('[data-intro="cta"]')
  if (cta) return animateHeaderCta(cta)
}

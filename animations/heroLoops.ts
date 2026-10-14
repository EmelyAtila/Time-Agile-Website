import { gsap } from './gsap.config'
import { animateHeaderCta } from './headerCta'

const MARK_EVERY = 2.6

// Chame dentro de um contexto do GSAP: o revert dele chama a limpeza devolvida aqui
export function startHeroLoops(section: HTMLElement, variant: 'desktop' | 'mobile') {
  const mark = section.querySelector(`[data-hero-art="${variant}"] [data-hero-mark]`)
  if (mark) {
    gsap
      .timeline({
        repeat: -1,
        repeatDelay: MARK_EVERY,
        delay: 0.6,
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

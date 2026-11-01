'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { NAV_LINKS, PRIMARY_CTA } from '@/content/nav'
import { Button } from '@/components/ui'
import { useHeaderDock } from '@/animations/useHeaderDock'
import { useNavScrollSpy } from '@/animations/useNavScrollSpy'

const NAV_HREFS = NAV_LINKS.map((link) => link.href)

const FOCUS =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-wine'

// Os `data-intro` são animados pela entrada do Hero (styles/hero-intro.css)
export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const headerRef = useHeaderDock()
  const { navRef, indicatorRef, activeIndex } = useNavScrollSpy(NAV_HREFS)
  const activeHref = NAV_HREFS[activeIndex]

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    // O `top` negativo deixa a folga do padding-top rolar para fora antes de grudar;
    // a margem negativa faz o conteúdo começar por baixo do header
    <header
      ref={headerRef}
      className="sticky top-[calc(var(--header-offset)*-1)] z-50 -mb-[calc(var(--header-height)+var(--header-offset))] box-content h-header pt-[var(--header-offset)] [--header-offset:0px] lg:[--header-offset:clamp(0px,2vw,1.875rem)]"
    >
      <div
        aria-hidden
        data-header-band
        className="absolute inset-x-0 bottom-0 -z-10 h-header bg-[color-mix(in_srgb,var(--color-cream)_88%,transparent)] opacity-[var(--header-solid,0)] shadow-card backdrop-blur-md"
      />
      <div className="flex h-full items-center justify-end gap-[clamp(1.25rem,2.7vw,2.5rem)] px-[var(--hero-padding-x)] text-[clamp(1rem,1.35vw,1.25rem)]">
        <nav ref={navRef} aria-label="Principal" className="relative hidden md:block">
          <ul className="flex items-center gap-[clamp(1.125rem,2.2vw,2rem)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href} data-intro="nav-item" data-nav-item>
                <a
                  href={link.href}
                  aria-label={link.label}
                  aria-current={link.href === activeHref ? 'location' : undefined}
                  className={`block rounded-sm py-2 transition-colors duration-300 hover:text-brand-pink ${FOCUS}`}
                >
                  {/* O nome do link vem do aria-label */}
                  <span aria-hidden>
                    {Array.from(link.label, (letter, index) => (
                      <span key={index} data-nav-letter className="inline-block whitespace-pre">
                        {letter}
                      </span>
                    ))}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {/* A entrada anima o <span> de dentro: o GSAP do scroll spy absorveria o `scale` do CSS */}
          <span
            ref={indicatorRef}
            data-nav-indicator
            aria-hidden
            className="invisible absolute -bottom-1 left-0 h-1.5 w-[26px]"
          >
            <span className="block size-full bg-brand-orange" />
          </span>
        </nav>

        {/* Wrapper: o Button tem transição de transform, que brigaria com o GSAP */}
        <div data-intro="cta" className="hidden md:block">
          <Button
            href={PRIMARY_CTA.href}
            size="sm"
            aria-label={PRIMARY_CTA.label}
            className="group relative isolate border-white/85 px-[1em] py-[0.4em] text-[0.95em] hover:bg-brand-pink-dark"
          >
            {/* Sem o GSAP as ondas não aparecem e o laranja é só um fade */}
            <span
              data-cta-ripple
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-brand-yellow [clip-path:circle(0)]"
            />
            <span
              data-cta-ripple
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-brand-pink-light [clip-path:circle(0)]"
            />
            <span
              data-cta-fill
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full bg-brand-orange opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            {/* O nome do botão vem do aria-label */}
            <span aria-hidden>
              {Array.from(PRIMARY_CTA.label, (letter, index) => (
                <span key={index} data-cta-letter className="inline-block whitespace-pre">
                  {letter}
                </span>
              ))}
            </span>
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        </div>

        <div data-intro="menu-button" className="md:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            className="grid size-11 place-items-center rounded-full bg-brand-cream shadow-card"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-menu"
          aria-label="Menu mobile"
          className="absolute inset-x-4 top-full rounded-lg bg-brand-cream p-3 shadow-card md:hidden"
        >
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={link.href === activeHref ? 'location' : undefined}
                  className={`block rounded-md px-4 py-3 text-lg aria-[current=location]:font-semibold aria-[current=location]:text-brand-pink ${FOCUS}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <Button href={PRIMARY_CTA.href} className="w-full" onClick={() => setIsOpen(false)}>
                {PRIMARY_CTA.label}
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

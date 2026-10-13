'use client'

import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { NAV_LINKS, PRIMARY_CTA } from '@/content/nav'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useNavScrollSpy } from '@/animations/useNavScrollSpy'

const NAV_HREFS = NAV_LINKS.map((link) => link.href)

// Os `data-intro` são animados pela entrada do Hero (animations/useHeroIntro.ts)
export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { navRef, indicatorRef, activeIndex, isScrolled } = useNavScrollSpy(NAV_HREFS)
  const activeHref = NAV_HREFS[activeIndex]

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-header transition-[top,background-color,box-shadow] duration-300',
        // No topo fica solto sobre o Hero, na posição do mockup; rolou, vira uma faixa legível
        isScrolled
          ? 'bg-[color-mix(in_srgb,var(--color-cream)_88%,transparent)] shadow-card backdrop-blur-md'
          : 'lg:top-[clamp(0px,2vw,1.875rem)]'
      )}
    >
      {/* Medidas fluidas: nos 1480px do mockup dão 20px de fonte e 32px entre os links */}
      <div className="flex h-full items-center justify-end gap-[clamp(1.25rem,2.7vw,2.5rem)] px-[var(--hero-padding-x)] text-[clamp(1rem,1.35vw,1.25rem)]">
        <nav ref={navRef} aria-label="Principal" className="relative hidden md:block">
          <ul className="flex items-center gap-[clamp(1.125rem,2.2vw,2rem)]">
            {NAV_LINKS.map((link) => (
              <li key={link.href} data-intro="nav-item" data-nav-item>
                <a
                  href={link.href}
                  aria-current={link.href === activeHref ? 'location' : undefined}
                  className="block py-2 transition-colors duration-300 hover:text-brand-pink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Uma barra só, movida por useNavScrollSpy conforme a seção em que a página está */}
          <span
            ref={indicatorRef}
            data-nav-indicator
            aria-hidden
            className="invisible absolute -bottom-1 left-0 h-1.5 w-[26px] bg-brand-orange"
          />
        </nav>

        {/* Wrapper: o Button tem transition-all, que brigaria com o GSAP */}
        <div data-intro="cta" className="hidden md:block">
          <Button
            href={PRIMARY_CTA.href}
            size="sm"
            className="border-white/85 px-[1em] py-[0.4em] text-[0.95em]"
          >
            {PRIMARY_CTA.label}
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        </div>

        <div data-intro="menu-button" className="md:hidden">
          <button
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
                  className="block rounded-md px-4 py-3 text-lg aria-[current=location]:font-semibold aria-[current=location]:text-brand-pink"
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

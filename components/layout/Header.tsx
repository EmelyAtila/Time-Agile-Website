'use client'

import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { NAV_LINKS, PRIMARY_CTA } from '@/content/nav'
import { Button, Container } from '@/components/ui'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50 h-header">
      <Container className="flex h-full items-center justify-end gap-8">
        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <Button href={PRIMARY_CTA.href} size="sm" className="hidden md:inline-flex">
          {PRIMARY_CTA.label}
          <ArrowRight aria-hidden className="size-4" />
        </Button>

        <button
          type="button"
          className="md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </Container>

      {isOpen && (
        <nav id="mobile-menu" aria-label="Menu mobile" className="md:hidden">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={PRIMARY_CTA.href} onClick={() => setIsOpen(false)}>
                {PRIMARY_CTA.label}
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

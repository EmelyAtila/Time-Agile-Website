'use client'

import { useEffect, useState } from 'react'
import { site } from '@/content/site'
import { cn } from '@/lib/utils'
import { WhatsAppIcon } from '@/components/decor/WhatsAppIcon'

/** Faixa da tela onde o botão fica (de 90% a 95% da altura): ele aparece enquanto a seção passa por ela */
const BUTTON_BAND = '-90% 0px -5% 0px'

type WhatsAppButtonProps = {
  /** Seletor da seção em que o botão aparece; fora dela ele fica escondido */
  section: string
}

export function WhatsAppButton({ section }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const target = document.querySelector(section)
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: BUTTON_BAND,
    })
    observer.observe(target)

    return () => observer.disconnect()
  }, [section])

  return (
    <a
      href={site.contact.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a Time Agile no WhatsApp"
      className={cn(
        'fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full bg-brand-whatsapp text-white shadow-card',
        'transition-[transform,opacity,visibility] duration-300 motion-reduce:transition-none',
        // `invisible` também tira o botão do Tab e do leitor de tela enquanto está escondido
        isVisible ? 'ease-[cubic-bezier(0.34,1.56,0.64,1)]' : 'invisible scale-0 opacity-0'
      )}
    >
      <WhatsAppIcon className="size-8" />
    </a>
  )
}

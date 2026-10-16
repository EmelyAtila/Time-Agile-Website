import { Beijinho } from '@/components/decor/Beijinho'
import { Smiley } from '@/components/decor/Smiley'
import { Sorrizinho } from '@/components/decor/Sorrizinho'
import { cn } from '@/lib/utils'
import { ContactFacesLoop } from './ContactFacesLoop'

// Smileys de docs/Desktop - 1.svg em px do mockup (--u), a partir do topo da seção (y 4998) e da borda esquerda
// da tela. Amarelo e rosa-claro são o Smiley girado; o que passa de x 0 fica fora da tela.
// O Sorrizinho conta da base: os tamanhos mínimos do formulário alongam a seção em telas baixas, e ele
// precisa continuar passando por cima do rodapé
export function ContactSmileys({ className }: { className?: string }) {
  return (
    <ContactFacesLoop
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 z-10', className)}
    >
      <Smiley
        color="yellow"
        className="absolute left-[calc(-102.1*var(--u))] top-[calc(149.9*var(--u))] w-[calc(219.3*var(--u))] origin-top-left -rotate-[52.51deg]"
      />
      <Smiley
        color="pink-light"
        className="absolute left-[calc(-11.6*var(--u))] top-[calc(180.9*var(--u))] w-[calc(235.4*var(--u))] origin-top-left rotate-[6.74deg]"
      />
      <Beijinho className="absolute left-0 top-[calc(394.3*var(--u))] w-[calc(249*var(--u))]" />
      <Sorrizinho className="absolute -bottom-[calc(26.7*var(--u))] left-0 w-[calc(324*var(--u))]" />
    </ContactFacesLoop>
  )
}

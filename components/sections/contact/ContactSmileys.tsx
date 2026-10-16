import Image from 'next/image'
import { Smiley } from '@/components/decor/Smiley'
import { cn } from '@/lib/utils'

const LAYER = 'pointer-events-none absolute left-0 z-10'

// Smileys de docs/Desktop - 1.svg em px do mockup (--u), a partir do topo da seção (y 4998) e da borda esquerda
// da tela. Amarelo e rosa-claro são o Smiley girado; nos arquivos exportados, o que passa de x 0 fica cortado
// pelo viewBox, mas ali já é fora da tela. max-w-none: o pai, só com filhos absolutos, tem largura zero.
// O Sorrizinho conta da base: os tamanhos mínimos do formulário alongam a seção em telas baixas, e ele
// precisa continuar passando por cima do rodapé
export function ContactSmileys({ className }: { className?: string }) {
  return (
    <>
      <div aria-hidden className={cn(LAYER, 'top-0', className)}>
        <Smiley
          color="yellow"
          className="absolute left-[calc(-102.1*var(--u))] top-[calc(149.9*var(--u))] w-[calc(219.3*var(--u))] origin-top-left -rotate-[52.51deg]"
        />
        <Smiley
          color="pink-light"
          className="absolute left-[calc(-11.6*var(--u))] top-[calc(180.9*var(--u))] w-[calc(235.4*var(--u))] origin-top-left rotate-[6.74deg]"
        />
        <Image
          src="/images/Beijinho.svg"
          alt=""
          width={249}
          height={280}
          unoptimized
          className="absolute left-0 top-[calc(394.3*var(--u))] h-auto w-[calc(249*var(--u))] max-w-none"
        />
      </div>
      <div aria-hidden className={cn(LAYER, 'bottom-0', className)}>
        <Image
          src="/images/Sorrizinho.svg"
          alt=""
          width={324}
          height={341}
          unoptimized
          className="absolute -bottom-[calc(26.7*var(--u))] left-0 h-auto w-[calc(324*var(--u))] max-w-none"
        />
      </div>
    </>
  )
}

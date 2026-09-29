import type { NavLink } from '@/types'

export const NAV_LINKS: NavLink[] = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#contato', label: 'Contato' },
]

export const PRIMARY_CTA = { href: '#contato', label: 'Vamos Construir Juntos' } as const

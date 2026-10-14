import type { Service } from '@/types'

export const servicesIntro = {
  title: 'Mais do que serviços, soluções.',
  description:
    'Criamos estratégias inteligentes para construir marcas fortes, aumentar sua visibilidade e impulsionar resultados reais.',
}

// Os \n são as quebras de linha do mockup: o texto do card faz parte da arte e não reflui.
// As imagens são os adesivos exportados do mockup, convertidos de SVG para WebP em 3x.
export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Construímos\nconexões que\nfortalecem sua\nmarca',
    description:
      'Planejamento, conteúdo e\ngestão completa para\nfortalecer sua presença\ndigital.',
    color: 'pink-light',
    image: { src: '/images/services/camera.webp', alt: '', width: 186, height: 206 },
  },
  {
    number: '02',
    title: 'Branding & Conteúdo',
    description:
      'Transformando ideias em\nmarcas memoráveis.\nFotos, vídeos e\nidentidade para criar\nconexões reais com seu\npúblico.',
    color: 'yellow',
    image: { src: '/images/services/produto.webp', alt: '', width: 231, height: 202 },
  },
  {
    number: '03',
    title: 'Planejando hoje o\ncrescimento de\namanhã.',
    description: 'Consultoria para\norganizar processos e\nimpulsionar resultados.',
    color: 'orange',
    image: { src: '/images/services/celular.webp', alt: '', width: 210, height: 200 },
  },
  {
    number: '04',
    title: 'Impulsionando\nresultados com\nestratégias inteligentes.',
    description: 'Campanhas de tráfego\npago focadas em alcance,\nconversão e crescimento.',
    color: 'pink',
    image: { src: '/images/services/cafe.webp', alt: '', width: 269, height: 208 },
  },
]

// Faixa em loop entre Serviços e Projetos (TagMarquee); as cores seguem a ordem da lista
export const TAGS = [
  'Marketing',
  'Estratégia',
  'Criatividade',
  'Branding',
  'Gestão',
  'Conteúdo',
  'Redes Sociais',
  'Tráfego Pago',
  'Consultoria',
  'Posicionamento',
  'Identidade Visual',
  'Planejamento',
  'Performance',
  'Crescimento',
  'Resultados',
]

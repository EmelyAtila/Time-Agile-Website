import type { Service } from '@/types'

export const servicesIntro = {
  title: 'Mais do que serviços, soluções.',
  description:
    'Criamos estratégias inteligentes para construir marcas fortes, aumentar sua visibilidade e impulsionar resultados reais.',
}

export const SERVICES: Service[] = [
  {
    number: '01',
    title: 'Construímos conexões que fortalecem sua marca',
    description: 'Planejamento, conteúdo e gestão completa para fortalecer sua presença digital.',
    color: 'pink-light',
    image: { src: '/images/services/camera.png', alt: '', width: 558, height: 447 },
  },
  {
    number: '02',
    title: 'Branding & Conteúdo',
    description:
      'Transformando ideias em marcas memoráveis. Fotos, vídeos e identidade para criar conexões reais com seu público.',
    color: 'yellow',
    image: { src: '/images/services/coffee-pack.png', alt: '', width: 458, height: 545 },
  },
  {
    number: '03',
    title: 'Planejando hoje o crescimento de amanhã.',
    description: 'Consultoria para organizar processos e impulsionar resultados.',
    color: 'orange',
    image: { src: '/images/services/phone.png', alt: '', width: 1536, height: 1024 },
  },
  {
    number: '04',
    title: 'Impulsionando resultados com estratégias inteligentes.',
    description: 'Campanhas de tráfego pago focadas em alcance, conversão e crescimento.',
    color: 'pink',
    image: { src: '/images/services/coffee-mug.png', alt: '', width: 1536, height: 1024 },
  },
]

export const TAGS = ['Identidade', 'Marketing', 'Estratégia', 'Criatividade', 'Branding', 'Gestão']

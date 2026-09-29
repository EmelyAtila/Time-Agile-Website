import type { ImageAsset, Project } from '@/types'

export const projectsIntro = {
  title: 'Projetos que contam histórias e geram resultados.',
  paragraphs: [
    'Cada marca possui uma essência única.',
    'Conheça alguns dos projetos desenvolvidos pela Time Agile, onde estratégia, criatividade e identidade visual se unem para criar experiências que fortalecem marcas e aproximam empresas do seu público.',
  ],
  image: {
    src: '/images/projects/iranides-portrait.png',
    alt: 'Iranides Souza, sócia da Time Agile, sorrindo',
    width: 1679,
    height: 937,
  } satisfies ImageAsset,
}

export const PROJECTS: Project[] = [
  {
    title: 'Fotografia & Direção Criativa',
    description:
      'Produção de fotos estratégicas para destacar os produtos, fortalecer a identidade da marca e criar uma comunicação mais atrativa nas redes sociais.',
    images: [
      {
        src: '/images/projects/fotografia-direcao.jpg',
        alt: 'Cliente fotografando uma torre de doces em uma doceria',
        width: 853,
        height: 1280,
      },
    ],
  },
  {
    title: 'Captação de Conteúdo',
    description:
      'Produção de fotos estratégicas para destacar os produtos, fortalecer a identidade da marca e criar uma comunicação mais atrativa nas redes sociais.',
    images: [
      {
        src: '/images/projects/captacao-conteudo.jpg',
        alt: 'Modelo segurando embalagem de café sentada em um sofá',
        width: 854,
        height: 1280,
      },
    ],
  },
  {
    title: 'Branding de Produtos',
    subtitle: 'Identidade Visual',
    description: '',
    images: [
      {
        src: '/images/projects/branding-1.jpg',
        alt: 'Modelo surpresa segurando embalagem de café',
        width: 854,
        height: 1280,
      },
      {
        src: '/images/projects/branding-2.jpg',
        alt: 'Modelo apresentando fones de ouvido em estojo azul',
        width: 854,
        height: 1280,
      },
      {
        src: '/images/projects/branding-3.jpg',
        alt: 'Criadora de conteúdo registrando doces em uma doceria',
        width: 853,
        height: 1280,
      },
    ],
  },
  {
    title: 'Gestão de Redes Sociais',
    description:
      'Planejamento, criação de conteúdo, organização do perfil e captação de fotos e vídeos para manter uma presença digital ativa e alinhada ao posicionamento da marca.',
    images: [],
  },
]

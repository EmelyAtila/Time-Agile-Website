import { imageAsset } from '@/lib/image-asset'
import type { Project } from '@/types'
import branding1 from '@/public/images/projects/branding-1.jpg'
import branding2 from '@/public/images/projects/branding-2.jpg'
import branding3 from '@/public/images/projects/branding-3.jpg'
import captacaoConteudo from '@/public/images/projects/captacao-conteudo.jpg'
import fotografiaDirecao from '@/public/images/projects/fotografia-direcao.jpg'
import stickerIranides from '@/public/images/projects/sticker-iranides.webp'

export const projectsIntro = {
  title: 'Projetos que contam histórias e geram resultados.',
  paragraphs: [
    'Cada marca possui uma essência única.',
    'Conheça alguns dos projetos desenvolvidos pela Time Agile, onde estratégia, criatividade e identidade visual se unem para criar experiências que fortalecem marcas e aproximam empresas do seu público.',
  ],
  image: imageAsset(stickerIranides, 'Iranides Souza, sócia da Time Agile, sorrindo'),
}

export const PROJECTS: Project[] = [
  {
    title: 'Fotografia & Direção Criativa',
    description:
      'Produção de fotos estratégicas para destacar os produtos, fortalecer a identidade da marca e criar uma comunicação mais atrativa nas redes sociais.',
    images: [
      imageAsset(fotografiaDirecao, 'Cliente fotografando uma torre de doces em uma doceria'),
    ],
  },
  {
    title: 'Captação de Conteúdo',
    description:
      'Produção de fotos estratégicas para destacar os produtos, fortalecer a identidade da marca e criar uma comunicação mais atrativa nas redes sociais.',
    images: [imageAsset(captacaoConteudo, 'Modelo segurando embalagem de café sentada em um sofá')],
  },
  {
    title: 'Branding de Produtos',
    subtitle: 'Identidade Visual',
    description: '',
    images: [
      imageAsset(branding1, 'Modelo surpresa segurando embalagem de café'),
      imageAsset(branding2, 'Modelo apresentando fones de ouvido em estojo azul'),
      imageAsset(branding3, 'Criadora de conteúdo registrando doces em uma doceria'),
    ],
  },
  {
    title: 'Gestão de Redes Sociais',
    description:
      'Planejamento, criação de conteúdo, organização do perfil e captação de fotos e vídeos para manter uma presença digital ativa e alinhada ao posicionamento da marca.',
    images: [],
  },
]

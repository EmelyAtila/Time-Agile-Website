export interface NavLink {
  href: `#${string}`
  label: string
}

export interface ImageAsset {
  src: string
  alt: string
  width: number
  height: number
}

export interface Person {
  name: string
  role: string
  photo: ImageAsset
}

export type BrandColor = 'pink' | 'orange' | 'yellow' | 'pink-light'

export interface Service {
  // Nome do serviço em texto corrido, para os dados estruturados da busca
  name: string
  number: string
  title: string
  description: string
  color: BrandColor
  image: ImageAsset
}

export interface Project {
  title: string
  subtitle?: string
  description: string
  images: ImageAsset[]
}

export interface Testimonial {
  author: string
  quote: string
  color: BrandColor
}

// Texto com links no formato [texto](endereço); o resto sai como texto puro
export type LegalBlock = string | { list: string[] }

export interface LegalSection {
  id: string
  heading: string
  body: LegalBlock[]
}

export interface LegalDocument {
  path: `/${string}`
  title: string
  description: string
  // AAAA-MM-DD
  updatedAt: string
  intro: string
  sections: LegalSection[]
}

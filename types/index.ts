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
  photo: ImageAsset
}

import type { StaticImageData } from 'next/image'
import type { ImageAsset } from '@/types'

// Import estático: a URL leva o hash do arquivo (cache permanente) e o build gera a prévia borrada
export const imageAsset = ({ src, width, height, blurDataURL }: StaticImageData, alt: string) =>
  ({ src, width, height, blurDataURL, alt }) satisfies ImageAsset

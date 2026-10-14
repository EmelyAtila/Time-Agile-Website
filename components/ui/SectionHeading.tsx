import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  children: ReactNode
}

export function SectionHeading({ id, as: Tag = 'h2', className, children }: SectionHeadingProps) {
  return (
    <Tag id={id} className={cn('font-sans font-bold', className)}>
      {children}
    </Tag>
  )
}

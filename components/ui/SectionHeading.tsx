import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type SectionHeadingProps = Omit<ComponentPropsWithoutRef<'h2'>, 'id' | 'children'> & {
  id: string
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
}

export function SectionHeading({
  id,
  as: Tag = 'h2',
  className,
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <Tag id={id} className={cn('font-sans font-bold', className)} {...props}>
      {children}
    </Tag>
  )
}

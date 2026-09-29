import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, Ref } from 'react'

const variants = {
  primary: 'bg-brand-pink text-white hover:bg-brand-orange hover:shadow-cta',
  secondary: 'bg-brand-orange text-white hover:bg-brand-pink hover:shadow-cta',
  outline: 'border-current bg-transparent text-current hover:bg-white/10',
} as const

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-base',
} as const

type AsAnchor = { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>
type AsButton = { href?: never } & ButtonHTMLAttributes<HTMLButtonElement>

export type ButtonProps = {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
  children: ReactNode
} & (AsAnchor | AsButton)

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-[1.5px] border-transparent font-serif font-semibold transition-all duration-300',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-wine',
    'disabled:pointer-events-none disabled:opacity-60',
    variants[variant],
    sizes[size],
    className
  )

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as AsAnchor
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button ref={ref as Ref<HTMLButtonElement>} className={cls} {...(props as AsButton)}>
      {children}
    </button>
  )
})

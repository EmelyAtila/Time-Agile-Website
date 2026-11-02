import type { SVGProps } from 'react'

// Avião de papel preenchido do mockup (o Send do lucide-react é só contorno)
export function PaperPlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="currentColor" aria-hidden {...props}>
      <path d="M15.84 0.23C16.13 0.08 16.4 0.1 16.67 0.3C16.96 0.48 17.08 0.73 17.03 1.06L14.64 15.41C14.6 15.65 14.45 15.84 14.21 15.97C13.99 16.1 13.77 16.11 13.55 16L9.4 14.28L7.27 16.83C7.05 17.12 6.76 17.2 6.41 17.07C6.05 16.96 5.88 16.71 5.88 16.34V13.65L13.88 3.92C13.94 3.81 13.93 3.72 13.85 3.65C13.76 3.56 13.67 3.55 13.58 3.62L4.05 12.02L0.53 10.56C0.22 10.43 0.05 10.19 0.03 9.86C0.01 9.53 0.14 9.29 0.43 9.13L15.84 0.23Z" />
    </svg>
  )
}

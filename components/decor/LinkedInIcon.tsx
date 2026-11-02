import type { SVGProps } from 'react'

// O "in" preenchido do mockup (o Linkedin do lucide-react é só contorno)
export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M22.22 0H1.77C0.79 0 0 0.77 0 1.73V22.27C0 23.22 0.79 24 1.77 24H22.22C23.2 24 24 23.22 24 22.27V1.73C24 0.77 23.2 0 22.22 0ZM7.12 20.45H3.56V9H7.12V20.45ZM5.34 7.43C4.2 7.43 3.27 6.51 3.27 5.37C3.27 4.23 4.2 3.31 5.34 3.31C6.48 3.31 7.4 4.23 7.4 5.37C7.4 6.51 6.48 7.43 5.34 7.43ZM20.45 20.45H16.89V14.88C16.89 13.56 16.87 11.85 15.04 11.85C13.19 11.85 12.91 13.29 12.91 14.79V20.45H9.36V9H12.77V10.56H12.82C13.29 9.66 14.45 8.71 16.18 8.71C19.79 8.71 20.45 11.08 20.45 14.17V20.45Z" />
    </svg>
  )
}

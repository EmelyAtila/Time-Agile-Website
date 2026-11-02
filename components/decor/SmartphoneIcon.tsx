import type { SVGProps } from 'react'

// O Smartphone do lucide-react com a linha da base da tela que o mockup acrescenta
export function SmartphoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 33 33"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M16.5 24.75H16.51M9.63 2.75H23.38C24.89 2.75 26.13 3.98 26.13 5.5V27.5C26.13 29.02 24.89 30.25 23.38 30.25H9.63C8.11 30.25 6.88 29.02 6.88 27.5V5.5C6.88 3.98 8.11 2.75 9.63 2.75Z" />
      <path d="M7.07 20.8C13.06 20.8 19.04 20.75 25.02 20.75" />
    </svg>
  )
}

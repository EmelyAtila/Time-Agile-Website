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
      <path d="M16.5 24.75H16.5138M9.625 2.75H23.375C24.8938 2.75 26.125 3.98122 26.125 5.5V27.5C26.125 29.0188 24.8938 30.25 23.375 30.25H9.625C8.10622 30.25 6.875 29.0188 6.875 27.5V5.5C6.875 3.98122 8.10622 2.75 9.625 2.75Z" />
      <path d="M7.06934 20.8016C13.0637 20.8016 19.04 20.751 25.0227 20.751" />
    </svg>
  )
}

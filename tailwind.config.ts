import type { Config } from 'tailwindcss'

// Cores, fontes e medidas vêm de styles/tokens.css — aqui só mapeamos para utilitários.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.ts'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: 'var(--color-pink)',
          orange: 'var(--color-orange)',
          yellow: 'var(--color-yellow)',
          'pink-light': 'var(--color-pink-light)',
          wine: 'var(--color-wine)',
          cream: 'var(--color-cream)',
          red: 'var(--color-red)',
          whatsapp: 'var(--color-whatsapp)',
        },
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)'],
        script: ['var(--font-script)'],
      },
      screens: {
        sm: '375px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      spacing: {
        header: 'var(--header-height)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        cta: 'var(--shadow-cta)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config

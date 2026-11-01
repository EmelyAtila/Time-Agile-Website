import type { Testimonial } from '@/types'

export const testimonialsIntro = {
  title: 'Nossa melhor apresentação?',
  highlight: 'Nossos clientes!',
}

// Trechos de mensagens publicadas no Instagram da marca. Todos os cards têm a altura do maior: manter os textos com tamanhos parecidos
export const TESTIMONIALS: Testimonial[] = [
  {
    author: 'Geovanna – Cedro Padaria',
    quote: 'Estou amando a agilidade de vocês, já ganhou mil pontos com isso!',
    color: 'yellow',
  },
  {
    author: 'Cecília – Descomplicando',
    quote:
      'Você veste a camisa e isso é um diferencial gigantesco no seu trabalho! Dá pra sentir que você coloca a sua alma!',
    color: 'orange',
  },
  {
    author: 'Bianka – Aquele Com Café',
    quote:
      'Tudo perfeito! Só temos a agradecer por toda a ajuda e por atender aos nossos pedidos em cima da hora.',
    color: 'pink',
  },
  {
    author: 'Cecília – Descomplicando',
    quote:
      'Mesmo sendo a primeira vez que gravo pra nossa rede social, me senti fazendo algo natural do meu dia a dia.',
    color: 'pink-light',
  },
]

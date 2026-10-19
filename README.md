# Time Agile — Landing Page

Landing page da **Time Agile · Marketing e Gestão**.
Identidade visual em [`docs/Identidade visual - Time Agile.pdf`](docs/Identidade%20visual%20-%20Time%20Agile.pdf), mockup em [`docs/Desktop - 1.svg`](docs/Desktop%20-%201.svg) e resumo da marca em [`docs/BRAND.md`](docs/BRAND.md).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3**, com tokens da marca em CSS vars
- **GSAP** (`@gsap/react`) + **Lenis** para animações e rolagem suave
- **Embla Carousel** para os depoimentos
- **react-hook-form** + **zod** + **Resend** para o formulário de contato (Server Action)
- **lucide-react** para os ícones

## Scripts

| Comando              | O que faz                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Servidor de desenvolvimento        |
| `npm run build`      | Build de produção (`standalone`)   |
| `npm run start`      | Sobe o build de produção           |
| `npm run lint`       | ESLint                             |
| `npm run type-check` | Checagem de tipos                  |
| `npm run format`     | Prettier (ordena classes Tailwind) |

Copie `.env.example` para `.env.local` e preencha as variáveis.

## Estrutura

```
app/                 layout, page (compõe as seções), robots, sitemap
  actions/           server actions (contact.ts)
components/
  layout/            Header, Footer, Logo, WhatsAppButton
  sections/          Hero, About, Services, TagMarquee, Projects, Testimonials, Contact
    hero/            HeroIntro (wrapper client), HeroRibbons, heroPaths (curvas das fitas), useFluidArt
    about/           AboutTeam (adesivos da equipe sobre os blobs)
    services/        ServiceCard, serviceCards (posições, inclinações e movimento de hover de cada card), CardFace (rostos de fundo dos cards, animados no hover), ServiceFan (wrapper client)
    tags/            TagLoop (wrapper client do loop da faixa de tags), TagRibbon (fita laranja por trás das tags)
    projects/        ProjectsPortrait (Iranides sobre os blobs), ProjectsArrow (seta na borda da faixa rosa, que se desenha ao entrar na tela e balança no hover), ProjectShowcase + showcaseLayout (faixa rosa com os projetos e as fotos), ProjectsRibbon (fita rosa que se desenha com a rolagem)
    contact/         ContactSmileys (os quatro smileys na borda esquerda), ContactFacesLoop (wrapper client do beijo e da risada)
  forms/             ContactForm
  ui/                Button, SectionHeading, Carousel  (barrel em index.ts)
  decor/             Smiley, Beijinho, Sorrizinho, InstagramIcon, LinkedInIcon, WhatsAppIcon, PaperPlaneIcon, SmartphoneIcon — elementos puramente visuais
  providers/         SmoothScrollProvider (Lenis + GSAP), ScrollReveals (liga as entradas no scroll)
content/             TODO o texto e os dados do site (edite aqui, não nos componentes)
animations/          gsap.config.ts, reveals + useScrollReveals (entradas no scroll), heroBoot (script inline que começa a entrada do Hero antes do React), useHeroIntro (liga os loops do Hero), heroLoops, headerCta (botão do header), useNavScrollSpy (barra do menu), useHeaderDock (fundo do header), faceMotions (beijo, risada, piscadinha e balanço dos rostos, também no hover), useSmileyLoop (balanço dos smileys), useContactFaces (beijo do Beijinho e risada do Sorrizinho), useServiceCardsHover (hover dos cards de serviço), useTagMarquee (faixa de tags em loop), useScrollDraw (fita que se desenha com a rolagem), useArrowDraw (seta que se desenha ao entrar na tela e balança no hover)
hooks/               useSmoothScroll, useLateScriptFont (Handelson depois do load)
lib/                 metadata, validations (zod), escape-html, utils (cn), idle (requestIdleCallback com alternativa)
styles/              tokens.css (fonte da verdade do design), base.css, hero-intro.css (entrada do Hero)
types/               tipos compartilhados
public/images/       about/, services/, projects/ e a logo branca do rodapé (logo-footer)
public/fonts/        fontes locais (Satoshi e Handelson One)
docs/                identidade visual e mockup (fora do build Docker)
```

## Estilização

- **Tokens** ficam em `styles/tokens.css` e o `tailwind.config.ts` apenas os mapeia para utilitários:
  - cores: `bg-brand-pink`, `text-brand-wine`, `bg-brand-cream`, etc.;
  - fontes: `font-serif` (Noto Serif, texto), `font-sans` (Satoshi, títulos/UI) e `font-script` (Handelson One, destaques);
  - medidas e efeitos: `h-header`, `rounded-{sm,md,lg}`, `shadow-card`, `shadow-card-hover`, `shadow-cta`.
- Os componentes já têm markup semântico e classes mínimas de layout. A estilização visual é a próxima etapa.
- Classes condicionais precisam ser **strings completas** (ex.: mapa `cardColors` em `Services.tsx`). Não use interpolação do tipo `` `bg-brand-${cor}` ``, porque o Tailwind não detecta essas classes.
- As entradas no scroll usam `data-reveal="<preset>"` nos elementos e `data-reveal-group` no bloco que dispara. Não precisa de hook no componente: `ScrollReveals` (montado em `app/page.tsx`) cuida de tudo. Presets e regras estão em `docs/SCROLL-ANIMATIONS.md`.
- A entrada do Hero usa `data-intro`, o CSS de `styles/hero-intro.css` e o script inline de `animations/heroBoot.ts`, que começa sem esperar o JS da página. Tempos, funcionamento e ideias adiadas estão em `docs/HERO-ANIMATIONS.md`.

### Fonte Handelson One

A Handelson One é comercial e não está no Google Fonts: o arquivo fica em `public/fonts/handelson-one-maisfontes.086c/` (WOFF2 com o subset latin do Google Fonts, gerado do .otf original; um caractere fora do latin cai na fonte reserva) e é carregado com `next/font/local` em `app/layout.tsx`, como a Satoshi. Como só aparece abaixo da dobra, não tem preload e só entra depois do load da página (`hooks/useLateScriptFont.ts`). Até lá vale o fallback que o next/font ajusta às medidas dela, e sem JS ela entra direto.

## Pendências de conteúdo

Procure por `TODO` no código:

- Logo oficial em SVG.
- Links reais de Instagram e LinkedIn.
- Depoimentos reais.
- `og-image.jpg`.
- Páginas `/privacidade` e `/termos`.

## Docker

```bash
docker compose up --build
```

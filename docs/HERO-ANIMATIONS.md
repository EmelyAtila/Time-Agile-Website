# Hero — animação de entrada

Como a entrada do Hero funciona, onde ajustar e o que ficou para depois.

## Onde está cada coisa

| Arquivo | Papel |
| --- | --- |
| `animations/useHeroIntro.ts` | A timeline do GSAP. Tempos, eases e ordem ficam todos aqui. |
| `components/sections/hero/heroPaths.ts` | Curvas das fitas, tamanho e posição do título (desktop e mobile). |
| `components/sections/hero/HeroRibbons.tsx` | SVG inline das fitas com o título em `<textPath>`. |
| `components/sections/hero/HeroIntro.tsx` | `<section>` client que liga os dois hooks. O resto do Hero é server. |
| `components/sections/hero/useFluidArt.ts` | Ajusta as curvas do desktop à proporção da tela, sem recorte. |
| `components/layout/Logo.tsx` | Logo oficial inline, dividida em `data-part` (`time`, `agile`, `bars`, `dot`, `tagline`). |
| `styles/base.css` | CSS que esconde `[data-intro]` até o GSAP assumir, e o failsafe de 4s. |

## Linha do tempo

Tempos em segundos a partir do início. Dura cerca de 2,4s e não bloqueia scroll nem clique.

| Início | Elemento | Movimento | Ease |
| --- | --- | --- | --- |
| 0.00 | Fita laranja | desenrola da borda esquerda (1.4s) | `power2.out` |
| 0.20 | Título | desliza pela fita laranja, passa um pouco do ponto e volta (1.6s) | `back.out(1.1)` |
| 0.25 | Fita pink | entra pelo topo (1.2s) | `power2.out` |
| 0.40 | Fita amarela | entra pela direita (1.3s) | `power2.out` |
| 0.55 | Fita rosa-claro | entra pela direita (1.2s) | `power2.out` |
| 0.95 | "Time" | letras sobem com leve giro | `back.out(1.7)` |
| 1.10 | "agile" | letras brotam da base | `back.out(2.2)` |
| 1.10 | Navegação | itens descem em sequência | `back.out(1.8)` |
| 1.25 | Barras do "i" | crescem de baixo, uma cor por vez | `back.out(3)` |
| 1.35 | CTA / botão de menu | pop | `back.out(2.4)` |
| 1.45 | Ponto vermelho | cai e quica | `bounce.out` |
| 1.50 | Barra da navegação | brota da base, sob "Início" | `back.out(3)` |
| 1.45 | Pill das redes | pop elástico, ícones em seguida | `elastic.out(1, 0.55)` |
| 1.70 | Tagline | desliza da esquerda | `power2.out` |

Para mexer:

- **Ordem e duração das fitas:** constante `RIBBONS`.
- **Distância entre a fita e o texto:** `TITLE_DELAY`. O título precisa ficar sempre atrás da ponta da laranja; se trocar o ease de um, confira o outro (texto na frente da fita aparece solto sobre o fundo).
- **Bloco da logo inteiro:** label `'logo'` (0.95).

## Como funciona

- **Fitas:** cada `<path>` tem `pathLength={1}` e a animação leva `stroke-dashoffset` de 1 a 0. Sem plugin.
- **Título:** texto real em `<textPath>`, animando o atributo `startOffset` de um valor negativo (texto todo antes do path, portanto invisível) até a posição final. O `<h1>` acessível é o `sr-only` em `Hero.tsx`; o SVG é `aria-hidden`.
- **Estado inicial:** o HTML do servidor já sai no estado final. O CSS esconde `[data-intro]` só com JS ligado e sem "reduzir movimento". Quando o hook assume, marca `<html data-intro-ready>` e o CSS para de valer.
- **Sem JS ou com `prefers-reduced-motion`:** nada é escondido e nada anima; o Hero aparece pronto.
- **Responsivo:** duas artes no HTML, o CSS mostra uma (`lg`, 1024px). `gsap.matchMedia()` usa o mesmo corte.
- **Proporção da tela (desktop):** o mockup é 1480×871, mas uma janela de navegador costuma ser bem mais larga (perto de 2:1). Em vez de ampliar o desenho e cortar em cima e embaixo, `useFluidArt` estica só a coordenada x das curvas até a proporção da seção. Assim os laços da fita amarela (topo) e da rosa-claro (base) aparecem inteiros em qualquer largura. Espessura das fitas e tamanho do título crescem por igual (√ do fator), então nada deforma. O intervalo aceito é o `stretch` de `HERO_ART_DESKTOP` (0.78 a 1.55, de 4:3 até ~2.6:1), e a altura mínima do Hero em `Hero.tsx` segura a seção dentro desse intervalo. Sem JS vale o recorte antigo (`preserveAspectRatio`).

Para marcar algo novo para a entrada: `data-intro="nome"` no elemento e um tween no hook. Não aninhe `data-intro`, e não anime direto um elemento que tenha `transition-*` do Tailwind (use um wrapper, como o do CTA no Header).

## Barra da navegação

Uma barra laranja só, que anda pelo menu conforme a seção em que a página está (`animations/useNavScrollSpy.ts`, ligado em `Header.tsx`).

- Fica parada sob o item da seção atual. Quando o topo da próxima seção entra na faixa de aproximação, a barra desliza até o item dela **no mesmo ritmo do scroll**, esticando no meio do caminho. Rolar para cima faz o caminho inverso.
- `ACTIVE_LINE` (0.4): a seção vira a ativa quando o topo dela cruza 40% da altura da janela.
- `SLIDE_ZONE` (0.35): tamanho da faixa de aproximação, antes dessa linha, em que a barra desliza.
- `STRETCH` (0.8): quanto a barra estica no meio do deslize; 0 desliga.
- O link ativo recebe `aria-current="location"`, também no menu mobile.
- Com "reduzir movimento" a barra troca de item de uma vez. Sem JS ela não aparece.
- Seções fora do menu (Depoimentos, a faixa de tags) não têm item: a barra continua no item anterior enquanto a página passa por elas.

### Com o mouse

- Passando o mouse pelo menu, a barra desliza até o item apontado, esticando no caminho como na rolagem, e volta para a seção atual quando o mouse sai do menu. No vão entre dois itens ela espera no último.
- `POINTER_SLIDE` (0.45): duração desse deslize. O pequeno excesso na chegada vem do ease `back.out(1.2)` em `pointAt`.
- Rolar com a roda devolve a barra à rolagem, mesmo com o mouse parado sobre um item. O hover volta a valer quando o mouse entra em outro item.
- Clicar num item prende a barra nele até a página chegar à seção (`pinned`). Sem isso, no topo da página, o header sobe ao rolar, o item sai de baixo do mouse e a barra voltaria até a seção atual para depois refazer o caminho.
- Toque não tem hover: no tablet a barra só segue a rolagem.
- O teclado não move a barra: quem navega por Tab tem o anel de foco, e a barra continua indicando a seção em que a página está.

### Pulo dos links

- Quando a barra entra por baixo de um link, as letras dele pulam em onda, no sentido em que a barra vem. Vale para a rolagem e para o mouse: indo de "Início" a "Contato" com o mouse, os links do caminho pulam um atrás do outro.
- Só a entrada conta. A barra sair de baixo de um link, ou o mouse entrar no link em que a barra já está, não dispara nada.
- `HOP_HEIGHT` (30): altura do pulo, em % da altura da linha (uns 9px no desktop). `HOP_STAGGER` (0.03): atraso entre uma letra e a seguinte. Subida, queda (`bounce.out`) e inclinação das letras ficam na função `hop`.
- Para as letras pularem separadas, cada uma é um `<span data-nav-letter>` em `Header.tsx`. O nome que o leitor de tela lê vem do `aria-label` do link; as letras são `aria-hidden`.
- Redimensionar a janela muda a barra de lugar sem ela ter passado por nenhum link, então não conta (`relayout`).
- Com "reduzir movimento" não há pulo.

Para isso o Header passou a ser **fixo**. No topo ele fica solto sobre o Hero, na posição do mockup; depois de `SCROLLED_AFTER` (24px) de rolagem vira uma faixa creme translúcida, para o menu continuar legível sobre as outras seções.

A posição da barra (`x`, `scaleX`) é do scroll-spy; a entrada do Hero só anima `scaleY` e opacidade dela. Não inclua a barra no `clearProps` do fim da timeline.

## Armadilhas já resolvidas

- **`autoRound: false` nas fitas.** O GSAP arredonda valores em `px` para inteiro. Com o comprimento normalizado para 1, a fita só assumia 0 ou 1 e aparecia inteira de uma vez.
- **Guia do título separado da fita.** O `<textPath>` aponta para uma cópia do path em `<defs>` sem `pathLength`, que interferiria no `startOffset`.
- **`stroke-dasharray: 1 2` e offset inicial 1.001.** Evita o pontinho que a ponta arredondada deixaria antes de a fita começar.
- **Laços das fitas cortados em tela larga.** Com `slice` puro, uma janela 2.2:1 perdia ~100 unidades em cima e embaixo, justamente onde ficam os nós da amarela e da rosa-claro. Resolvido com o `useFluidArt`. Ao testar, use o tamanho da área útil do navegador (ex.: 1534×696 num monitor 1080p com escala de 125%), não a resolução da tela.
- **`useFluidArt` só entende paths com `M` e `C` absolutos** (o que o Figma exporta para essas curvas). Um path com outros comandos é deixado como está.
- **`--hero-padding-x` usado como `px-[var(--hero-padding-x)]`.** Uma chave nova em `spacing` no `tailwind.config.ts` não foi captada pelo dev server que já estava rodando; a variável CSS direta não depende do config.

## Mobile

Não existe mockup mobile; a arte em `HERO_ART_MOBILE` é uma adaptação das curvas do desktop num viewBox vertical (390×870). Título e fitas principais ficam nos ~520 de cima, que é o que sobra visível num tablet em pé. Se desenhar uma versão no Figma, é só trocar os `d` e ajustar `startOffset`/`fontSize`.

Um path que anda da direita para a esquerda deixa o texto de cabeça para baixo: a fita do título precisa sempre avançar para a direita.

## Para depois

Nada aqui foi descartado; ficou fora do escopo da entrada.

### Efeitos contínuos

- [ ] **Loops sutis:** ponto da logo quicando de vez em quando, pill das redes flutuando, "!" do título balançando.
- [ ] **Parallax com o mouse:** fitas em camadas seguindo o cursor (`gsap.quickTo`), só desktop.
- [ ] **Saída no scroll:** fitas se recolhendo ou em parallax ao rolar para "Sobre" (`ScrollTrigger` com scrub, já integrado ao Lenis).

### Variações da entrada

- [ ] Letras do título pulando uma a uma em vez de deslizar em bloco (`SplitText`, ou cada letra posicionada com `MotionPathPlugin`; ambos já vêm no pacote do GSAP).
- [ ] Tocar a entrada só uma vez por sessão (`sessionStorage`)?
- [ ] Reaproveitar o desenho das fitas nas outras seções, disparado por scroll.

### Pendências que apareceram no caminho

- [x] **Botão flutuante do WhatsApp por cima da pill das redes.** Resolvido: o flutuante só aparece enquanto está sobre a seção Contato (`components/layout/WhatsAppButton.tsx`, prop `section`, definida em `app/page.tsx`). No Hero, nas outras seções e no rodapé ele fica escondido e fora do Tab.
- [ ] `public/logos/logo-instagram.svg` e `loho-whatsapp.svg` (nome com erro de digitação) viraram componentes em `components/decor/` e não são mais carregados pelo site. Remover de `public/` ou mover para `docs/`.
- [ ] Sombra do título (`drop-shadow`) é recalculada a cada quadro enquanto o texto se move. Se pesar em celular fraco, aplicar só no fim.
- [ ] Conferir em Safari e Firefox reais: a verificação foi feita só no Chrome.

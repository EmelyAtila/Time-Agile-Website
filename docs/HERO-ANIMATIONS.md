# Hero — animação de entrada

Como a entrada do Hero funciona, onde ajustar e o que ficou para depois.

## Onde está cada coisa

| Arquivo | Papel |
| --- | --- |
| `styles/hero-intro.css` | A entrada em si: `@keyframes`, tempos e eases (os do GSAP, amostrados em `linear()`). |
| `animations/heroBoot.ts` | Script inline, que roda durante o parse do HTML: estica as curvas, espera a fonte do título (até 400ms), faz o título deslizar com um `<animate>` de SVG e marca o `<html>` para o CSS começar. Também tem o esticão das curvas (`stretchHeroArt`). |
| `animations/useHeroIntro.ts` | Lado do React: liga os loops quando a entrada termina. |
| `animations/heroLoops.ts` | O que começa quando a entrada termina: o loop do "!" do título e o botão do header. |
| `animations/headerCta.ts` | Botão do header: pulinho em loop, hover e clique. |
| `components/sections/hero/heroPaths.ts` | Curvas das fitas, tamanho e posição do título (desktop e mobile). |
| `components/sections/hero/HeroRibbons.tsx` | SVG inline das fitas com o título em `<textPath>`. |
| `components/sections/hero/HeroIntro.tsx` | `<section>` client que liga os dois hooks. O resto do Hero é server. |
| `components/sections/hero/useFluidArt.ts` | Refaz o esticão das curvas a cada resize. |
| `components/sections/Hero.tsx` | Coloca o script de `heroBoot.ts` no fim da `<section>`. |
| `components/layout/Logo.tsx` | Logo oficial inline, dividida em `data-part` (`time`, `agile`, `bars`, `dot`, `tagline`). |
| `styles/base.css` | CSS que esconde `[data-intro]` até o script começar, e o failsafe de 4s (uma animação só, no `<html>`). |

## Linha do tempo

Tempos em segundos a partir de `data-intro-play`. Dura cerca de 2,4s e não bloqueia scroll nem clique.

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

- **Fitas, logo, header e redes:** `animation-delay` e `animation-duration` em `styles/hero-intro.css`. Os staggers usam `--i` (posição entre os irmãos).
- **Título:** `titleDelay` e `titleDuration` no `CONFIG` de `heroBoot.ts`. O título precisa ficar sempre atrás da ponta da laranja; se trocar o ease de um, confira o outro (texto na frente da fita aparece solto sobre o fundo).
- **Fim da entrada:** `introMs` no `CONFIG` (2350ms, o fim das redes). Se alongar a coreografia, aumente junto: é ele que desliga o CSS e solta os loops.

## Como funciona

- **Sem esperar o JS da página:** o script inline de `heroBoot.ts` roda assim que o navegador lê o fim do Hero, antes de o React baixar e hidratar. Ele marca `<html data-intro-boot>` na hora e, quando a fonte do título chega (ou em 400ms), `data-intro-play`. Aí o CSS começa. Em `introMs`, ele marca `data-intro-done` e o CSS da entrada para de valer.
- **Fitas:** cada `<path>` tem `pathLength={1}` e o `@keyframes` leva `stroke-dashoffset` de 1.001 a 0.
- **Título:** texto real em `<textPath>`. O script mede o título e dá ao `<animate>` os valores do `startOffset`, de um valor negativo (texto todo antes do path, portanto invisível) até a posição final, em 30 passos do `back.out(1.1)`. O `<h1>` acessível é o `sr-only` em `Hero.tsx`; o SVG é `aria-hidden`.
- **Estado inicial:** o HTML do servidor já sai no estado final. O CSS esconde `[data-intro]` só com JS ligado e sem "reduzir movimento", até `data-intro-play`.
- **`animation-fill-mode: backwards`:** segura o começo durante o atraso e, no fim, não deixa nada aplicado. Assim o GSAP dos loops e os hovers assumem sem briga.
- **`translate`/`rotate`/`scale` individuais, não `transform`.** Atenção: quando o GSAP anima um elemento, ele absorve essas propriedades no transform dele. Por isso a entrada da barra do menu anima um `<span>` de dentro, e não a barra que o scroll spy move.
- **Hidratação:** o script muda atributos antes de o React hidratar (`d`, `viewBox`, `values` do `<animate>`, `data-*` no `<html>`), por isso o SVG do Hero e o `<html>` têm `suppressHydrationWarning`. O script não cria nem remove nós: isso quebraria a hidratação.
- **Sem JS ou com `prefers-reduced-motion`:** nada é escondido e nada anima; o Hero aparece pronto.
- **Navegação pelo cliente** (vindo de outra página do site) não roda o script inline: o hook vê que falta `data-intro-boot` e mostra o Hero pronto.
- **Responsivo:** duas artes no HTML, o CSS mostra uma (`lg`, 1024px). O script e o `gsap.matchMedia()` usam o mesmo corte. Cruzar o `lg` depois da entrada não repete nada (`data-intro-done` desliga o CSS).
- **Proporção da tela (desktop):** o mockup é 1480×871, mas uma janela de navegador costuma ser bem mais larga (perto de 2:1). Em vez de ampliar o desenho e cortar em cima e embaixo, `stretchHeroArt` estica só a coordenada x das curvas até a proporção da seção. A primeira vez é no script inline, antes de aparecer qualquer coisa; depois, `useFluidArt` refaz a cada resize. Assim os laços da fita amarela (topo) e da rosa-claro (base) aparecem inteiros em qualquer largura. Espessura das fitas e tamanho do título crescem por igual (√ do fator), então nada deforma. O intervalo aceito é o `stretch` de `HERO_ART_DESKTOP` (0.78 a 1.55, de 4:3 até ~2.6:1), e a altura mínima do Hero em `Hero.tsx` segura a seção dentro desse intervalo. Sem JS vale o recorte antigo (`preserveAspectRatio`).

Para marcar algo novo para a entrada: `data-intro="nome"` no elemento e uma regra em `styles/hero-intro.css`, dentro do `html[data-intro-play]:not([data-intro-done])`. Não aninhe `data-intro`, e não anime direto um elemento que tenha `transition-*` do Tailwind (use um wrapper, como o do CTA no Header).

## Loops

Começam quando a entrada termina (`<html data-intro-done>`, que `useHeroIntro` espera com um `MutationObserver`), em `animations/heroLoops.ts`.

- **"!" do título:** balança apoiado na base, três idas e voltas que vão diminuindo, e descansa `MARK_EVERY` (2.6s) até o próximo. Só roda com o Hero na tela; rolou para fora, pausa.
- O "!" é um `<tspan data-hero-mark>` dentro do título (prop `mark` de `HeroRibbons`). Quem balança é o atributo `rotate` do `<tspan>`, que gira o glifo: `transform` de CSS não funciona em `<tspan>`.
- Cada balanço redesenha o título inteiro com a sombra, por cerca de 1,2s. Se pesar em celular fraco, aumente `MARK_EVERY` antes de mexer na sombra.
- Com "reduzir movimento" não há loop. Trocar de arte (cruzar `lg`) desfaz os loops de uma e religa na outra.

## Botão do header

Tudo em `animations/headerCta.ts`, ligado junto com os loops.

- **Parado:** a cada `CTA_EVERY` (4.5s) dá um pulinho de gelatina (achata e volta com elástico) enquanto a seta dá um bote para a frente. Roda na página inteira, porque o header acompanha a rolagem.
- **Mouse entra:** acontece tudo de uma vez, em menos de 1s. Os valores são contidos de propósito, para o botão acompanhar o resto do site sem roubar a cena; todos são constantes no topo do arquivo.
  - O botão dá um tranco leve (achata e inclina `CTA_KICK`, 1.5°, para o lado de onde o mouse veio) e assenta maior (`CTA_HOVERED`, 1.04).
  - Três cores se espalham em círculo a partir do ponto de entrada: amarelo, rosa-claro e por fim o laranja, que fica.
  - As letras sobem em onda (uns 6px), começando pela mais próxima do ponteiro.
  - Saltam alguns pedacinhos de confete nas cores da marca (`CONFETTI_PIECES`, 6; 0 desliga). `CONFETTI_COOLDOWN` (1.5s) impede chuva de confete ao entrar e sair rápido.
  - A seta fica indo e voltando devagar, apontando, enquanto o mouse estiver em cima.
- **Mouse sai:** as cores se recolhem para o ponto de saída (o laranja primeiro) e botão e seta voltam ao lugar com elástico.
- **Clique:** ao pressionar ele afunda (`CTA_PRESSED`, 0.92); ao soltar volta com elástico, e a seta dispara para a direita, some e reentra pela esquerda. Pressionar e arrastar para fora só desfaz o afundado. Pelo teclado (Enter) acontece o mesmo, sem a fase de segurar.
- Com o mouse em cima ou durante o clique o pulinho pausa, e só volta depois de um descanso inteiro.
- As cores são três `<span>` dentro do botão (`data-cta-ripple` e `data-cta-fill`, em `Header.tsx`), recortados com `clip-path: circle()`. Sem o GSAP as ondas não aparecem e o laranja é só um fade por CSS (`group-hover`): é o que vale antes de a entrada terminar e com "reduzir movimento".
- As letras são `<span data-cta-letter>`; o nome que o leitor de tela lê vem do `aria-label` do botão.
- O confete é criado na hora, direto no `body` com `position: fixed`, e removido quando termina: assim não herda o tranco do botão.
- Quem anima é o wrapper `data-intro="cta"`, a seta, as letras e os `<span>` das cores, nunca o `Button`, que tem transição de `transform`.
- O disparo da seta não é interrompido quando o mouse sai. No topo da página o header sobe ao rolar e tira o botão de baixo do mouse logo depois do clique; se a saída cortasse o disparo, ele quase nunca apareceria.
- Toque não tem hover: no tablet valem o pulinho e o clique.

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

Para isso o Header acompanha a página inteira. No topo ele fica solto sobre o Hero, na posição do mockup; rolando, sobe junto com a página até encostar no topo da janela e ganha uma faixa creme translúcida, para o menu continuar legível sobre as outras seções.

- **Encaixe:** é `position: sticky`, sem JavaScript. O `padding-top` do header guarda a folga do mockup (`--header-offset`, até 30px, só a partir de `lg`) e o `top` negativo deixa essa folga rolar para fora antes de grudar. Assim o header anda colado na página, na ida e na volta, em qualquer aparelho. A margem inferior negativa faz o conteúdo começar por baixo dele.
- **Faixa de fundo:** a opacidade vem de `--header-solid` (0 no topo, 1 depois de `SOLID_AFTER`, 96px), escrita por `animations/useHeaderDock.ts` no ritmo do scroll. O desfoque fica no mesmo elemento e aparece junto.
- **Sem animação por tempo.** A versão anterior trocava de estado aos 24px com uma transição de 300ms: na volta ao topo o header descia 30px sozinho enquanto a página ainda rolava, e o desfoque sumia de uma vez. Não volte a usar `transition` nesse encaixe.
- O `sticky` depende de nenhum ancestral do header ter `overflow` diferente de `visible`. Se o menu parar de acompanhar a página, procure um `overflow-hidden` novo em `body` ou num wrapper.

A posição da barra (`x`, `scaleX`) é do scroll spy; a entrada do Hero anima só o `<span>` de dentro dela (`scale` em y e opacidade). Se o scroll spy só posicionar a barra depois de 1,9s, ela aparece sem a entrada.

## Armadilhas já resolvidas

- **Título em repouso no primeiro quadro.** O `<animate>` só vale a partir do quadro seguinte ao `beginElement()`; o `<text>` fica com opacidade 0 durante o atraso do título (`intro-hold`).
- **Guia do título separado da fita.** O `<textPath>` aponta para uma cópia do path em `<defs>` sem `pathLength`, que interferiria no `startOffset`.
- **`stroke-dasharray: 1 2` e offset inicial 1.001.** Evita o pontinho que a ponta arredondada deixaria antes de a fita começar.
- **Laços das fitas cortados em tela larga.** Com `slice` puro, uma janela 2.2:1 perdia ~100 unidades em cima e embaixo, justamente onde ficam os nós da amarela e da rosa-claro. Resolvido com o `stretchHeroArt`. Ao testar, use o tamanho da área útil do navegador (ex.: 1534×696 num monitor 1080p com escala de 125%), não a resolução da tela.
- **`stretchHeroArt` só entende paths com `M` e `C` absolutos** (o que o Figma exporta para essas curvas). Um path com outros comandos é deixado como está.
- **`--hero-padding-x` usado como `px-[var(--hero-padding-x)]`.** Uma chave nova em `spacing` no `tailwind.config.ts` não foi captada pelo dev server que já estava rodando; a variável CSS direta não depende do config.

## Mobile

Não existe mockup mobile; a arte em `HERO_ART_MOBILE` é uma adaptação das curvas do desktop num viewBox vertical (390×870). Título e fitas principais ficam nos ~520 de cima, que é o que sobra visível num tablet em pé. Se desenhar uma versão no Figma, é só trocar os `d` e ajustar `startOffset`/`fontSize`.

Um path que anda da direita para a esquerda deixa o texto de cabeça para baixo: a fita do título precisa sempre avançar para a direita.

## Para depois

Nada aqui foi descartado; ficou fora do escopo da entrada.

### Efeitos contínuos

- [x] **Loops sutis, primeira parte:** "!" do título balançando e botão do header com pulinho (ver "Loops" e "Botão do header").
- [ ] **Loops sutis, o que falta:** ponto da logo quicando de vez em quando e pill das redes flutuando. Entram em `animations/heroLoops.ts`.
- [ ] **Parallax com o mouse:** fitas em camadas seguindo o cursor (`gsap.quickTo`), só desktop.
- [ ] **Saída no scroll:** fitas se recolhendo ou em parallax ao rolar para "Sobre" (`ScrollTrigger` com scrub, já integrado ao Lenis).

### Variações da entrada

- [ ] Letras do título pulando uma a uma em vez de deslizar em bloco (`SplitText`, ou cada letra posicionada com `MotionPathPlugin`; ambos já vêm no pacote do GSAP).
- [ ] Tocar a entrada só uma vez por sessão (`sessionStorage`)?
- [ ] Reaproveitar o desenho das fitas nas outras seções, disparado por scroll.

### Pendências que apareceram no caminho

- [x] **Botão flutuante do WhatsApp por cima da pill das redes.** Resolvido: o flutuante só aparece enquanto está sobre a seção Contato (`components/layout/WhatsAppButton.tsx`, prop `section`, definida em `app/page.tsx`). No Hero, nas outras seções e no rodapé ele fica escondido e fora do Tab.
- [x] **Arquivos de `public/logos/` sem uso.** Resolvido: viraram componentes em `components/decor/` e a pasta foi removida junto com as outras imagens sem uso.
- [ ] Sombra do título (`drop-shadow`) é recalculada a cada quadro enquanto o texto se move. Se pesar em celular fraco, aplicar só no fim.
- [ ] Conferir em Safari e Firefox reais: a verificação foi feita só no Chrome.

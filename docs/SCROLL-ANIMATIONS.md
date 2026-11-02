# Entradas no scroll

As entradas são **presas à rolagem**. Cada bloco começa a entrar quando o topo dele chega a 80% da tela e termina quando ele está inteiro na tela; se for mais alto que a tela, termina com o topo a 20%. Entre o começo e o fim há sempre pelo menos 35% da altura da tela de rolagem.

- Rolando devagar, a entrada vai devagar. Parando, ela para junto.
- Ela persegue a rolagem com 0,5s de atraso, para não andar aos trancos.
- Só avança, nunca volta. Depois de terminar, fica pronta para sempre.
- O que já estava entrando quando os grupos foram montados toca inteiro no seu tempo, como `data-reveal-mode="play"`, em vez de ficar parado pela metade. O que já tinha passado aparece pronto.

**Recarregar no meio da página:** a posição é restaurada pelo site, não pelo navegador (`animations/scrollRestoreBoot.ts`). No `pagehide` ela é guardada em `sessionStorage` como seção + deslocamento dentro dela; ao recarregar, um script no fim do `<body>` rola para lá antes do React. Assim as entradas, o pre-loader e o intro do Hero já sabem onde a página está quando decidem o que fazer. A navegação nova (link, aba nova) e a URL com `#âncora` não são restauradas.

O que está na tela depois de rolar aparece pronto na hora, sem entrada. Sem isso, o CSS anti-flash deixaria a tela vazia até o JS hidratar e montar os grupos (no celular, mais de 1s, e é isso que o LCP mede). O script marca os blocos de primeiro nível do `<main>` (e o rodapé) que cruzam a tela, põe no `<head>` um `<style>` que os mostra e guarda o mesmo seletor em `<html data-restore-shown>`. `useScrollReveals` trata essas entradas como já tocadas e tira o `<style>` quando elas são marcadas como montadas. Os blocos abaixo da tela continuam com as entradas.

As entradas animam só `transform`, `opacity` e `clip-path`. O conteúdo já vem pronto do servidor, então o SEO e o leitor de tela não mudam. Sem JavaScript, tudo aparece pronto. Com `prefers-reduced-motion: reduce`, todo elemento usa o preset `fade` e toca inteiro quando o bloco começa a entrar, como `data-reveal-mode="play"`, sem deslocamento nem giro.

- `animations/reveals.ts`: os presets (o que cada entrada faz) e `LEAD` (intervalo até o próximo elemento, no tempo da timeline).
- `animations/useScrollReveals.ts`: acha os grupos, liga a timeline de cada um à rolagem (`START_AT`, `TALL_END_AT`, `MIN_RANGE`, `LAG`) e, no fim, devolve tudo ao CSS.
- `components/providers/ScrollReveals.tsx`: liga o hook. Está montado em `app/page.tsx`.
- `styles/base.css`: esconde cada `[data-reveal]` até o grupo dele ser montado (`data-reveal-built`). O failsafe é uma animação só, no `<html>`, que mostra tudo em 4s se o JS falhar.
- Os grupos são montados aos poucos, em fatias de até 8ms nos intervalos livres do navegador (`requestIdleCallback`), do mais perto da tela para o mais longe. Assim a montagem não vira uma tarefa longa nem engasga a entrada do Hero. As medidas só leem o layout (`offsetTop`), sem escrever nada antes, e as marcas `data-reveal-built` vão em lote no fim de cada fatia, para não invalidar o estilo entre um grupo e outro.
- Antes de criar as animações de um grupo, o transform de todos os alvos (palavras do SplitText, pílulas, elementos) é lido de uma vez (`prime` em `animations/reveals.ts`). O GSAP lê alvo a alvo e escreve `translate`/`rotate`/`scale: none` no meio da leitura; intercalado com as outras animações, isso forçava um layout por palavra.
- O que está escondido na largura atual (`display: none`, como `hidden lg:block`) fica de fora: sem caixa, o GSAP mediria o desenho por um clone. Se aparecer depois sem cruzar o lg (girar o celular), vem pronto com o `data-reveal-ready`.

## Como marcar um elemento

| Atributo | Onde | O que faz |
| --- | --- | --- |
| `data-reveal="<preset>"` | no elemento | anima com aquele preset |
| `data-reveal-group` | no bloco que conduz a entrada | os `[data-reveal]` de dentro entram juntos, na ordem do DOM, conforme o bloco entra na tela |
| `data-reveal-group="lg"` | idem | grupo só a partir do lg; abaixo dele, cada elemento dispara sozinho (blocos altos no celular) |
| `data-reveal-at="<posição>"` | no elemento | posição do GSAP na timeline do grupo (`"0"`, `"0.55"`, `"<"`, `">-0.35"`); sem ele, entra `LEAD` segundos depois do anterior |
| `data-reveal-from="center"` | com `wipe` | abre do meio em vez da esquerda |
| `data-reveal-mode="play"` | no grupo (ou no elemento sozinho) | em vez de seguir a rolagem, a entrada toca inteira no seu tempo assim que o bloco começa a entrar; para o que não pode ficar pela metade se a rolagem parar (smileys, faixa rosa, título do Contato) ou que já se mexe sozinho (depoimentos) |

Regras:
- Sem grupo, o elemento dispara sozinho.
- Quem está dentro de outro `[data-reveal]` entra sempre no grupo dele, como o "Crescer!" no título do Sobre e os campos no formulário.
- Grupo sem altura, com filhos todos absolutos (como os projetos no desktop), acompanha a posição do primeiro elemento.
- Perto do fim da página, o fim da entrada nunca passa do limite da rolagem: o rodapé também termina.
- Recarregar no meio da página deixa prontas as seções que já ficaram para trás. A seção que está na tela pula para o ponto da rolagem.
- Cruzar o lg reconstrói as entradas, mas o que já terminou não toca de novo.

**Não animar elementos que outro hook já move**: `article` dos cards (hover), `<g data-face>` (rostos), o `<g>` do `useSmileyLoop`, paths das fitas e da seta. Em quem já tem `transform` do Tailwind, use um `<g data-pop>` por dentro (Smiley), `clip-path`, ou anime o pai.

## Presets

| Preset | Efeito |
| --- | --- |
| `heading` | palavras sobem de dentro de uma máscara, com um leve giro (SplitText) |
| `text` | palavras fluem de baixo, com fade (SplitText; mantém o `whitespace-pre-line`) |
| `stamp` | carimbo: cai grande e girado, bate e treme (precisa de `inline-block`) |
| `blob` | gelatina a partir do centro |
| `sticker` | adesivo colado: vem de cima, maior e girado, e assenta; alterna o lado |
| `handwrite` | escrita à mão: `clip-path` abrindo da esquerda para a direita |
| `pop` | cresce de 0 girando (em `[data-pop]` se houver) |
| `rise` | sobe com fade |
| `lift` | bloco grande que sobe com quique |
| `slide` | entra pela direita |
| `fade` | só opacidade |
| `wipe` | `clip-path` abrindo na horizontal |
| `card` | cartas dadas: no desktop, cada card sai do meio do leque e voa até o lugar, e o rosto do fundo se mexe ao assentar; abaixo do lg, sobe girando |
| `polaroid` | foto jogada na mesa: cai girada e assenta |
| `bubbles` | as `li` de dentro estouram como bolhas |
| `card-up` | card sobe girando um pouco |

No celular e no tablet, os presets com distância ou giro usam valores menores.

O SplitText divide em palavras, não em linhas, então um resize não quebra a divisão. Não precisa esperar as fontes, porque não mede nada. Faz `revert()` quando o grupo termina.

- Usa `aria: 'none'`: as palavras divididas continuam sendo texto para o leitor de tela. O `'auto'` punha `aria-label` nos `<p>`, onde ele é proibido (o Lighthouse reprova) e ignorado, e escondia as palavras com `aria-hidden`. Enquanto o parágrafo estava dividido, o leitor de tela não lia nada.
- A Handelson entra só depois do load (`hooks/useLateScriptFont.ts`). Quando ela chega, um `ScrollTrigger.refresh()` recalcula onde cada entrada começa, porque a troca de fonte pode mudar a altura dos blocos.
- As fitas que se desenham com a rolagem (`animations/useScrollDraw.ts`) medem o trecho visível de cada path com uma amostra grossa e refinam só nas bordas. Elas só medem de novo quando o layout muda, então os refreshes sem resize saem de graça.
- Fitas, seta (`useArrowDraw`) e o balanço dos smileys (`useSmileyLoop`) ficam abaixo da dobra e são montados num intervalo livre depois da hidratação, não na tarefa dela. Os smileys escondidos na largura atual (`hidden lg:block`) não são montados; cruzar o md ou o lg confere de novo.

## Coreografia

| Seção | Entrada |
| --- | --- |
| Sobre | título palavra a palavra, "Crescer!" carimbado; parágrafos fluem; blobs em gelatina; fotos coladas; nomes escritos à mão; smiley com pop |
| Serviços | título e descrição; cartas dadas a partir do meio do leque; cada rosto reage ao assentar |
| Tags | pílulas estouram em sequência enquanto a faixa corre |
| Projetos | título e texto; blobs; Iranides colada; faixa rosa abrindo; títulos escritos à mão; polaroides caindo |
| Depoimentos | as duas linhas do título entram pela direita; cards sobem enquanto a faixa corre em loop |
| Contato | título e texto; formulário sobe e os campos em sequência; card amarelo colado sobre o canto (só do tablet para cima); smileys, Beijinho e Sorrizinho com pop |
| Rodapé | logo, texto, redes e colunas sobem; a linha da barra abre do meio |

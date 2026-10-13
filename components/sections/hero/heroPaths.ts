import type { BrandColor } from '@/types'

export type HeroRibbon = {
  color: BrandColor
  d: string
  strokeWidth: number
  opacity: number
}

export type HeroArt = {
  /** Sufixo dos ids do SVG — as duas variantes coexistem no DOM */
  id: 'desktop' | 'mobile'
  viewBox: string
  /** Qual lado do desenho é preservado quando a seção não tem a proporção do viewBox */
  preserveAspectRatio: string
  /**
   * [mín, máx] do quanto as curvas podem esticar na horizontal para acompanhar a
   * proporção da tela sem recorte (ver useFluidArt). Sem isso, vale só o recorte acima.
   */
  stretch?: [min: number, max: number]
  /** Ordem de empilhamento: a primeira fica por baixo */
  ribbons: HeroRibbon[]
  title: {
    /** Linha de centro da fita laranja — o título corre sobre ela */
    guide: string
    /** Onde o texto começa, em % do comprimento do guia */
    startOffset: string
    fontSize: number
  }
}

/* Curvas copiadas de docs/Desktop - 1.svg (trecho 1480×871 do Hero). */
const DESKTOP_ORANGE =
  'M-40 231.38C47.5 168.377 105.389 149.315 213.5 163.38C337.73 179.543 447 304 476 408.875C486.784 447.874 527.084 528.583 566 546.379C665.5 591.879 740.628 543.776 821 522.879C889.325 505.115 964.667 510.404 1028.5 538.379C1154 593.379 1249.15 752.687 1373.5 824.379C1396.24 837.486 1434.1 860.776 1458 871.379'

export const HERO_ART_DESKTOP: HeroArt = {
  id: 'desktop',
  viewBox: '0 0 1480 871',
  // xMin: em telas mais "quadradas" corta a direita, nunca o início do título
  preserveAspectRatio: 'xMinYMid slice',
  // Cobre de 4:3 até ~2.6:1, os mesmos limites da altura do Hero em Hero.tsx
  stretch: [0.78, 1.55],
  ribbons: [
    {
      color: 'pink-light',
      strokeWidth: 65,
      opacity: 0.96,
      d: 'M1524.5 518.499C1434 495.999 1419 577.5 1397.5 631.499C1364.07 715.466 1309 744.5 1256 778.499C1156.82 842.121 946.655 903.249 839 865.998C799.951 852.486 755.001 779.721 826.501 709.998C938.517 600.766 1025.57 726.637 1054.5 778.499C1076.96 818.758 1128.69 885.192 1169.57 904.152C1223.95 929.373 1354.26 957.78 1409.62 921.051',
    },
    {
      color: 'pink',
      strokeWidth: 80,
      opacity: 0.97,
      d: 'M436 -44C450 -17.5 460.897 -3.94089 470.073 18.8258C489.472 66.9546 522.581 109.249 556.668 147.818C699.265 309.168 911.577 172.351 1076.37 161.967C1149.03 157.389 1229.75 181.748 1287.5 227C1361.94 285.332 1422.06 399.185 1493 442C1558.5 492.5 1594.42 506.153 1601 515.5',
    },
    {
      color: 'yellow',
      strokeWidth: 62,
      opacity: 0.96,
      d: 'M1515.55 126.312C1488.35 105.96 1476.55 86.312 1444.55 59.2486C1411.69 31.4548 1336.05 21.8534 1294.55 33.312C1216.16 54.9567 1145.53 176.419 1098.55 237.312C1021.25 337.516 926.736 190.547 895.55 126.312C877.11 88.3304 861.36 18.4947 867.738 -23.3522C877.241 -85.7111 946.558 -119.545 1000.45 -102.688C1067.9 -81.5855 1030.48 6.65339 1000.45 41.8125C980.22 65.4906 947.05 101.252 915.05 115.312C760.74 183.114 641.655 210.586 608.05 300.312C570.439 400.733 651.647 422.358 635.987 515.394',
    },
    { color: 'orange', strokeWidth: 99, opacity: 0.96, d: DESKTOP_ORANGE },
  ],
  title: { guide: DESKTOP_ORANGE, startOffset: '7.7%', fontSize: 76.2 },
}

/*
 * Adaptação vertical das mesmas curvas (não existe mockup mobile).
 * O título e as fitas principais ficam nos ~520 de cima, que é o que sobra visível
 * num tablet em pé; o laço rosa-claro preenche o espaço extra dos celulares altos.
 */
const MOBILE_ORANGE =
  'M-30 165C30 120 95 110 150 150C215 197 190 300 235 360C275 413 340 400 420 470'

export const HERO_ART_MOBILE: HeroArt = {
  id: 'mobile',
  viewBox: '0 0 390 870',
  preserveAspectRatio: 'xMidYMin slice',
  ribbons: [
    {
      color: 'pink-light',
      strokeWidth: 33,
      opacity: 0.96,
      d: 'M420 540C375 528 350 565 335 600C312 652 250 668 240 625C232 590 280 572 305 605C330 638 360 690 420 700',
    },
    {
      color: 'pink',
      strokeWidth: 40,
      opacity: 0.97,
      d: 'M150 -30C160 30 215 75 285 70C340 66 380 95 420 150',
    },
    {
      color: 'yellow',
      strokeWidth: 31,
      opacity: 0.96,
      d: 'M420 235C372 222 318 240 300 285C285 322 282 350 262 385',
    },
    { color: 'orange', strokeWidth: 52, opacity: 0.96, d: MOBILE_ORANGE },
  ],
  title: { guide: MOBILE_ORANGE, startOffset: '9.5%', fontSize: 30.5 },
}

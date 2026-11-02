import type { BrandColor } from '@/types'

export type HeroRibbon = {
  color: BrandColor
  d: string
  strokeWidth: number
  opacity: number
}

export type HeroArt = {
  id: 'desktop' | 'mobile'
  viewBox: string
  preserveAspectRatio: string
  // [mín, máx] do esticão horizontal das curvas (useFluidArt)
  stretch?: [min: number, max: number]
  ribbons: HeroRibbon[]
  title: {
    guide: string
    startOffset: string
    fontSize: number
  }
}

// Curvas copiadas de docs/Desktop - 1.svg
const DESKTOP_ORANGE =
  'M-40 231.38C47.5 168.38 105.39 149.32 213.5 163.38C337.73 179.54 447 304 476 408.88C486.78 447.87 527.08 528.58 566 546.38C665.5 591.88 740.63 543.78 821 522.88C889.33 505.12 964.67 510.4 1028.5 538.38C1154 593.38 1249.15 752.69 1373.5 824.38C1396.24 837.49 1434.1 860.78 1458 871.38'

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
      d: 'M1524.5 518.5C1434 496 1419 577.5 1397.5 631.5C1364.07 715.47 1309 744.5 1256 778.5C1156.82 842.12 946.66 903.25 839 866C799.95 852.49 755 779.72 826.5 710C938.52 600.77 1025.57 726.64 1054.5 778.5C1076.96 818.76 1128.69 885.19 1169.57 904.15C1223.95 929.37 1354.26 957.78 1409.62 921.05',
    },
    {
      color: 'pink',
      strokeWidth: 80,
      opacity: 0.97,
      d: 'M436 -44C450 -17.5 460.9 -3.94 470.07 18.83C489.47 66.95 522.58 109.25 556.67 147.82C699.27 309.17 911.58 172.35 1076.37 161.97C1149.03 157.39 1229.75 181.75 1287.5 227C1361.94 285.33 1422.06 399.19 1493 442C1558.5 492.5 1594.42 506.15 1601 515.5',
    },
    {
      color: 'yellow',
      strokeWidth: 62,
      opacity: 0.96,
      d: 'M1515.55 126.31C1488.35 105.96 1476.55 86.31 1444.55 59.25C1411.69 31.45 1336.05 21.85 1294.55 33.31C1216.16 54.96 1145.53 176.42 1098.55 237.31C1021.25 337.52 926.74 190.55 895.55 126.31C877.11 88.33 861.36 18.49 867.74 -23.35C877.24 -85.71 946.56 -119.54 1000.45 -102.69C1067.9 -81.59 1030.48 6.65 1000.45 41.81C980.22 65.49 947.05 101.25 915.05 115.31C760.74 183.11 641.66 210.59 608.05 300.31C570.44 400.73 651.65 422.36 635.99 515.39',
    },
    { color: 'orange', strokeWidth: 99, opacity: 0.96, d: DESKTOP_ORANGE },
  ],
  title: { guide: DESKTOP_ORANGE, startOffset: '7.7%', fontSize: 76.2 },
}

// Não existe mockup mobile: adaptação vertical das mesmas curvas
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

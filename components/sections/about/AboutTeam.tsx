import Image from 'next/image'
import { TEAM } from '@/content/about'
import { cn } from '@/lib/utils'

// Trecho de docs/Desktop - 1.svg com os adesivos; as posições abaixo são % dele
const STAGE_VIEWBOX = '686 913 750 520'

const BLOBS = [
  {
    color: 'pink',
    d: 'M1181.23 950.541C1110 913.019 1073.27 966.426 1056.17 1024.58C1048.63 1089.88 991.821 1107.26 968.71 1163.08C957.373 1190.46 940.683 1287.52 968.711 1340.33C995.823 1391.42 900.565 1414.13 953.118 1491.99C1010.6 1577.64 1178.64 1533.08 1227.93 1468.21C1285.43 1395.56 1365.7 1474.02 1403.5 1383.2C1435.75 1284.57 1352.96 1170.45 1308.61 1105.57C1264.27 1035.5 1328.77 1043.27 1291 973.196C1269.65 934.267 1215.72 968.712 1181.23 950.541Z',
  },
  {
    color: 'orange',
    d: 'M784.953 1448.07C744.363 1386.29 713.913 1347.05 776.214 1307.76C847.424 1260.63 750.416 1182.34 821.564 1150.74C892.712 1119.14 954.405 1238.83 971.912 1300.79C989.45 1354.99 1124.62 1251.53 1177.69 1300.79C1236.06 1354.68 1207.54 1440.34 1162.97 1487.26C1113.03 1541.98 1090.44 1469.88 1028.15 1506.07C962.314 1542.28 971.149 1485.64 965.116 1521.75C917.344 1480.21 855.74 1530.94 807.942 1495.6C781.389 1475.63 797.251 1480.57 784.953 1448.07Z',
  },
]

// Na ordem de TEAM (content/about.ts)
const STICKERS = [
  {
    photo: 'left-[16.13%] top-[17.64%] w-[45.33%]',
    caption: 'right-[70.33%] top-[28.37%]',
    name: '',
    role: '',
  },
  {
    photo: 'left-[46.13%] top-[16.54%] w-[43.87%]',
    caption: 'right-[2%] top-0 md:top-[10.96%]',
    // O "a" final avança além da caixa do texto; recua para alinhar com o cargo
    name: 'mr-[0.1em]',
    role: 'max-md:max-w-none max-md:whitespace-nowrap',
  },
]

export function AboutTeam({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative aspect-[750/520] overflow-y-clip [container-type:inline-size]',
        className
      )}
    >
      <svg aria-hidden viewBox={STAGE_VIEWBOX} className="absolute inset-0 size-full">
        {BLOBS.map((blob) => (
          <path key={blob.color} d={blob.d} fill={`var(--color-${blob.color})`} />
        ))}
      </svg>

      <ul>
        {TEAM.map((person, index) => (
          <li key={person.name}>
            <figure>
              {/* SVG: o next/image entrega o arquivo como está, sem srcset */}
              <Image
                src={person.photo.src}
                alt={person.photo.alt}
                width={person.photo.width}
                height={person.photo.height}
                className={cn('absolute h-auto', STICKERS[index].photo)}
              />
              <figcaption className={cn('absolute w-max text-right', STICKERS[index].caption)}>
                <span
                  className={cn(
                    'block whitespace-nowrap font-script text-[length:max(1.125rem,6.667cqw)] leading-none',
                    STICKERS[index].name
                  )}
                >
                  {person.name}
                </span>
                <span
                  className={cn(
                    'ml-auto block max-w-[10em] text-[length:max(0.6875rem,2.4cqw)] font-semibold leading-[1.55] text-white',
                    STICKERS[index].role
                  )}
                >
                  {person.role}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}

import Image from 'next/image'
import { projectsIntro } from '@/content/projects'
import { cn } from '@/lib/utils'

// Trecho de docs/Desktop - 1.svg cortado onde começa a faixa rosa; as posições do adesivo são % dele
const STAGE = { x: 744, y: 2447, width: 779, height: 511.56 }

const BLOBS = [
  {
    color: 'yellow',
    d: 'M1072.53 2467.82C1158.56 2403.66 1214.79 2499.44 1268.55 2597.07C1333.07 2708.64 1377.79 2652.66 1420.8 2764.23C1463.82 2875.81 1410.44 2988.21 1324.42 3016.11C1249.14 3044 1377.08 3102.3 1308.26 3185.98C1232.99 3278.03 1067.81 3204.08 1003.29 3134.34C928.013 3056.24 801.765 3137.69 752.3 3040.07C710.097 2934.05 839.658 2814.27 897.726 2744.53C955.794 2669.22 864.228 2596.28 913.694 2520.96C941.652 2479.12 1027.37 2487.34 1072.53 2467.82Z',
  },
  {
    color: 'pink-light',
    d: 'M1260.52 2888.1C1299.61 2842.8 1346.43 2873.37 1384.22 2924.41C1436.39 2967.58 1480.34 2905.41 1498.37 2973.39C1538.48 3020.13 1524.62 3083.31 1480.34 3111.09C1442.09 3137.08 1522.23 3143.97 1495.59 3195.84C1466.52 3252.82 1363.25 3244.56 1317.06 3221.6C1263.64 3196.38 1204.46 3256.72 1162.73 3217.78C1123.87 3173.59 1179.43 3094.18 1202.03 3050.84C1223.84 3004.8 1162.01 2984.79 1178.99 2940.18C1188.69 2915.32 1237.97 2905.04 1260.52 2888.1Z',
  },
]

export function ProjectsPortrait({ className }: { className?: string }) {
  const { image } = projectsIntro

  return (
    <div
      data-reveal-group
      className={cn('relative aspect-[779/511.56] overflow-y-clip', className)}
    >
      <svg
        aria-hidden
        viewBox={`${STAGE.x} ${STAGE.y} ${STAGE.width} ${STAGE.height}`}
        className="absolute inset-0 size-full"
      >
        {BLOBS.map((blob) => (
          <path key={blob.color} data-reveal="blob" d={blob.d} fill={`var(--color-${blob.color})`} />
        ))}
      </svg>

      <Image
        data-reveal="sticker"
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 1480px) 447px, (min-width: 1024px) 31vw, (min-width: 640px) 350px, 64vw"
        className="absolute left-[17.46%] top-[6.06%] h-auto w-[57.38%]"
      />
    </div>
  )
}

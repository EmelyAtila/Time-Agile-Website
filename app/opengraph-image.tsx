import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { site } from '@/content/site'

export const alt = `${site.name} — agência de marketing e gestão em ${site.address.locality} – ${site.address.region}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Cores de styles/tokens.css: o ImageResponse não lê CSS vars
const COLORS = {
  wine: '#3c0513',
  cream: '#fbf2e1',
  pink: '#fd4274',
  orange: '#fe7c04',
  yellow: '#fdb306',
}

// Imagem que aparece quando o link é compartilhado (WhatsApp, Instagram, LinkedIn): gerada no build.
// Centralizada porque alguns apps mostram só um recorte quadrado do meio
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/images/logo-footer.svg'), 'base64')

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: COLORS.wine,
        position: 'relative',
      }}
    >
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        fill="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path
          d="M 1340 40 C 1130 60 1060 220 1115 350 S 1270 560 1150 720"
          stroke={COLORS.orange}
          strokeWidth="80"
          strokeLinecap="round"
        />
        <path
          d="M 780 -70 C 830 50 990 90 1120 30 S 1250 -30 1300 0"
          stroke={COLORS.pink}
          strokeWidth="70"
          strokeLinecap="round"
        />
        <path
          d="M -80 540 C 70 510 170 590 190 720"
          stroke={COLORS.yellow}
          strokeWidth="62"
          strokeLinecap="round"
        />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element -- o ImageResponse só aceita <img> */}
      <img src={`data:image/svg+xml;base64,${logo}`} width={640} height={141} alt="" />
      <div style={{ marginTop: 40, fontSize: 36, color: COLORS.cream }}>
        {`Agência de marketing e gestão em ${site.address.locality} – ${site.address.region}`}
      </div>
    </div>,
    size
  )
}

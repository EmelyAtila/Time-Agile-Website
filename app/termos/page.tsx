import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { termsOfUse } from '@/content/legal'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata(termsOfUse)

export default function TermsPage() {
  return <LegalPage doc={termsOfUse} />
}

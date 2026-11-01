import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal/LegalPage'
import { privacyPolicy } from '@/content/legal'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata(privacyPolicy)

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} />
}

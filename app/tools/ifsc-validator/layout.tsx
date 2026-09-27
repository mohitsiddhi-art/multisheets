// Metadata lives here rather than in page.tsx because the page is a client
// component, and client components cannot export metadata. A nested layout
// is a server component, so it can.
import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'IFSC Code Validator',
  description:
    'Check whether an IFSC code is valid. Verify the 11-character format, confirm the bank code prefix, and look up the branch details for any Indian bank IFSC.',
  ...canonical('/tools/ifsc-validator'),
}

export default function IfscValidatorLayout({ children }: { children: React.ReactNode }) {
  return children
}

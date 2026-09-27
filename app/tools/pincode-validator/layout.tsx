// Metadata lives here rather than in page.tsx because the page is a client
// component, and client components cannot export metadata. A nested layout
// is a server component, so it can.
import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'PIN Code Validator',
  description:
    'Validate any Indian PIN code. Confirm the 6-digit format, decode the postal zone and sorting district, and verify the post office details instantly.',
  ...canonical('/tools/pincode-validator'),
}

export default function PincodeValidatorLayout({ children }: { children: React.ReactNode }) {
  return children
}

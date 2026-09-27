// Metadata lives here rather than in page.tsx because the page is a client
// component, and client components cannot export metadata. A nested layout
// is a server component, so it can.
import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Address Validator',
  description:
    'Validate an Indian postal address against its PIN code. Check that the PIN code matches the district and state before you print a label or ship a parcel.',
  ...canonical('/tools/address-validator'),
}

export default function AddressValidatorLayout({ children }: { children: React.ReactNode }) {
  return children
}

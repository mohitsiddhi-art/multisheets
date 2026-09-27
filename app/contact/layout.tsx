// Metadata lives here rather than in page.tsx because the page is a client
// component, and client components cannot export metadata. A nested layout
// is a server component, so it can.
import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Multisheets team about data corrections, business enquiries, feedback, or advertising on this Indian PIN code and IFSC lookup site.',
  ...canonical('/contact'),
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

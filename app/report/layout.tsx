// Metadata lives here rather than in page.tsx because the page is a client
// component, and client components cannot export metadata. A nested layout
// is a server component, so it can.
import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Report a Data Correction',
  description:
    "Found a wrong PIN code, post office name, or IFSC branch on Multisheets? Report the error and help us keep India's postal and banking data accurate.",
  ...canonical('/report'),
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children
}

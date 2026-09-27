// Metadata lives here rather than in page.tsx because the page is a client
// component, and client components cannot export metadata. A nested layout
// is a server component, so it can.
import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Postal Quiz',
  description:
    "Test your knowledge of Indian postal codes, PIN code zones, IFSC structure, and India Post services with this free 12-question quiz. Score and see answers instantly.",
  ...canonical('/quiz'),
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children
}

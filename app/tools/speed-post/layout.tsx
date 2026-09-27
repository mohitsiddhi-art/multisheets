import type { Metadata } from 'next'
import { canonical } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Speed Post Calculator',
  description:
    'Calculate India Post Speed Post charges by weight and distance. Get an estimated delivery time and cost for domestic Speed Post parcels.',
  ...canonical('/tools/speed-post'),
}

export default function SpeedPostLayout({ children }: { children: React.ReactNode }) {
  return children
}

import { Metadata } from 'next'
import SearchBox from '@/components/SearchBox'

export const metadata: Metadata = {
  title: 'PIN Code Finder — Multisheets',
  description: 'Find Indian PIN codes, post office details, district, state, and delivery status instantly.',
}

export default function PincodeFinder() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            📮 PIN Code Finder
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Search by PIN code, office name, district, or state. Filter results to PIN codes only.
          </p>
        </div>
        <SearchBox initialFilter="pincode" />
      </div>
    </div>
  )
}

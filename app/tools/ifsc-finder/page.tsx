import { Metadata } from 'next'
import SearchBox from '@/components/SearchBox'

export const metadata: Metadata = {
  title: 'IFSC Code Finder — Multisheets',
  description: 'Find Indian bank IFSC codes, branch details, MICR, contact, and transfer support info.',
}

export default function IfscFinder() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            🏦 IFSC Code Finder
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Search by IFSC code, bank name, branch, or city. Filter results to bank branches only.
          </p>
        </div>
        <SearchBox initialFilter="ifsc" />
      </div>
    </div>
  )
}

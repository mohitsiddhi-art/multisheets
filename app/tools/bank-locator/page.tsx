import { Metadata } from 'next'
import SearchBox from '@/components/SearchBox'

export const metadata: Metadata = {
  title: 'Bank Locator — Multisheets',
  description: 'Find all bank branches near any location using PIN code. Search 164,000+ branches across India.',
}

export default function BankLocator() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            📍 Bank Locator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter a PIN code to find all bank branches in that area. Search by bank name, city, or district.
          </p>
        </div>
        <SearchBox initialFilter="bank" />
      </div>
    </div>
  )
}

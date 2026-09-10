import { Metadata } from 'next'
import SearchBoxClient from '@/components/SearchBoxClient'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Search — Multisheets',
  description: 'Unified Smart Search for Indian PIN codes and IFSC codes',
}

function SearchBoxClientFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Unified Smart Search
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Search across 164,000+ PIN codes and IFSC codes simultaneously. Filter by type, use keyboard shortcuts, and get instant results.
          </p>
        </div>

        {/* Search Box - wrapped in Suspense for useSearchParams */}
        <Suspense fallback={<SearchBoxClientFallback />}>
          <SearchBoxClient />
        </Suspense>
      </div>
    </div>
  )
}
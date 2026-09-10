import { Metadata } from 'next'
import Link from 'next/link'
import { getPincodes, getBranches } from '@/lib/india-data'

export const metadata: Metadata = {
  title: 'Browse States — All Indian States & Districts',
  description:
    'Browse all Indian states and union territories with post office counts, PIN codes and districts. Find post offices and bank branches across India.',
}

type StateAgg = {
  state: string
  offices: number
  pincodes: Set<string>
  districts: Set<string>
}

export default function StatesPage() {
  const offices = getPincodes()
  const branches = getBranches()

  // Aggregate post-office data by state
  const byState = new Map<string, StateAgg>()
  for (const o of offices) {
    const key = o.state || 'Unknown'
    let agg = byState.get(key)
    if (!agg) {
      agg = { state: key, offices: 0, pincodes: new Set(), districts: new Set() }
      byState.set(key, agg)
    }
    agg.offices += 1
    agg.pincodes.add(o.pincode)
    agg.districts.add(o.district)
  }

  const states = [...byState.values()].sort((a, b) => a.state.localeCompare(b.state))
  const totalPincodes = new Set(offices.map((o) => o.pincode)).size

  // Bank branch count per state (for a richer card)
  const branchesByState = new Map<string, number>()
  for (const b of branches) {
    const key = b.state || 'Unknown'
    branchesByState.set(key, (branchesByState.get(key) || 0) + 1)
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            🗺️ Browse States of India
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {states.length} states &amp; union territories · {offices.length.toLocaleString()} post offices ·{' '}
            {totalPincodes.toLocaleString()} PIN codes · {branches.length.toLocaleString()} bank branches
          </p>
        </div>

        {/* State grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {states.map((s) => (
            <Link
              key={s.state}
              href={`/search?filter=location&q=${encodeURIComponent(s.state)}`}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-lg hover:border-primary/40 dark:hover:border-blue-500/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary dark:group-hover:text-blue-400 transition">
                  {s.state}
                </h2>
                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  {s.districts.size} districts
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 py-2">
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {s.pincodes.size.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">PIN codes</p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 py-2">
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {s.offices.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Offices</p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 py-2">
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {(branchesByState.get(s.state) || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Banks</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-primary dark:text-blue-400 font-medium">
                Browse post offices in {s.state} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
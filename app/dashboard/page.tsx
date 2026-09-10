import { Metadata } from 'next'
import { getPincodes, getBranches } from '@/lib/india-data'

export const metadata: Metadata = {
  title: 'Postal Dashboard — India Post Data at a Glance',
  description:
    'Live statistics on Indian PIN codes, post offices, bank branches, and states — powered by the India Post & RBI datasets.',
}

function Bar({ label, value, max, color = 'bg-primary' }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-36 sm:w-44 text-right text-slate-700 dark:text-slate-300 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-900/60 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-right font-mono text-xs text-slate-500 dark:text-slate-400 shrink-0">{value.toLocaleString()}</span>
    </div>
  )
}

export default function DashboardPage() {
  const offices = getPincodes()
  const branches = getBranches()

  const totalPincodes = new Set(offices.map((o) => o.pincode)).size
  const totalStates = new Set(offices.map((o) => o.state)).size
  const totalBanks = new Set(branches.map((b) => b.bank_name)).size
  const totalDistricts = new Set(offices.map((o) => o.district)).size

  // Office type breakdown
  const officeTypeCounts = new Map<string, number>()
  for (const o of offices) {
    officeTypeCounts.set(o.office_type, (officeTypeCounts.get(o.office_type) || 0) + 1)
  }
  const officeTypes = [...officeTypeCounts.entries()].sort((a, b) => b[1] - a[1])
  const maxOfficeType = officeTypes[0]?.[1] || 1

  // Delivery breakdown
  const deliveryCounts = new Map<string, number>()
  for (const o of offices) {
    const key = o.delivery || 'Unknown'
    deliveryCounts.set(key, (deliveryCounts.get(key) || 0) + 1)
  }
  const deliveryTypes = [...deliveryCounts.entries()].sort((a, b) => b[1] - a[1])
  const maxDelivery = deliveryTypes[0]?.[1] || 1

  // Top 10 states by office count
  const stateCounts = new Map<string, number>()
  for (const o of offices) {
    stateCounts.set(o.state, (stateCounts.get(o.state) || 0) + 1)
  }
  const topStates = [...stateCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxState = topStates[0]?.[1] || 1

  // Top 10 banks by branch count
  const bankCounts = new Map<string, number>()
  for (const b of branches) {
    bankCounts.set(b.bank_name, (bankCounts.get(b.bank_name) || 0) + 1)
  }
  const topBanks = [...bankCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxBank = topBanks[0]?.[1] || 1

  // Bank type breakdown
  const bankTypeCounts = new Map<string, number>()
  for (const b of branches) {
    bankTypeCounts.set(b.bank_type, (bankTypeCounts.get(b.bank_type) || 0) + 1)
  }
  const bankTypes = [...bankTypeCounts.entries()].sort((a, b) => b[1] - a[1])
  const maxBankType = bankTypes[0]?.[1] || 1

  // Top 5 districts
  const districtCounts = new Map<string, number>()
  for (const o of offices) {
    districtCounts.set(o.district, (districtCounts.get(o.district) || 0) + 1)
  }
  const topDistricts = [...districtCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxDistrict = topDistricts[0]?.[1] || 1

  // Service adoption (bank services)
  const neftCount = branches.filter((b) => b.neft).length
  const rtgsCount = branches.filter((b) => b.rtgs).length
  const impsCount = branches.filter((b) => b.imps).length
  const upiCount = branches.filter((b) => b.upi).length
  const maxService = Math.max(neftCount, rtgsCount, impsCount, upiCount)

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            📊 Postal Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Live statistics from the India Post and RBI datasets — {offices.length.toLocaleString()} post offices,{' '}
            {branches.length.toLocaleString()} bank branches, across {totalStates} states.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { value: offices.length.toLocaleString(), label: 'Post Offices', icon: '📮' },
            { value: totalPincodes.toLocaleString(), label: 'Unique PIN Codes', icon: '🔢' },
            { value: branches.length.toLocaleString(), label: 'Bank Branches', icon: '🏦' },
            { value: totalBanks.toLocaleString(), label: 'Unique Banks', icon: '💳' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center hover:shadow-md transition-shadow"
            >
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{kpi.value}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{kpi.icon} {kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { value: totalStates, label: 'States & UTs' },
            { value: totalDistricts, label: 'Districts' },
            { value: `${Math.round((neftCount / branches.length) * 100)}%`, label: 'NEFT Coverage' },
            { value: `${Math.round((upiCount / branches.length) * 100)}%`, label: 'UPI Coverage' },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center"
            >
              <p className="text-2xl font-bold text-primary dark:text-blue-400">{kpi.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="space-y-8">
          {/* Top 10 States */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
              🗺️ Top 10 States by Post Office Count
            </h2>
            <div className="space-y-2.5">
              {topStates.map(([state, count]) => (
                <Bar key={state} label={state} value={count} max={maxState} color="bg-primary" />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Office Types */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
                🏤 Office Types
              </h2>
              <div className="space-y-2.5">
                {officeTypes.map(([type, count]) => (
                  <Bar key={type} label={type} value={count} max={maxOfficeType} color="bg-emerald-500" />
                ))}
              </div>
            </div>

            {/* Delivery vs Non-Delivery */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
                🚚 Delivery Status
              </h2>
              <div className="space-y-2.5">
                {deliveryTypes.map(([type, count]) => (
                  <Bar key={type} label={type} value={count} max={maxDelivery} color="bg-amber-500" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top 10 Banks */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
                🏛️ Top 10 Banks by Branch Count
              </h2>
              <div className="space-y-2.5">
                {topBanks.map(([bank, count]) => (
                  <Bar key={bank} label={bank} value={count} max={maxBank} color="bg-violet-500" />
                ))}
              </div>
            </div>

            {/* Bank Types */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
                🏦 Bank Types
              </h2>
              <div className="space-y-2.5">
                {bankTypes.map(([type, count]) => (
                  <Bar key={type} label={type} value={count} max={maxBankType} color="bg-rose-500" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Digital Banking Services */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
                💻 Digital Banking Services Adoption
              </h2>
              <div className="space-y-2.5">
                <Bar label="NEFT" value={neftCount} max={maxService} color="bg-teal-500" />
                <Bar label="RTGS" value={rtgsCount} max={maxService} color="bg-cyan-500" />
                <Bar label="IMPS" value={impsCount} max={maxService} color="bg-blue-500" />
                <Bar label="UPI" value={upiCount} max={maxService} color="bg-indigo-500" />
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Percentage of {branches.length.toLocaleString()} branches offering each service.
              </p>
            </div>

            {/* Top Districts */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-5">
                📍 Top 5 Districts by Post Office Density
              </h2>
              <div className="space-y-2.5">
                {topDistricts.map(([district, count]) => (
                  <Bar key={district} label={district} value={count} max={maxDistrict} color="bg-orange-500" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
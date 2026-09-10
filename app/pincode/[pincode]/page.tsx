import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { findPincode, findAllPincodes, findAllBranchesByPincode } from '@/lib/india-data'
import { CopyButton, ShareButton } from '@/components/CopyShareButtons'

type Props = { params: Promise<{ pincode: string }> }

// --------------- metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pincode } = await params
  const o = findPincode(pincode)
  if (!o) return { title: 'PIN Not Found — Multisheets' }
  return {
    title: `${o.pincode} — ${o.office_name}, ${o.district} (${o.state})`,
    description: `${o.office_name} post office, PIN ${o.pincode} — ${o.district}, ${o.state}. Office type: ${o.office_type}. Delivery: ${o.delivery}.`,
  }
}

// --------------- page
export default async function PincodeDetail({ params }: Props) {
  const { pincode: raw } = await params
  const pincode = raw.trim()

  // Validate
  if (!/^\d{6}$/.test(pincode)) notFound()

  const office = findPincode(pincode)
  if (!office) notFound()

  const allOffices = findAllPincodes(pincode)
  const banks = findAllBranchesByPincode(pincode)

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-primary transition">Search</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-medium">{pincode}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              📮 PIN Code
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-slate-50 mb-2">
            {office.pincode}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {office.office_name} — {office.district}, {office.state}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Postal Details Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 10V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" />
                <path d="M3 10h18" />
              </svg>
              Post Office Details
              {allOffices.length > 1 && (
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  ({allOffices.length} offices)
                </span>
              )}
            </h2>
            <div className={`space-y-4 ${allOffices.length > 1 ? 'divide-y divide-slate-100 dark:divide-slate-700' : ''}`}>
              {allOffices.map((o) => (
                <div key={o.office_name} className={allOffices.length > 1 ? 'pt-4 first:pt-0' : ''}>
                  <dl className="space-y-3">
                    <DetailRow label="PIN Code" value={o.pincode} monospace />
                    <DetailRow label="Office Name" value={o.office_name} />
                    <DetailRow label="Office Type" value={o.office_type} />
                    <DetailRow label="Delivery Status" value={o.delivery} />
                    <DetailRow label="District" value={o.district} />
                    <DetailRow label="State" value={o.state} />
                    <DetailRow label="Circle" value={o.circle} />
                    <DetailRow label="Region" value={o.region} />
                    <DetailRow label="Division" value={o.division} />
                  </dl>
                </div>
              ))}
            </div>
          </div>

          {/* Area Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Area Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Zone Breakdown</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-mono">
                    {office.pincode.slice(0, 1)} — Postal Zone
                  </span>
                  <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-mono">
                    {office.pincode.slice(1, 2)} — Sub-zone
                  </span>
                  <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-mono">
                    {office.pincode.slice(2, 4)} — District
                  </span>
                  <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-mono">
                    {office.pincode.slice(4, 6)} — Delivery Office
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={office.pincode} label="Copy PIN" />
                  <CopyButton
                    text={`${office.office_name}, ${office.district}, ${office.state} - ${office.pincode}`}
                    label="Copy Address"
                  />
                  <ShareButton
                    text={`PIN Code ${office.pincode}: ${office.office_name}, ${office.district}, ${office.state}`}
                    url={`/pincode/${office.pincode}`}
                    label="Share"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banks at this PIN */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            🏦 Banks at PIN {office.pincode}{' '}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({banks.length} {banks.length === 1 ? 'branch' : 'branches'})
            </span>
          </h2>
          {banks.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No bank branch data available for this PIN code.</p>
          ) : (
            <div className="space-y-3">
              {banks.slice(0, 30).map((b) => (
                <Link
                  key={b.ifsc}
                  href={`/ifsc/${b.ifsc}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-50 group-hover:text-primary transition truncate">
                      {b.bank_name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {b.branch_name} • {b.city}, {b.state}
                    </p>
                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500">{b.ifsc}</p>
                  </div>
                </Link>
              ))}
              {banks.length > 30 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center pt-4">
                  Showing 30 of {banks.length} branches. Search for &quot;{office.pincode}&quot; to see all.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Cross-link for Sri Dungargarh */}
        {pincode === '331803' && (
          <div className="mt-6 p-4 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
            <p className="font-medium text-primary dark:text-blue-300 mb-2">
              📍 This PIN covers Sri Dungargarh (Bikaner, Rajasthan)
            </p>
            <Link
              href="/sri-dungargarh"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition text-sm"
            >
              View full Sri Dungargarh city guide →
            </Link>
          </div>
        )}

        {/* Source */}
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
          <span>Source: India Post</span>
          <span>Last Updated: Sept 2026</span>
          <Link href="/report" className="text-primary hover:underline">Report correction</Link>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, monospace = false }: { label: string; value: string; monospace?: boolean }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-baseline gap-4">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className={`text-sm font-medium text-slate-900 dark:text-slate-50 ${monospace ? 'font-mono' : ''} text-right`}>
        {value}
      </dd>
    </div>
  )
}


import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { findBranch } from '@/lib/india-data'
import { CopyButton, ShareButton } from '@/components/CopyShareButtons'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { canonical } from '@/lib/seo'

type Props = { params: Promise<{ ifsc: string }> }

// --------------- metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ifsc } = await params
  const branch = findBranch(ifsc)
  if (!branch) return { title: 'IFSC Not Found — Multisheets' }
  return {
    title: `${branch.ifsc} — ${branch.bank_name}, ${branch.branch_name}`,
    description: `IFSC ${branch.ifsc} — ${branch.bank_name}, ${branch.branch_name}, ${branch.city}, ${branch.district}, ${branch.state}. MICR: ${branch.micr}. NEFT: ${branch.neft ? 'Yes' : 'No'}.`,
    ...canonical(`/ifsc/${branch.ifsc}`),
  }
}

// --------------- page
export default async function IfscDetail({ params }: Props) {
  const { ifsc: raw } = await params
  const ifsc = raw.trim().toUpperCase()

  // Basic format check
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) notFound()

  const branch = findBranch(ifsc)
  if (!branch) notFound()

  // Decode IFSC meaning
  const bankCode = ifsc.slice(0, 4)
  const branchCode = ifsc.slice(5)

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Search', url: '/search' },
          { name: branch.ifsc, url: `/ifsc/${branch.ifsc}` },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-primary transition">Search</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-medium">{branch.ifsc}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              🏦 IFSC Code
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-slate-50 mb-2">
            {branch.ifsc}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {branch.bank_name} — {branch.branch_name}
          </p>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {branch.city}, {branch.district}, {branch.state}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bank Details Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 21h18" />
                <path d="M3 10h18" />
                <path d="M5 6l7-3 7 3" />
                <path d="M4 10v11" />
                <path d="M20 10v11" />
                <path d="M8 10v11" />
                <path d="M12 10v11" />
                <path d="M16 10v11" />
              </svg>
              Bank Details
            </h2>
            <dl className="space-y-3">
              <DetailRow label="Bank Name" value={branch.bank_name} />
              <DetailRow label="Branch" value={branch.branch_name} />
              <DetailRow label="IFSC Code" value={branch.ifsc} monospace />
              <DetailRow label="MICR Code" value={branch.micr} monospace />
              <DetailRow label="Bank Type" value={branch.bank_type} />
              <DetailRow label="Contact" value={branch.contact} />
              <DetailRow label="Address" value={branch.address} />
            </dl>
          </div>

          {/* IFSC Breakdown Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              IFSC Code Breakdown
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-lg">
                <span className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold">
                  {bankCode}
                </span>
                <span className="text-slate-400">0</span>
                <span className="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-bold">
                  {branchCode}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg">
                  {bankCode} — Bank Code
                </span>
                <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg">
                  0 — Control (reserved)
                </span>
                <span className="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg">
                  {branchCode} — Branch Code
                </span>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Transfer Support</p>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge label="NEFT" supported={branch.neft} />
                  <StatusBadge label="RTGS" supported={branch.rtgs} />
                  <StatusBadge label="IMPS" supported={branch.imps} />
                  <StatusBadge label="UPI" supported={branch.upi} />
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={branch.ifsc} label="Copy IFSC" />
                  {branch.micr && <CopyButton text={branch.micr} label="Copy MICR" />}
                  {branch.swift && <CopyButton text={branch.swift} label="Copy SWIFT" />}
                  <CopyButton
                    text={`${branch.bank_name}, ${branch.branch_name}, ${branch.address}`}
                    label="Copy Address"
                  />
                  <ShareButton
                    text={`${branch.bank_name} (${branch.branch_name}) — IFSC: ${branch.ifsc}`}
                    url={`/ifsc/${branch.ifsc}`}
                    label="Share"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            📍 Location
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">City</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{branch.city || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">District</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{branch.district}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">State</p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{branch.state}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">PIN Code</p>
              {branch.pincode ? (
                <Link
                  href={`/pincode/${branch.pincode}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {branch.pincode}
                </Link>
              ) : (
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">—</p>
              )}
            </div>
          </div>
        </div>

        {/* Source */}
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
          <span>Source: RBI / Banks</span>
          <span>Last Updated: Sept 2026</span>
          <Link href="/report" className="text-primary hover:underline">Report correction</Link>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value, monospace = false }: { label: string; value: string | undefined; monospace?: boolean }) {
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

function StatusBadge({ label, supported }: { label: string; supported: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
        supported
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
          : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
      }`}
    >
      {supported ? '✓' : '✗'} {label}
    </span>
  )
}

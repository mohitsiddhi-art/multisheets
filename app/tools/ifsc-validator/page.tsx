'use client'

import { useState } from 'react'
import Link from 'next/link'

// Common bank code prefixes
const BANK_CODES: Record<string, string> = {
  'AIRB': 'Air India',
  'ALLA': 'Allahabad Bank',
  'ANDB': 'Andhra Bank',
  'BARB': 'Bank of Baroda',
  'BKID': 'Bank of India',
  'BOBA': 'Bank of Maharashtra',
  'CBIN': 'Central Bank of India',
  'CNRB': 'Canara Bank',
  'CORP': 'Corporation Bank',
  'DBSS': 'DBS Bank',
  'DEUT': 'Deutsche Bank',
  'HDFC': 'HDFC Bank',
  'ICIC': 'ICICI Bank',
  'IDFB': 'IDFC First Bank',
  'IDIB': 'Indian Bank',
  'IOBA': 'Indian Overseas Bank',
  'JAKA': 'Jammu & Kashmir Bank',
  'KARB': 'Karnataka Bank',
  'KKBK': 'Kotak Mahindra Bank',
  'MAHB': 'Bank of Maharashtra',
  'NKGS': 'NKGSB Bank',
  'PUNB': 'Punjab National Bank',
  'PYES': 'Yes Bank',
  'SBIN': 'State Bank of India',
  'SCBL': 'Standard Chartered Bank',
  'SYNB': 'Syndicate Bank',
  'TMBL': 'Tamilnad Mercantile Bank',
  'UBIN': 'Union Bank of India',
  'UCBA': 'UCO Bank',
  'UTIB': 'Axis Bank',
  'VIJB': 'Vijaya Bank',
  'YESA': 'Yes Bank',
}

export default function IfscValidator() {
  const [input, setInput] = useState('')
  const trimmed = input.trim().toUpperCase()
  const isValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed)

  const bankCode = isValid ? trimmed.slice(0, 4) : null
  const branchCode = isValid ? trimmed.slice(5) : null
  const bankName = bankCode ? (BANK_CODES[bankCode] || 'Unknown Bank') : null

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            🔍 IFSC Code Validator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Validate IFSC codes and understand their structure and meaning.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter IFSC Code
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
              placeholder="e.g. SBIN0001234"
              maxLength={11}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-mono tracking-wider text-center"
            />
            {isValid && (
              <Link
                href={`/ifsc/${trimmed}`}
                className="px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition text-sm"
              >
                Look Up →
              </Link>
            )}
          </div>

          {/* Status */}
          <div className="mt-4">
            {trimmed.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm">
                Enter an 11-character IFSC code to validate
              </div>
            ) : isValid ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                ✅ Valid IFSC code format
                {bankName !== 'Unknown Bank' && (
                  <span className="ml-2">— {bankName}</span>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium">
                ❌ Invalid — IFSC must be 11 characters: 4 letters + &quot;0&quot; + 6 alphanumeric (entered {trimmed.length})
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        {isValid && bankCode && branchCode && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              IFSC Code Breakdown
            </h2>
            <div className="flex items-center gap-1 font-mono text-2xl mb-4">
              <span className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold">
                {bankCode}
              </span>
              <span className="px-2 py-2 text-slate-400 dark:text-slate-500 font-bold">0</span>
              <span className="px-3 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-bold">
                {branchCode}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg">
                {bankCode} — Bank Code
              </span>
              <span className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg">
                0 — Control Digit (reserved by RBI)
              </span>
              <span className="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg">
                {branchCode} — Branch Identifier
              </span>
            </div>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Detected Bank</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">{bankName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Bank Code</dt>
                <dd className="text-sm font-mono font-medium text-slate-900 dark:text-slate-50">{bankCode}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Branch Code</dt>
                <dd className="text-sm font-mono font-medium text-slate-900 dark:text-slate-50">{branchCode}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Common Banks */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Common Bank Codes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(BANK_CODES)
              .filter(([code]) => code.length === 4)
              .slice(0, 16)
              .map(([code, name]) => (
                <div
                  key={code}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    bankCode === code ? 'bg-primary/10 dark:bg-primary/20' : ''
                  }`}
                >
                  <span className="w-12 font-mono font-bold text-sm text-slate-900 dark:text-slate-50">{code}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

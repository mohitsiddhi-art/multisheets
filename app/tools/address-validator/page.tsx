'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

// Metadata for SEO (rendered by layout, but this is a client component)
// Set via a parent or via head.tsx if needed. For now, keep it as client.

type PinResult = {
  pincode: string
  office_name: string
  office_type: string
  delivery: string
  district: string
  state: string
  circle: string
  region: string
  division: string
}

type ValidationResult = {
  extractedPin: string | null
  pinValid: boolean
  pinDetails: PinResult[] | null
  addressValid: boolean
  issues: string[]
  suggestions: string[]
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Chandigarh',
  'Puducherry','Andaman and Nicobar Islands','Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep','Ladakh',
]

function extractPin(text: string): string | null {
  const match = text.match(/\b(\d{6})\b/)
  return match ? match[1] : null
}

function extractState(text: string): string | null {
  const lower = text.toLowerCase()
  for (const s of INDIAN_STATES) {
    if (lower.includes(s.toLowerCase())) return s
  }
  return null
}

function extractPinFromAddress(text: string): string | null {
  // Look for "PIN: XXXXXX" or "PIN - XXXXXX" or "PINCode: XXXXXX" or standalone 6 digits
  const patterns = [
    /\b(?:pin|pincode|pin\s*code)[:\s-]*(\d{6})\b/i,
    /\b(\d{6})\b/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return m[1]
  }
  return null
}

export default function AddressValidator() {
  const [address, setAddress] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const validate = async () => {
    if (!address.trim()) return
    setLoading(true)

    const issues: string[] = []
    const suggestions: string[] = []

    // 1. Extract PIN
    const pin = extractPinFromAddress(address)

    // 2. Extract state if present
    const state = extractState(address)

    // Basic address validation
    const hasNumbers = /\d/.test(address)
    if (!hasNumbers) {
      issues.push('No house number or landmark detected — include one for better delivery.')
    }

    const wordCount = address.trim().split(/\s+/).length
    if (wordCount < 4) {
      issues.push('Address looks very short — include more details (landmark, city, state).')
    }

    let pinValid = false
    let pinDetails: PinResult[] | null = null

    if (pin) {
      // Validate PIN
      pinValid = /^\d{6}$/.test(pin)

      // Fetch PIN details from API
      try {
        const res = await fetch(`/api/search?q=${pin}&filter=pincode&limit=50`)
        if (res.ok) {
          const data = await res.json()
          if (data.results && data.results.length > 0) {
            pinDetails = data.results
              .filter((r: any) => r.kind === 'pincode')
              .map((r: any) => r.record)
          }
        }
      } catch {
        issues.push('Could not verify PIN — please try again.')
      }

      // Cross-check state match
      if (state && pinDetails && pinDetails.length > 0) {
        const pinStates = pinDetails.map((p) => p.state)
        const stateMatch = pinStates.some((s) => s.toLowerCase() === state.toLowerCase())
        if (!stateMatch) {
          issues.push(
            `⚠️ State mismatch: PIN ${pin} belongs to ${pinStates[0]}, but "${state}" was mentioned in the address.`
          )
          suggestions.push(`Double-check that PIN ${pin} is correct for the ${state} address.`)
        }
      }
    } else {
      issues.push('No 6-digit PIN code found in the address.')
      suggestions.push('Add a 6-digit PIN code (e.g. 110001) to validate.')
    }

    // Suggestions for improvement
    if (!state) {
      suggestions.push('Adding the state name helps verify PIN code accuracy.')
    }
    if (address.toUpperCase().includes('PIN') === false && pin) {
      // Already has a numeric PIN
    } else if (!pin) {
      suggestions.push('Include "PIN: XXXXXX" to help extract the code.')
    }

    setResult({
      extractedPin: pin,
      pinValid: !!pin && /^\d{6}$/.test(pin),
      pinDetails,
      addressValid: issues.length === 0 && !!pin,
      issues,
      suggestions,
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            📬 Address Validator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Paste a full Indian address to extract the PIN code, verify it, and cross-check against the post office database.
          </p>
        </div>

        {/* Input area */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
          <label htmlFor="address-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter an Indian address
          </label>
          <textarea
            id="address-input"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder='e.g. 42, MG Road, Near Central Market, Connaught Place, New Delhi, Delhi 110001'
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 text-base transition resize-none"
          />
          <button
            onClick={validate}
            disabled={loading || !address.trim()}
            className="mt-4 px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Validating…' : 'Validate Address'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-5">
            {/* Overall status */}
            <div
              className={`p-4 rounded-xl border ${
                result.addressValid
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
              }`}
            >
              <p className={`font-semibold ${
                result.addressValid ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'
              }`}>
                {result.addressValid
                  ? '✅ Address validated — PIN code found and verified.'
                  : `⚠️ ${result.issues.length} issue${result.issues.length !== 1 ? 's' : ''} found — see details below.`}
              </p>
            </div>

            {/* Extracted PIN */}
            {result.extractedPin && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  📌 Extracted PIN Code
                </h2>
                <div className="flex items-center gap-3">
                  <code className="text-2xl font-mono font-bold text-primary dark:text-blue-400">
                    {result.extractedPin}
                  </code>
                  <Link
                    href={`/pincode/${result.extractedPin}`}
                    className="text-sm text-primary dark:text-blue-400 hover:underline"
                  >
                    View on map →
                  </Link>
                </div>
              </div>
            )}

            {/* PIN details */}
            {result.pinDetails && result.pinDetails.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  🏤 Post Offices at PIN {result.extractedPin}
                </h2>
                <div className="space-y-3">
                  {result.pinDetails.map((p, i) => (
                    <div key={i} className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-50">{p.office_name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {p.district}, {p.state} · {p.office_type} · {p.delivery}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                        {p.office_type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
                  ❌ Issues
                </h2>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {result.issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">
                  💡 Suggestions
                </h2>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {result.suggestions.map((sug, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related tools */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href="/tools/pincode-validator"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                🔢 PIN Code Validator
              </Link>
              <Link
                href="/tools/ifsc-validator"
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                🏦 IFSC Code Validator
              </Link>
            </div>
          </div>
        )}

        {/* Info box */}
        {!result && (
          <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">How to use</h3>
            <ul className="space-y-1.5 text-sm text-blue-800 dark:text-blue-200">
              <li>• Paste a complete Indian address including PIN code</li>
              <li>• The tool extracts the PIN code and looks up post office details</li>
              <li>• It cross-checks whether the PIN matches the state mentioned in the address</li>
              <li>• Useful for verifying addresses before courier dispatch or form submissions</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
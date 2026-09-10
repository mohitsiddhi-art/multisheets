'use client'

import { useState } from 'react'
import Link from 'next/link'

const ZONE_MAP: Record<string, { zone: string; region: string }> = {
  '1': { zone: 'Delhi, Haryana, Punjab, HP, J&K, Chandigarh', region: 'North' },
  '2': { zone: 'UP, Uttarakhand', region: 'North' },
  '3': { zone: 'Rajasthan, Gujarat', region: 'West' },
  '4': { zone: 'Maharashtra, MP, Goa', region: 'West' },
  '5': { zone: 'AP, Karnataka', region: 'South' },
  '6': { zone: 'Tamil Nadu, Kerala', region: 'South' },
  '7': { zone: 'West Bengal, Odisha, NE States', region: 'East' },
  '8': { zone: 'Bihar, Jharkhand', region: 'East' },
  '9': { zone: 'Army Postal Service (APS)', region: 'Military' },
}

export default function PincodeValidator() {
  const [input, setInput] = useState('')
  const trimmed = input.trim()
  const isValid = /^\d{6}$/.test(trimmed)
  const firstDigit = isValid ? trimmed[0] : null
  const zoneInfo = firstDigit ? ZONE_MAP[firstDigit] : null

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            ✅ PIN Code Validator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Validate Indian PIN codes and decode their zone information.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter PIN Code
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 110001"
              maxLength={6}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-mono tracking-widest text-center"
            />
            {trimmed && (
              <Link
                href={`/pincode/${trimmed}`}
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
                Enter a 6-digit Indian PIN code to validate
              </div>
            ) : isValid ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                ✅ Valid PIN code format
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium">
                ❌ Invalid — PIN code must be exactly 6 digits (entered {trimmed.length})
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        {isValid && zoneInfo && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
              PIN Code Breakdown
            </h2>
            <div className="flex items-center gap-1 font-mono text-2xl mb-4">
              {trimmed.split('').map((d, i) => (
                <span
                  key={i}
                  className={`w-10 h-12 flex items-center justify-center rounded-lg font-bold ${
                    i === 0
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : i < 4
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg">
                {trimmed[0]} — Postal Zone ({zoneInfo.region})
              </span>
              <span className="px-3 py-1.5 text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg">
                {trimmed.slice(1, 4)} — Sub-zone / District
              </span>
              <span className="px-3 py-1.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg">
                {trimmed.slice(4, 6)} — Delivery Office
              </span>
            </div>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Region</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50">{zoneInfo.region}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Coverage Area</dt>
                <dd className="text-sm font-medium text-slate-900 dark:text-slate-50 text-right max-w-xs">{zoneInfo.zone}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Reference Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Postal Zone Reference
          </h2>
          <div className="space-y-2">
            {Object.entries(ZONE_MAP).map(([digit, info]) => (
              <div
                key={digit}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  firstDigit === digit ? 'bg-primary/10 dark:bg-primary/20' : ''
                }`}
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 font-mono font-bold text-slate-900 dark:text-slate-50">
                  {digit}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-slate-50 truncate">{info.zone}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {info.region}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

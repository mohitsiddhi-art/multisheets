'use client'

import { useState } from 'react'

// India Post Speed Post Parcel — RETAIL tariff.
//
// Source: indiapost.gov.in, "Speed Post Parcel (Domestic)". Effective
// 01.08.2026 vide S.O. 4241(E), Gazette of India dated 31.07.2026.
// All figures exclude GST, which is levied as applicable on top.
// Contractual/bulk rates are different and are NOT shown here — this is
// the retail counter tariff that a walk-in customer pays.
//
// Zone keys map to the official column headings:
//   zone1 = Local        zone2 = Within State
//   zone3 = Zone/Metro   zone4 = Other States
type Slab = {
  maxWeight: number
  label: string
  zone1: number
  zone2: number
  zone3: number
  zone4: number
}

const RATES: Slab[] = [
  { maxWeight: 0.5, label: 'Up to 500 g',    zone1: 28,  zone2: 76,  zone3: 82,  zone4: 90 },
  { maxWeight: 1,   label: '501 g – 1 kg',   zone1: 48,  zone2: 101, zone3: 137, zone4: 143 },
  { maxWeight: 1.5, label: '1 – 1.5 kg',     zone1: 60,  zone2: 130, zone3: 182, zone4: 228 },
  { maxWeight: 2,   label: '1.5 – 2 kg',     zone1: 87,  zone2: 178, zone3: 254, zone4: 319 },
  { maxWeight: 3,   label: '2 – 3 kg',       zone1: 116, zone2: 243, zone3: 355, zone4: 450 },
  { maxWeight: 4,   label: '3 – 4 kg',       zone1: 145, zone2: 298, zone3: 441, zone4: 560 },
  { maxWeight: 5,   label: '4 – 5 kg',       zone1: 174, zone2: 361, zone3: 539, zone4: 686 },
]

/** Charged per extra kilogram above 5 kg, up to MAX_WEIGHT. */
const PER_EXTRA_KG = { zone1: 35, zone2: 60, zone3: 95, zone4: 120 }

const BASE_SLAB = RATES[RATES.length - 1]

/** Retail Speed Post Parcel is accepted up to 20 kg. */
const MAX_WEIGHT = 20

const ZONES = [
  { key: 'zone1', label: 'Zone 1 — Local', desc: 'Same city / local delivery' },
  { key: 'zone2', label: 'Zone 2 — Within State', desc: 'Same state, different city' },
  { key: 'zone3', label: 'Zone 3 — Zone / Metro', desc: 'Metro city to another metro city' },
  { key: 'zone4', label: 'Zone 4 — Other States', desc: 'Any other inter-state delivery' },
] as const

type ZoneKey = (typeof ZONES)[number]['key']

/**
 * Returns the slab rate for a weight, or null when the weight is outside
 * what Speed Post Parcel accepts.
 *
 * Above 5 kg there are no further published slabs, only a per-kilogram
 * increment, so 7.3 kg is billed as 5 kg + 3 increments = 8 kg of charge.
 */
function priceFor(weight: number, zone: ZoneKey): { amount: number; slabLabel: string; slabMax: number } | null {
  if (!(weight > 0) || weight > MAX_WEIGHT) return null

  const exact = RATES.find((r) => weight <= r.maxWeight)
  if (exact) return { amount: exact[zone], slabLabel: exact.label, slabMax: exact.maxWeight }

  const extraKg = Math.ceil(weight - BASE_SLAB.maxWeight)
  return {
    amount: BASE_SLAB[zone] + extraKg * PER_EXTRA_KG[zone],
    slabLabel: `${BASE_SLAB.label} + ${extraKg} kg`,
    slabMax: BASE_SLAB.maxWeight,
  }
}

export default function SpeedPostCalculator() {
  const [weight, setWeight] = useState('')
  const [zone, setZone] = useState<ZoneKey>('zone4')

  const w = parseFloat(weight)
  const result = priceFor(w, zone)
  const overLimit = w > MAX_WEIGHT

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            ⏱️ Speed Post Rate Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            India Post Speed Post Parcel retail charges by weight and destination zone.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          {/* Weight Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Parcel Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 2.5"
              min="0.1"
              max={MAX_WEIGHT}
              step="0.1"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-mono"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Maximum {MAX_WEIGHT} kg for Speed Post Parcel. Heavier consignments must go as
              India Post Parcel or through a courier.
            </p>
          </div>

          {/* Zone Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Destination Zone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ZONES.map((z) => (
                <label
                  key={z.key}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    zone === z.key
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="zone"
                    value={z.key}
                    checked={zone === z.key}
                    onChange={() => setZone(z.key)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{z.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{z.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Result */}
          {result ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Speed Post Parcel rate</p>
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                ₹{result.amount}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                {w} kg slab ({result.slabLabel}) • {ZONES.find((z) => z.key === zone)?.label}
              </p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-3">
                Base postage only, excluding GST. Registration, insurance and proof-of-delivery
                are charged separately. Confirm the final amount at your post office.
              </p>
            </div>
          ) : (
            <div
              className={`p-6 rounded-2xl border text-center ${
                overLimit
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
              }`}
            >
              <p className="text-slate-500 dark:text-slate-400">
                {overLimit
                  ? `Speed Post Parcel is not accepted above ${MAX_WEIGHT} kg. Use India Post Parcel for heavier items.`
                  : 'Enter weight and select zone to see rates'}
              </p>
            </div>
          )}
        </div>

        {/* Rate Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Complete Rate Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Weight slab</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Local</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Within State</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Zone / Metro</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Other States</th>
                </tr>
              </thead>
              <tbody>
                {RATES.map((r) => (
                  <tr
                    key={r.maxWeight}
                    className={`border-b border-slate-100 dark:border-slate-700/50 ${
                      result?.slabMax === r.maxWeight && result.slabLabel === r.label
                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                        : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-900 dark:text-slate-50">
                      {r.label}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone1}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone2}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone3}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone4}</td>
                  </tr>
                ))}
                <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50">
                  <td className="py-2 px-3 text-slate-900 dark:text-slate-50">
                    Each additional kg <span className="text-xs text-slate-500">(to {MAX_WEIGHT} kg)</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{PER_EXTRA_KG.zone1}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{PER_EXTRA_KG.zone2}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{PER_EXTRA_KG.zone3}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{PER_EXTRA_KG.zone4}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            India Post Speed Post Parcel (retail) tariff, effective 1 August 2026 per
            S.O. 4241(E) in the Gazette of India dated 31 July 2026. Figures exclude GST.
            Contractual and bulk rates differ. Prices are set by India Post and can change
            without notice — verify at your post office before dispatch.
          </p>
        </div>
      </div>
    </div>
  )
}

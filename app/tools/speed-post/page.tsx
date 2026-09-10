'use client'

import { useState } from 'react'
import { Metadata } from 'next'

// India Post Speed Post rates (as of 2024-2025)
// Zone 1: Within city, Zone 2: Within state, Zone 3: Metro to metro, Zone 4: Rest of India
const RATES = [
  { maxWeight: 0.5,  zone1: 15,  zone2: 25,  zone3: 35,  zone4: 45 },
  { maxWeight: 1,    zone1: 25,  zone2: 40,  zone3: 55,  zone4: 65 },
  { maxWeight: 2,    zone1: 30,  zone2: 50,  zone3: 65,  zone4: 80 },
  { maxWeight: 3,    zone1: 35,  zone2: 60,  zone3: 80,  zone4: 100 },
  { maxWeight: 5,    zone1: 50,  zone2: 80,  zone3: 100, zone4: 120 },
  { maxWeight: 10,   zone1: 75,  zone2: 110, zone3: 140, zone4: 170 },
  { maxWeight: 20,   zone1: 100, zone2: 150, zone3: 190, zone4: 230 },
  { maxWeight: 30,   zone1: 130, zone2: 190, zone3: 240, zone4: 300 },
  { maxWeight: 50,   zone1: 180, zone2: 260, zone3: 320, zone4: 400 },
]

const ZONES = [
  { key: 'zone1', label: 'Zone 1 — Within City', desc: 'Same city/local area delivery' },
  { key: 'zone2', label: 'Zone 2 — Within State', desc: 'Same state, different city' },
  { key: 'zone3', label: 'Zone 3 — Metro to Metro', desc: 'Metro city to another metro city' },
  { key: 'zone4', label: 'Zone 4 — Rest of India', desc: 'Any other inter-state delivery' },
] as const

type ZoneKey = typeof ZONES[number]['key']

export default function SpeedPostCalculator() {
  const [weight, setWeight] = useState('')
  const [zone, setZone] = useState<ZoneKey>('zone4')

  const w = parseFloat(weight)
  const rate = w > 0 ? RATES.find((r) => w <= r.maxWeight) : null

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            ⏱️ Speed Post Rate Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Estimate India Post Speed Post charges by weight and destination zone.
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
              max="50"
              step="0.1"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg font-mono"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Maximum weight: 50 kg. For items over 50 kg, contact your local post office.
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
          {rate ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Estimated Speed Post Rate</p>
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                ₹{rate[zone]}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                For {w} kg parcel • {ZONES.find((z) => z.key === zone)?.label}
              </p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-3">
                * Rates are indicative. Actual charges may vary. Additional charges may apply for
                insurance, registration, or special handling. Verify at your local post office.
              </p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                Enter weight and select zone to see estimated rates
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
                  <th className="text-left py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Weight</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Zone 1</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Zone 2</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Zone 3</th>
                  <th className="text-right py-2 px-3 text-slate-500 dark:text-slate-400 font-medium">Zone 4</th>
                </tr>
              </thead>
              <tbody>
                {RATES.map((r) => (
                  <tr
                    key={r.maxWeight}
                    className={`border-b border-slate-100 dark:border-slate-700/50 ${
                      rate?.maxWeight === r.maxWeight
                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                        : ''
                    }`}
                  >
                    <td className="py-2 px-3 font-mono text-slate-900 dark:text-slate-50">
                      {r.maxWeight} kg
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone1}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone2}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone3}</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">₹{r.zone4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            Rates effective from April 2024. Subject to revision by India Post.
          </p>
        </div>
      </div>
    </div>
  )
}

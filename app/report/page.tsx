'use client'

import { useState } from 'react'

type ReportType = 'pincode' | 'ifsc' | 'other'

export default function ReportPage() {
  const [type, setType] = useState<ReportType>('pincode')
  const [code, setCode] = useState('')
  const [details, setDetails] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`[Multisheets] Data Correction: ${code || type}`)
    const body = encodeURIComponent(
      `Type: ${type}\nCode/Reference: ${code}\nYour email: ${email}\n\nIssue:\n${details}`
    )
    window.location.href = `mailto:data@multisheets.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Report a Correction
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Spot an error in our PIN code or IFSC data? Tell us and we&apos;ll fix it quickly.
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-center">
            <p className="text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-2">
              ✓ Your email app should have opened
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              If not, email the details directly to data@multisheets.com
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition"
            >
              Report another issue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                What type of record?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { key: 'pincode', label: '📮 PIN Code' },
                  { key: 'ifsc', label: '🏦 IFSC Code' },
                  { key: 'other', label: 'Other' },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setType(opt.key)}
                    aria-pressed={type === opt.key}
                    className={`p-3 rounded-xl border text-sm font-medium transition ${
                      type === opt.key
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {type === 'pincode' ? 'PIN code or office name' : type === 'ifsc' ? 'IFSC code or branch' : 'Page / reference'}
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={type === 'pincode' ? 'e.g. 331803' : type === 'ifsc' ? 'e.g. SBIN0001234' : 'e.g. Homepage'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                What&apos;s wrong?
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the error and, if possible, what the correct value should be."
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email (optional — for follow-up)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
            >
              Submit Correction
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              This opens your email app with a pre-filled report. We review every submission.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
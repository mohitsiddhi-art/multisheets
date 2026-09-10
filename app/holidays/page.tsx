import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 India Post Gazetted Holidays — Complete Calendar',
  description:
    'Official 2026 gazetted holidays for India Post / Postal Department. Plan ahead with Republic Day, Holi, Diwali, Independence Day and all central government holidays.',
}

const holidays = [
  // Gazetted (mandatory for central govt)
  { date: '2026-01-26', day: 'Mon', name: 'Republic Day', type: 'gazetted' },
  { date: '2026-03-03', day: 'Tue', name: 'Holi', type: 'gazetted' },
  { date: '2026-03-26', day: 'Thu', name: 'Ram Navami', type: 'gazetted' },
  { date: '2026-04-03', day: 'Fri', name: 'Good Friday', type: 'gazetted' },
  { date: '2026-04-14', day: 'Tue', name: 'Dr. Ambedkar Jayanti', type: 'gazetted' },
  { date: '2026-04-14', day: 'Tue', name: 'Vaisakhi / Tamil New Year', type: 'gazetted' },
  { date: '2026-05-01', day: 'Fri', name: 'Buddha Purnima', type: 'gazetted' },
  { date: '2026-05-27', day: 'Wed', name: 'Eid al-Adha (Bakrid)', type: 'gazetted' },
  { date: '2026-06-26', day: 'Fri', name: 'Muharram', type: 'gazetted' },
  { date: '2026-08-15', day: 'Sat', name: 'Independence Day', type: 'gazetted' },
  { date: '2026-08-19', day: 'Wed', name: 'Janmashtami', type: 'gazetted' },
  { date: '2026-09-05', day: 'Sat', name: 'Milad-un-Nabi (Id-e-Milad)', type: 'gazetted' },
  { date: '2026-10-02', day: 'Fri', name: 'Gandhi Jayanti', type: 'gazetted' },
  { date: '2026-10-20', day: 'Tue', name: 'Dussehra (Vijaya Dashami)', type: 'gazetted' },
  { date: '2026-11-08', day: 'Sun', name: 'Diwali (Deepavali)', type: 'gazetted' },
  { date: '2026-11-24', day: 'Tue', name: 'Guru Nanak Jayanti', type: 'gazetted' },
  { date: '2026-12-25', day: 'Fri', name: 'Christmas Day', type: 'gazetted' },

  // Notable restricted/regional (for reference)
  { date: '2026-01-14', day: 'Wed', name: 'Makar Sankranti / Pongal', type: 'restricted' },
  { date: '2026-02-15', day: 'Sun', name: 'Maha Shivaratri', type: 'restricted' },
  { date: '2026-03-20', day: 'Fri', name: 'Idul Fitr', type: 'restricted' },
  { date: '2026-04-01', day: 'Wed', name: 'Odisha Day', type: 'restricted' },
  { date: '2026-04-30', day: 'Thu', name: 'Mahavir Jayanti', type: 'restricted' },
  { date: '2026-08-28', day: 'Fri', name: 'Raksha Bandhan', type: 'restricted' },
  { date: '2026-09-04', day: 'Fri', name: 'Janmashtami (Smarta)', type: 'restricted' },
  { date: '2026-09-14', day: 'Mon', name: 'Ganesh Chaturthi', type: 'restricted' },
  { date: '2026-10-10', day: 'Sat', name: 'Maha Saptami', type: 'restricted' },
  { date: '2026-10-18', day: 'Sun', name: 'Maha Ashtami', type: 'restricted' },
  { date: '2026-10-19', day: 'Mon', name: 'Maha Navami', type: 'restricted' },
  { date: '2026-11-09', day: 'Mon', name: 'Govardhan Puja', type: 'restricted' },
  { date: '2026-11-11', day: 'Wed', name: 'Bhai Dooj', type: 'restricted' },
  { date: '2026-11-15', day: 'Sun', name: 'Chhath Puja', type: 'restricted' },
]

function formatDate(d: string) {
  const [y, m, d2] = d.split('-')
  return `${d2}/${m}/${y.slice(2)}`
}

function formatMonth(d: string) {
  const [, m] = d.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return names[Number(m) - 1]
}

function formatDay(d: string) {
  const [, , d2] = d.split('-')
  return d2
}

export default function HolidaysPage() {
  // Group by month
  const byMonth = new Map<string, typeof holidays>()
  for (const h of holidays) {
    const m = formatMonth(h.date)
    const arr = byMonth.get(m) || []
    arr.push(h)
    byMonth.set(m, arr)
  }

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            📅 2026 India Post Gazetted Holidays
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
            Official central government gazetted holidays for the Postal Department. Restricted holidays are shown for reference — employees may choose 2 per year.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-700 dark:text-slate-300">Gazetted (mandatory)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300">Restricted (optional)</span>
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {Array.from(byMonth.entries())
            .sort((a, b) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(a[0]) - ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(b[0]))
            .map(([month, list]) => (
              <section key={month} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900/60 px-5 py-3 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{month} 2026</h2>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {list.map((h, i) => (
                    <div
                      key={`${h.date}-${i}`}
                      className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition"
                    >
                      <div className="flex items-center gap-4 min-w-[180px] sm:min-w-0">
                        <div className="flex flex-col items-center text-center shrink-0 w-20 bg-primary/5 dark:bg-blue-500/10 rounded-xl py-2 px-2">
                          <span className="text-2xl font-bold text-primary dark:text-blue-400">{formatDay(h.date)}</span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 uppercase">{h.day}</span>
                        </div>
                        <span className="text-base font-medium text-slate-900 dark:text-slate-50">{h.name}</span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                          h.type === 'gazetted'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                        }`}
                      >
                        {h.type === 'gazetted' ? 'Gazetted' : 'Restricted'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Notes */}
        <div className="mt-10 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">📋 Important Notes</h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• <strong>Gazetted holidays</strong> are mandatory for all central government offices including India Post.</li>
            <li>• <strong>Restricted holidays</strong> are optional — employees may avail <strong>2 restricted holidays</strong> per calendar year.</li>
            <li>• Dates for lunar festivals (Holi, Eid, Diwali, etc.) are based on the 2026 Hindu calendar and may vary by ±1 day depending on moon sighting.</li>
            <li>• Confirm with your <strong>Circle/Divisional Office</strong> for any local variations or additional holidays.</li>
            <li>• Source: Ministry of Personnel, Public Grievances & Pensions (DoPT) Gazette Notification for 2026.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
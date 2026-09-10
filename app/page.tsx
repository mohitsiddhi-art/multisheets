import { Metadata } from 'next'
import Link from 'next/link'
import SearchBox from '@/components/SearchBox'
import { getDatasetStats } from '@/lib/india-data'

export const metadata: Metadata = {
  title: 'Multisheets — Indian PIN Code & IFSC Code Lookup',
  description:
    'Find Indian PIN codes, Post Offices, IFSC codes, and Bank Branches instantly with Unified Smart Search. Free tool for students, businesses, and bank customers.',
}

const toolCards = [
  {
    title: 'PIN Code Finder',
    desc: 'Find post office details, district and delivery status',
    href: '/tools/pincode-finder',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21 10V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" />
        <path d="M3 10h18" />
        <path d="M15 3v6" />
        <path d="M12 16v6" />
        <path d="M9 16v6" />
        <circle cx="12" cy="19" r="3" />
      </svg>
    ),
  },
  {
    title: 'IFSC Code Finder',
    desc: 'Find bank branch details, MICR and contact info',
    href: '/tools/ifsc-finder',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
        <path d="M6 4v16" />
      </svg>
    ),
  },
  {
    title: 'Speed Post Calculator',
    desc: 'Estimate Speed Post rates by weight and zone',
    href: '/tools/speed-post',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: 'PIN Code Validator',
    desc: 'Validate and format Indian PIN codes',
    href: '/tools/pincode-validator',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: 'IFSC Code Validator',
    desc: 'Validate IFSC and read its meaning',
    href: '/tools/ifsc-validator',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M9 12h6" />
        <path d="M12 9v6" />
      </svg>
    ),
  },
]

const stats = getDatasetStats()

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-5 dark:from-primary/10 dark:to-emerald-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              100,000+ PIN codes • 164,000+ IFSC codes • Instant search
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-6">
              Find Indian PIN codes & IFSC codes <span className="text-primary">instantly</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Unified Smart Search across postal and banking datasets. No ads, no login, works offline.
            </p>

            {/* Search Box */}
            <SearchBox initialQuery="" />

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="text-3xl font-bold text-primary">{stats.pincodes.toLocaleString()}+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Postal Codes</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.branches.toLocaleString()}+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bank Branches</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.states}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">States & UTs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 sm:py-24 bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Popular Tools
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Quick utilities for everyday postal and banking needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolCards.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary dark:group-hover:text-slate-900 transition-colors">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  {tool.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{tool.desc}</p>
                <span className="text-primary font-medium text-sm group-hover:underline">
                  Open tool →
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-xl font-medium hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-slate-900 transition"
            >
              Browse all tools
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Why Multisheets?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built for speed, accuracy, and everyday utility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
              title="Lightning Fast"
              desc="Client + server hybrid search returns results in under 100ms across 164,000+ records."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              }
              title="Bilingual UI"
              desc="Full English / Hindi interface toggle. Devanagari font rendering for Hindi content."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              }
              title="Dark & Light Mode"
              desc="System-aware theme with manual toggle. Persisted in localStorage, no flash on load."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              title="Privacy First"
              desc="No tracking, no analytics, no cookies. Your searches stay in your browser."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              }
              title="Installable PWA"
              desc="Add to home screen on mobile. Works offline with cached search data."
            />
            <FeatureCard
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
              title="Share & Copy"
              desc="One-click copy for PIN/IFSC/MICR. Share via WhatsApp, Telegram, X, or copy link."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to search?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Try the Unified Smart Search now — find any PIN code or IFSC code in seconds.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition text-lg"
          >
            Start Searching
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition">
      <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{desc}</p>
    </div>
  )
}
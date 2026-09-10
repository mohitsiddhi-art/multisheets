import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tools — Multisheets',
  description: 'Free postal and banking utility tools: Speed Post Calculator, PIN Code Validator, IFSC Code Validator, and more.',
}

const tools = [
  {
    title: 'PIN Code Finder',
    desc: 'Find post office details, district and delivery status by PIN code',
    href: '/tools/pincode-finder',
    icon: '📮',
    category: 'Lookup',
  },
  {
    title: 'IFSC Code Finder',
    desc: 'Find bank branch details, MICR, contact, and transfer support',
    href: '/tools/ifsc-finder',
    icon: '🏦',
    category: 'Lookup',
  },
  {
    title: 'Bank Locator',
    desc: 'Find all banks near a location using PIN code',
    href: '/tools/bank-locator',
    icon: '📍',
    category: 'Lookup',
  },
  {
    title: 'Speed Post Calculator',
    desc: 'Estimate Speed Post rates by weight and destination zone',
    href: '/tools/speed-post',
    icon: '⏱️',
    category: 'Calculator',
  },
  {
    title: 'PIN Code Validator',
    desc: 'Validate Indian PIN codes and decode zone information',
    href: '/tools/pincode-validator',
    icon: '✅',
    category: 'Validator',
  },
  {
    title: 'IFSC Code Validator',
    desc: 'Validate IFSC codes and understand their structure',
    href: '/tools/ifsc-validator',
    icon: '🔍',
    category: 'Validator',
  },
  {
    title: 'Address Validator',
    desc: 'Validate and format Indian addresses with PIN code verification',
    href: '/tools/address-validator',
    icon: '📮',
    category: 'Validator',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Postal & Banking Tools
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Free utilities for everyday postal and banking needs. No login required, works offline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 group-hover:text-primary transition">
                  {tool.title}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {tool.category}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

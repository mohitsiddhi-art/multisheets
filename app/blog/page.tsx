import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — Multisheets',
  description: 'Guides and articles about Indian PIN codes, IFSC codes, postal services, and banking.',
}

const POSTS = [
  {
    title: 'How to Find Your IFSC Code in 30 Seconds',
    slug: 'how-to-find-ifsc-code',
    desc: 'Four ways to find your bank branch IFSC code — on a cheque, in passbook, net banking, or right here.',
    date: '2026-08-28',
    tag: 'Banking',
  },
  {
    title: 'Understanding Indian PIN Codes: A Complete Guide',
    slug: 'understanding-pin-codes',
    desc: 'What the 6 digits mean, how zones work, and why 9xx xxx is special.',
    date: '2026-08-14',
    tag: 'Postal',
  },
  {
    title: 'Speed Post vs Regular Post: Which Should You Use?',
    slug: 'speed-post-vs-regular-post',
    desc: 'Delivery times, costs, and when each makes sense for your parcel.',
    date: '2026-07-30',
    tag: 'Postal',
  },
  {
    title: 'NEFT, RTGS, and IMPS: What Each Means for Your Transfers',
    slug: 'neft-rtgs-imps-guide',
    desc: 'The differences, limits, and timings for India’s three main electronic transfer systems.',
    date: '2026-07-16',
    tag: 'Banking',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            The Multisheets Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Guides and articles about PIN codes, IFSC codes, postal services, and banking in India.
          </p>
        </div>

        <div className="space-y-4">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-medium">
                  {post.tag}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{post.date}</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1 group-hover:text-primary transition">
                {post.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{post.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
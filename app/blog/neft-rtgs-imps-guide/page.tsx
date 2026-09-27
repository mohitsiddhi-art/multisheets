import { Metadata } from 'next'
import { canonical, articleJsonLd, breadcrumbJsonLd, JsonLdScript } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'NEFT, RTGS, and IMPS: What Each Means for Your Transfers — Multisheets',
  description: 'The differences between India’s three main electronic transfer systems — NEFT, RTGS, and IMPS — with limits, timings, and fees.',
  ...canonical('/blog/neft-rtgs-imps-guide'),
}

export default function NeftRtgsImpsGuide() {
  const description = metadata.description as string
  const article = articleJsonLd({
    title: 'NEFT, RTGS, and IMPS: What Each Means for Your Transfers',
    description,
    url: '/blog/neft-rtgs-imps-guide',
    datePublished: '2026-07-16',
  })
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'NEFT, RTGS, and IMPS: What Each Means for Your Transfers', url: '/blog/neft-rtgs-imps-guide' },
  ])
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <JsonLdScript data={article} />
        <JsonLdScript data={breadcrumb} />
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-medium">NEFT, RTGS, and IMPS</span>
        </nav>

        <div className="mb-6">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-medium">
            Banking
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mt-3 mb-3">
            NEFT, RTGS, and IMPS: What Each Means for Your Transfers
          </h1>
          <p className="text-slate-500 dark:text-slate-400">16 July 2026</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            India has three main electronic fund transfer systems. They sound similar, but they differ
            in speed, limits, and when you can use them. Understanding the difference helps you pick the
            right one — and avoid unnecessary fees.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">NEFT (National Electronic Funds Transfer)</h2>
          <p>
            <strong>Best for:</strong> everyday transfers under ₹2 lakh.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Runs in half-hourly batches, 24×7 since December 2019</li>
            <li>Usually free or very cheap at most banks</li>
            <li>Funds settle within the batch window — typically minutes to an hour</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">RTGS (Real Time Gross Settlement)</h2>
          <p>
            <strong>Best for:</strong> large transfers, ₹2 lakh and above.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Processes each transfer individually — no batching</li>
            <li>Settles in near real-time during banking hours</li>
            <li>Minimum amount is ₹2 lakh, no upper limit</li>
            <li>May carry a modest fee depending on your bank</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">IMPS (Immediate Payment Service)</h2>
          <p>
            <strong>Best for:</strong> instant money movement, anytime, day or night.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Transfers settle immediately — even on weekends and holidays</li>
            <li>Uses MMID or just the beneficiary&apos;s mobile + account number</li>
            <li>Per-transaction limits vary by bank (typically up to ₹5 lakh)</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Quick comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">NEFT</th>
                  <th className="py-2 pr-3">RTGS</th>
                  <th className="py-2">IMPS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-2 pr-3">Speed</td>
                  <td className="py-2 pr-3">Batch (min)</td>
                  <td className="py-2 pr-3">Real-time</td>
                  <td className="py-2">Instant</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-2 pr-3">Min amount</td>
                  <td className="py-2 pr-3">₹1</td>
                  <td className="py-2 pr-3">₹2,00,000</td>
                  <td className="py-2">₹1</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3">Max amount</td>
                  <td className="py-2 pr-3">No limit</td>
                  <td className="py-2 pr-3">No limit</td>
                  <td className="py-2">Bank-dependent</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Whichever method you use, you&apos;ll need the recipient&apos;s IFSC code. Look it up instantly in
            our search below.
          </p>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
          >
            Find an IFSC code →
          </Link>
        </div>
      </article>
    </div>
  )
}
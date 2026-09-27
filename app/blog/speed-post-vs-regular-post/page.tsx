import { Metadata } from 'next'
import { canonical, articleJsonLd, breadcrumbJsonLd, JsonLdScript } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Speed Post vs Regular Post: Which Should You Use? — Multisheets',
  description: 'Compare Speed Post and regular (bulk/parcel) post in India — delivery times, costs, tracking, and when each makes sense.',
  ...canonical('/blog/speed-post-vs-regular-post'),
}

export default function SpeedPostVsRegular() {
  const description = metadata.description as string
  const article = articleJsonLd({
    title: 'Speed Post vs Regular Post: Which Should You Use?',
    description,
    url: '/blog/speed-post-vs-regular-post',
    datePublished: '2026-07-30',
  })
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Speed Post vs Regular Post: Which Should You Use?', url: '/blog/speed-post-vs-regular-post' },
  ])
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <JsonLdScript data={article} />
        <JsonLdScript data={breadcrumb} />
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-medium">Speed Post vs Regular Post</span>
        </nav>

        <div className="mb-6">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-medium">
            Postal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mt-3 mb-3">
            Speed Post vs Regular Post: Which Should You Use?
          </h1>
          <p className="text-slate-500 dark:text-slate-400">30 July 2026</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            India Post offers two main ways to send letters and parcels: <strong>Speed Post</strong> and
            <strong> regular post</strong> (ordinary/bulk/parcel post). Here is how they compare.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Delivery time</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Speed Post:</strong> 1–3 days for metro-to-metro, 3–5 days for most other routes.</li>
            <li><strong>Regular post:</strong> 3–10 days depending on route and how rural the destination is.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Cost</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Speed Post Parcel:</strong> from ₹28 for a local consignment up to 500 g, and ₹90 for the same weight to another state, under the retail tariff effective 1 August 2026. GST is charged on top.</li>
            <li><strong>Regular post:</strong> usually cheaper for non-urgent documents and small parcels.</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Tracking</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Speed Post:</strong> includes an article number and online tracking.</li>
            <li><strong>Regular post:</strong> no tracking (Registered Post adds a receipt but limited tracking).</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">When to use which</h2>
          <p><strong>Use Speed Post</strong> when documents are time-sensitive — exam forms, important letters, legal papers, or parcels you want to track. It&apos;s also a good default for business shipping within India.</p>
          <p><strong>Use regular post</strong> for birthday cards, magazines, and low-value parcels where speed doesn&apos;t matter and you want to save money.</p>

          <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
            <p className="text-slate-700 dark:text-slate-300">
              💡 Use our{' '}
              <Link href="/tools/speed-post" className="text-primary hover:underline">Speed Post rate calculator</Link>{' '}
              to estimate charges by weight and destination zone.
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}
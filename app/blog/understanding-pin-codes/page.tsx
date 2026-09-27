import { Metadata } from 'next'
import { canonical, articleJsonLd, breadcrumbJsonLd, howToJsonLd, JsonLdScript } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Understanding Indian PIN Codes: A Complete Guide — Multisheets',
  description: 'What the 6 digits of an Indian PIN code mean, how postal zones work, and why APS codes start with 9.',
  ...canonical('/blog/understanding-pin-codes'),
}

export default function UnderstandingPincodes() {
  const description = metadata.description as string
  const article = articleJsonLd({
    title: 'Understanding Indian PIN Codes: A Complete Guide',
    description,
    url: '/blog/understanding-pin-codes',
    datePublished: '2026-08-14',
  })
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Understanding Indian PIN Codes: A Complete Guide', url: '/blog/understanding-pin-codes' },
  ])
  const howTo = howToJsonLd({
    name: 'How to read an Indian PIN code',
    description,
    steps: [
      { name: 'Identify the first digit (postal zone)', text: 'The first digit marks the postal zone — India has 9 zones (8 geographic plus the Army Postal Service).' },
      { name: 'Identify the first two digits (sub-zone)', text: 'The first two digits together identify the sub-zone within that zone.' },
      { name: 'Identify the first three digits (sorting district)', text: 'The first three digits identify the sorting district within the sub-zone.' },
      { name: 'Identify the last three digits (delivery post office)', text: 'The last three digits identify the specific delivery post office within the sorting district.' },
    ],
  })
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <JsonLdScript data={article} />
        <JsonLdScript data={breadcrumb} />
        <JsonLdScript data={howTo} />
        <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-primary transition">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-medium">Understanding Indian PIN Codes</span>
        </nav>

        <div className="mb-6">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-medium">
            Postal
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mt-3 mb-3">
            Understanding Indian PIN Codes: A Complete Guide
          </h1>
          <p className="text-slate-500 dark:text-slate-400">14 August 2026</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            India is the second most populous country on Earth, with hundreds of thousands of post
            offices. To make sure every letter reaches the right place, India Post uses a 6-digit
            Postal Index Number (PIN) code.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">What does PIN actually stand for?</h2>
          <p>
            PIN stands for <strong>Postal Index Number</strong>. It was introduced on 15 August 1972
            to replace the older, slower system of sorting mail by hand-written addresses.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">What the 6 digits mean</h2>
          <div className="space-y-3">
            <p><strong>First digit</strong> — The postal zone. India is divided into 9 zones (8 geographic + Army Postal Service):</p>
            <ul className="list-disc list-inside space-y-1">
              <li>1 — Delhi, Haryana, Punjab, HP, J&K</li>
              <li>2 — Uttar Pradesh, Uttarakhand</li>
              <li>3 — Rajasthan, Gujarat</li>
              <li>4 — Maharashtra, MP, Goa</li>
              <li>5 — Andhra Pradesh, Karnataka</li>
              <li>6 — Tamil Nadu, Kerala</li>
              <li>7 — West Bengal, Odisha, Northeast</li>
              <li>8 — Bihar, Jharkhand</li>
              <li>9 — Army Postal Service (APS)</li>
            </ul>
            <p><strong>First two digits</strong> — The sub-zone within that zone.</p>
            <p><strong>First three digits</strong> — The sorting district.</p>
            <p><strong>Last three digits</strong> — The delivery post office within that district.</p>
          </div>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Why 9xx xxx is special</h2>
          <p>
            PIN codes starting with 9 belong to the Army Postal Service (APS), which delivers mail to
            army personnel including remote and field post offices.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Fun fact</h2>
          <p>
            There are roughly 19,100 unique PIN codes in India serving well over 160,000 post offices.
            The busiest PIN areas are typically in metropolitan districts like Mumbai, Delhi, and Bengaluru.
          </p>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
          >
            Look up a PIN code →
          </Link>
        </div>
      </article>
    </div>
  )
}
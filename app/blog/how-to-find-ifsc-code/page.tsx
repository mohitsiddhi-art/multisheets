import { Metadata } from 'next'
import { canonical, articleJsonLd, breadcrumbJsonLd, howToJsonLd, JsonLdScript } from '@/lib/seo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Find Your IFSC Code in 30 Seconds — Multisheets',
  description: 'Four ways to find your bank branch IFSC code — on a cheque, in your passbook, via net banking, or using a search engine.',
  ...canonical('/blog/how-to-find-ifsc-code'),
}

export default function HowToFindIfsc() {
  const description = metadata.description as string
  const article = articleJsonLd({
    title: 'How to Find Your IFSC Code in 30 Seconds',
    description,
    url: '/blog/how-to-find-ifsc-code',
    datePublished: '2026-08-28',
  })
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'How to Find Your IFSC Code in 30 Seconds', url: '/blog/how-to-find-ifsc-code' },
  ])
  const howTo = howToJsonLd({
    name: 'How to Find Your IFSC Code in 30 Seconds',
    description,
    steps: [
      { name: 'On a cheque leaf', text: 'Look at the left-hand side of your cheque leaf, just below the MICR number, where the IFSC is printed.' },
      { name: 'In your passbook', text: 'Open your passbook to the first page, where the IFSC appears alongside your account number and branch address.' },
      { name: 'Net banking or the bank app', text: 'Log in to net banking and open Account Details or Branch Details; on mobile apps, check under Profile or Account Information.' },
      { name: 'Use a search engine', text: 'Search for your bank name and branch on Multisheets to instantly find the matching IFSC code.' },
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
          <span className="text-slate-900 dark:text-slate-50 font-medium">How to Find Your IFSC Code</span>
        </nav>

        <div className="mb-6">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-medium">
            Banking
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mt-3 mb-3">
            How to Find Your IFSC Code in 30 Seconds
          </h1>
          <p className="text-slate-500 dark:text-slate-400">28 August 2026</p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
          <p>
            The IFSC (Indian Financial System Code) is required for almost every electronic transfer —
            NEFT, RTGS, IMPS, and UPI settlements. Yet most people have no idea where to look. Here are
            the four fastest ways to find it.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">1. On a cheque leaf</h2>
          <p>
            The IFSC code is printed on the left-hand side of your cheque leaf, just below the MICR
            number. It always starts with four letters (the bank code), followed by a zero, then six
            characters for the branch.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">2. In your passbook</h2>
          <p>
            Banks print the IFSC code on the first page of the passbook, usually along with your account
            number and the branch address.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">3. Net banking or the bank&apos;s app</h2>
          <p>
            Log in to net banking and look for &quot;Account Details&quot; or &quot;Branch Details&quot;. On mobile apps,
            it&apos;s usually under &quot;Profile&quot; or &quot;Account Information&quot;.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">4. Use a search engine</h2>
          <p>
            If you know your bank name and branch, you can look up the IFSC in seconds on Multisheets.
            Search for the bank name or a partial IFSC and we&apos;ll show the matching branches instantly.
          </p>

          <div className="p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
            <p className="text-slate-700 dark:text-slate-300">
              💡 Pro tip: Always double-check the IFSC before transferring money. A single wrong
              character can send your payment to the wrong branch.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition"
          >
            Search for an IFSC →
          </Link>
        </div>
      </article>
    </div>
  )
}
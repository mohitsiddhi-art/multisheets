import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Multisheets',
  description: 'Multisheets is a free Indian PIN code and IFSC code lookup platform with 164,000+ records.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          About Multisheets
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">What we do</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Multisheets is a free, ad-free platform for looking up Indian Postal (PIN) codes and
              Bank (IFSC) codes. We combine two datasets — over 17,700 post offices and over
              164,000 bank branches — into a single Unified Smart Search.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
              Instead of bouncing between two separate websites, you can type a PIN code, an IFSC
              code, a branch name, or even a city — and get complete results in under 100 milliseconds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Why Multisheets?</h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li><strong>One search, two worlds</strong> — postal and banking data in a single query</li>
              <li><strong>100% free</strong> — no signup, no login, no paywalls</li>
              <li><strong>Privacy-first</strong> — no tracking, no cookies, no analytics</li>
              <li><strong>Bilingual</strong> — full English and Hindi interface</li>
              <li><strong>Works offline</strong> — installable as a Progressive Web App</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Our data</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Our postal dataset covers post offices across all 28 states, 8 Union Territories, and
              Army Postal Service (APS) locations. Our banking dataset covers public sector banks,
              private banks, foreign banks, regional rural banks, and cooperative banks.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
              Data is sourced from official India Post and RBI records (via open datasets) and is
              refreshed on a regular basis. If you spot an error, use the{' '}
              <a href="/report" className="text-primary hover:underline">Report a Correction</a> page
              and we&apos;ll fix it quickly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Contact</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Questions, feedback, or partnership ideas? Reach out on our{' '}
              <a href="/contact" className="text-primary hover:underline">Contact</a> page.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
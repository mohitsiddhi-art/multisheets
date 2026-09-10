import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Multisheets',
  description: 'Multisheets privacy policy — we collect no data, use no trackers, and respect your privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">The short version</h2>
            <p>
              Multisheets collects <strong>no personal data</strong>. We use no analytics, no tracking
              pixels, no advertising cookies, and no third-party embeds that watch you. Your searches
              never leave your device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">What we store</h2>
            <p>
              We use your browser&apos;s local storage solely to remember your preferences:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Theme preference (dark / light)</li>
              <li>Language preference (English / Hindi)</li>
              <li>Your recent search history (so you can re-run them)</li>
              <li>Your saved/favorite records</li>
            </ul>
            <p className="mt-2">
              Everything is stored locally in your browser. Nothing is transmitted to us. You can
              clear it any time from your browser&apos;s settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Server logs</h2>
            <p>
              Like most websites, our hosting provider may record basic technical logs (IP address,
              browser type, pages requested) for operational security and abuse prevention. These logs
              are not sold, shared, or used for marketing, and are retained no longer than necessary.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Contact forms</h2>
            <p>
              Our contact and report-a-correction forms open a pre-filled email in your own email
              application. We never see or store the contents before you send them. If you email us,
              we only use your details to respond to your query and never share them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Third-party links</h2>
            <p>
              Our site may link to external websites (e.g. official postal or bank portals). Those
              sites have their own privacy policies; we are not responsible for them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">Changes</h2>
            <p>
              If we ever change how we handle data, we will update this page and note the revision date.
            </p>
          </section>

          <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
            Last updated: September 2026
          </p>
        </div>
      </div>
    </div>
  )
}
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Multisheets',
  description: 'Multisheets terms of service — the rules governing your use of the site.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Terms of Service
        </h1>

        <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">1. Acceptance of terms</h2>
            <p>
              By accessing or using Multisheets (&quot;the Website&quot;), you agree to be bound by these
              Terms of Service. If you do not agree with any part of these terms, please refrain from
              using the Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">2. Use of data</h2>
            <p>
              All information provided on the Website is for general information and reference purposes
              only. We strive for accuracy but cannot guarantee that information is complete, current,
              or error-free. Always verify critical details with official sources — particularly
              banking details before initiating fund transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">3. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Scrape, republish, or redistribute our data at scale for commercial purposes without permission</li>
              <li>Attempt to disrupt, overload, or gain unauthorised access to our servers</li>
              <li>Use the Website in any way that violates applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">4. No warranties</h2>
            <p>
              The Website is provided &quot;as is&quot; and &quot;as available&quot; without any warranty of any
              kind, whether expressed or implied. We do not warrant that the service will be
              uninterrupted, timely, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">5. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Multisheets and its operators shall not be liable
              for any indirect, incidental, special, consequential, or punitive damages, or any loss of
              profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses, resulting from the use or inability to use the Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">6. Intellectual property</h2>
            <p>
              The design, layout, and original content of the Website are owned by Multisheets and
              protected by applicable copyright laws. The underlying postal and banking data remains
              the property of its respective owners (India Post, RBI, banks).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">7. Changes to terms</h2>
            <p>
              We may revise these terms at any time. Continued use of the Website after any changes
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">8. Contact</h2>
            <p>
              For questions about these terms, contact us via the{' '}
              <a href="/contact" className="text-primary hover:underline">Contact page</a>.
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
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer — Multisheets',
  description: 'Multisheets disclaimer — data accuracy, third-party information, and usage terms.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">
          Disclaimer
        </h1>

        <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">1. Data accuracy</h2>
            <p>
              Multisheets aggregates information from publicly available sources including India Post
              and RBI datasets. While we make every effort to keep the data accurate and up-to-date,
              we make no representations or warranties of any kind, express or implied, about the
              completeness, accuracy, reliability, suitability, or availability of the information
              shown on this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">2. Not an official source</h2>
            <p>
              Multisheets is an independent utility platform. We are not affiliated with, endorsed by,
              or connected to India Post, the Reserve Bank of India (RBI), or any bank. Always verify
              critical information — such as IFSC codes before initiating fund transfers — with the
              official website of the respective bank or institution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">3. Financial decisions</h2>
            <p>
              The IFSC, MICR, account routing, and other banking details provided here are for
              reference only. Using incorrect details for fund transfers can result in loss of money.
              We strongly recommend visiting your bank&apos;s official website or contacting their
              branch to confirm any code before making a transaction. Multisheets is not liable for
              any loss arising from reliance on the information provided.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">4. Speed Post rates</h2>
            <p>
              Speed Post rate estimates are indicative and based on published tariff tables. Actual
              charges are determined by India Post and may change without notice. Always confirm rates
              at your local post office.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">5. External links</h2>
            <p>
              Our website may contain links to external websites that are not provided or maintained
              by us. We do not control and are not responsible for the content or privacy practices of
              those sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">6. Limitation of liability</h2>
            <p>
              In no event will Multisheets be liable for any loss or damage including without
              limitation, indirect or consequential loss or damage, or any loss or damage whatsoever
              arising from loss of data or profits arising out of, or in connection with, the use of
              this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">7. Changes to this disclaimer</h2>
            <p>
              We may update this disclaimer from time to time. Any changes will be posted on this page.
              Continued use of the site after changes constitutes acceptance of the revised terms.
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
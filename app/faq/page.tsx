import type { Metadata } from 'next'
import {
  canonical,
  faqJsonLd,
  breadcrumbJsonLd,
  datasetJsonLd,
  definedTermJsonLd,
  JsonLdScript,
} from '@/lib/seo'
import { FAQS } from '@/lib/faqs'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Answers to common questions about Indian PIN codes, IFSC codes, post offices, bank branches, and how Multisheets works.',
  ...canonical('/faq'),
}

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      {/*
        The Dataset block is the one that matters most for AI search.
        It tells an assistant that this site is an authoritative,
        attributable source of Indian postal and banking codes, rather
        than a page of prose it might paraphrase without citing.
      */}
      <JsonLdScript
        data={datasetJsonLd({
          name: 'Indian PIN Code and IFSC Code Directory',
          description:
            'A free, citable directory of Indian PIN codes and bank branch IFSC codes, with post office, district, state, MICR, and transfer-method details for each record.',
          url: '/',
          keywords: [
            'pin code',
            'ifsc code',
            'micr code',
            'india post',
            'bank branch',
            'neft',
            'rtgs',
            'imps',
            'upi',
          ],
          temporalCoverage: '2019-05-30/2026',
          variableMeasured: [
            'PIN code',
            'Post office name and type',
            'District',
            'State',
            'Division',
            'IFSC code',
            'Bank name and type',
            'Branch name',
            'MICR code',
            'NEFT/RTGS/IMPS/UPI availability',
          ],
        })}
      />
      <JsonLdScript
        data={definedTermJsonLd({
          name: 'IFSC Code',
          description:
            'An 11-character code issued by the Reserve Bank of India to identify a specific bank branch. The first four characters are the bank code, the fifth is always 0, and the last six identify the branch.',
          url: '/blog/how-to-find-ifsc-code',
          termSetUrl: '/faq',
        })}
      />
      <JsonLdScript
        data={definedTermJsonLd({
          name: 'PIN Code',
          description:
            'A six-digit postal code used in India to route mail to a post office. The first digit is the zone, the first two the sub-zone, the first three the sorting district, and the last three the delivery post office.',
          url: '/blog/understanding-pin-codes',
          termSetUrl: '/faq',
        })}
      />
      <JsonLdScript data={faqJsonLd(FAQS)} />
      <JsonLdScript
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'FAQ', url: '/faq' },
        ])}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Answers to the most common questions about PIN codes, IFSC codes, and Multisheets.
          </p>
        </div>

        <FaqAccordion faqs={FAQS} />

        <div className="mt-10 p-6 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 text-center">
          <p className="text-slate-700 dark:text-slate-300 mb-3">
            Still have questions?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Contact us →
          </a>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'What is a PIN code?',
    a: 'A PIN (Postal Index Number) code is a 6-digit number used by India Post to sort and deliver mail. The first digit indicates the postal zone, the first two digits the sub-zone, the first three the sorting district, and the last three the individual delivery post office.',
  },
  {
    q: 'What is an IFSC code?',
    a: 'IFSC (Indian Financial System Code) is an 11-character alphanumeric code that uniquely identifies a bank branch for electronic fund transfers like NEFT, RTGS, and IMPS. The first four characters are the bank code, the fifth is always zero (reserved), and the last six identify the branch.',
  },
  {
    q: 'How many PIN codes are there in India?',
    a: 'There are over 160,000 post offices in India, sharing roughly 19,100 unique PIN codes. Our dataset covers over 17,700 PIN codes representing post offices across all states and union territories.',
  },
  {
    q: 'How many IFSC codes are there?',
    a: 'There are approximately 165,000 active bank branch IFSC codes in India across public sector banks, private banks, foreign banks, regional rural banks, and cooperative banks. Our dataset covers 164,000+ of them.',
  },
  {
    q: 'Is Multisheets free?',
    a: 'Yes, completely free. There is no signup, no login, and no payment required. We do not show ads and we do not track you.',
  },
  {
    q: 'Does the search include the Army Postal Service?',
    a: 'Yes. APS post offices use PIN codes starting with digit 9, and our dataset includes them.',
  },
  {
    q: 'How accurate is the data?',
    a: 'Our data is sourced from official India Post and RBI open datasets. We refresh it regularly and maintain a community-driven correction reporting system. If you find an error, please report it.',
  },
  {
    q: 'Does the site work in Hindi?',
    a: 'Yes. Use the EN/हिं button in the header to toggle between English and Hindi. All interface text is translated, and the site uses a Devanagari-capable font.',
  },
  {
    q: 'Can I use Multisheets offline?',
    a: 'Yes. Multisheets is a Progressive Web App (PWA). Once you install it on your phone, the core search works offline for your recent searches and cached results.',
  },
  {
    q: 'Are the speed post rates official?',
    a: 'The Speed Post rates shown are indicative figures based on published India Post tariffs. Actual charges may vary — always confirm with your local post office before dispatch.',
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Answers to the most common questions about PIN codes, IFSC codes, and Multisheets.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
                aria-expanded={open === i}
              >
                <span className="font-medium text-slate-900 dark:text-slate-50">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

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
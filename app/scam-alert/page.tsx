import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Scam Alert — Postal & Banking Fraud Awareness',
  description:
    'Learn about common postal and banking scams in India. Protect yourself from fraud with red flags, prevention tips, and how to report.',
}

type Scam = {
  title: string
  icon: string
  howItWorks: string
  redFlags: string[]
  whatToDo: string[]
  severity: 'high' | 'medium' | 'low'
}

const scams: Scam[] = [
  {
    title: 'Fake "Parcel Stuck at Customs" Calls',
    icon: '📦',
    severity: 'high',
    howItWorks:
      'You receive a call or SMS claiming a parcel addressed to you is stuck at customs or a police station. They pressure you to pay "clearance fees" via UPI or bank transfer. The parcel never existed.',
    redFlags: [
      'Unsolicited call about a parcel you did not send or order',
      'Urgency — "pay within 1 hour or parcel will be destroyed"',
      'Caller asks for UPI payment or bank details',
      'Caller ID shows an unknown or international number',
      'Spelling errors in the SMS or message',
    ],
    whatToDo: [
      'Do not pay any fee — India Post never asks for clearance fees over phone',
      'Verify by calling your local Post Office directly',
      'Block the number and report to your telecom provider',
      'Report to Cyber Crime portal: cybercrime.gov.in',
    ],
  },
  {
    title: 'India Post Fake Tracking SMS',
    icon: '📱',
    severity: 'high',
    howItWorks:
      'A fake SMS with a suspicious link claims your India Post parcel needs "address confirmation" or "delivery fee payment." Clicking the link steals your credentials or installs malware.',
    redFlags: [
      'Link leads to a non-indiapost.gov.in domain',
      'Message asks you to "click here to track" or "confirm delivery"',
      'URL is shortened (bit.ly, tinyurl, etc.)',
      'SMS from a regular mobile number (not a short code)',
    ],
    whatToDo: [
      'Never click links in unsolicited SMSes',
      'Track parcels only through indiapost.gov.in or the official Postinfo app',
      'Delete the message',
      'Forward scam SMS to 1909 (TRAI complaint)',
    ],
  },
  {
    title: 'Fake IFSC Code Scams',
    icon: '🏦',
    severity: 'high',
    howItWorks:
      'Fraudsters create fake IFSC codes for non-existent bank branches to receive payments. Victims transfer money thinking they are sending to a legitimate account.',
    redFlags: [
      'Seller or landlord provides an IFSC code that cannot be verified',
      'The branch name does not match any bank branch in that city',
      'Recipient asks for payment to a brand-new account',
      'IFSC code is for a bank in a different state than the seller',
    ],
    whatToDo: [
      'Always verify IFSC codes on our IFSC Validator tool',
      'Cross-check the IFSC on the bank\'s official website',
      'Use known, verified accounts for large payments',
      'If in doubt, use IMPS/UPI which validate the name before payment',
    ],
  },
  {
    title: 'OTP Fraud — "India Post Delivery" Scam',
    icon: '🔓',
    severity: 'high',
    howItWorks:
      'A caller claims you have a parcel arriving and reads out a fake OTP, then asks you to "confirm" by reading back the real OTP sent to your phone. This OTP is actually for a banking transaction.',
    redFlags: [
      'Caller asks you to read back any OTP received on your phone',
      'Caller claims to "verify your identity" with an OTP',
      'India Post delivery OTPs are never communicated over the phone',
      'Pressure to act quickly without thinking',
    ],
    whatToDo: [
      'Never share OTPs with anyone — India Post or banks will never ask for them',
      'Hang up immediately if someone asks for your OTP',
      'Report to your bank and change your PINs if compromised',
      'File a complaint at cybercrime.gov.in or call 1930',
    ],
  },
  {
    title: 'Job Scam — "India Post Recruitment"',
    icon: '💼',
    severity: 'medium',
    howItWorks:
      'Fake job ads claim openings at India Post or Postal Life Insurance. Candidates are asked to pay a "registration fee" or "training fee" — India Post recruitment is always free and through official channels only.',
    redFlags: [
      'Job ad on WhatsApp, Telegram, or social media (not indiapost.gov.in)',
      'Asked to pay a fee for registration, training, or materials',
      'Contact from personal email (gmail, yahoo, etc.) not a government domain',
      'Promises of "guaranteed" job placement',
    ],
    whatToDo: [
      'Check official recruitment at indiapost.gov.in or nic.in',
      'India Post recruitment is always free — never pay anyone',
      'Report fake job posts to the platform and police',
      'Report to Cyber Crime: cybercrime.gov.in',
    ],
  },
  {
    title: 'QR Code / UPI Request Fraud',
    icon: '📲',
    severity: 'medium',
    howItWorks:
      'Scammers send a UPI "collect request" disguised as a delivery notification. Accepting the request debits your account instead of paying.',
    redFlags: [
      'You receive a UPI payment request from an unknown person',
      'Message says "Scan to receive your refund" or "Pay ₹1 to confirm delivery"',
      'The collect request shows a non-Post Office name',
      'Amount is larger than expected',
    ],
    whatToDo: [
      'Always REJECT collect requests from unknown persons',
      'India Post does not ask for ₹1 or any payment via UPI collect requests',
      'Enable UPI collect request notifications only',
      'Report the VPA (UPI ID) to your bank',
    ],
  },
  {
    title: 'Fake PIN Code "Verification" Email',
    icon: '✉️',
    severity: 'low',
    howItWorks:
      'Emails that look official ask you to "verify" your PIN code details or "update your address" by clicking a link and entering personal information.',
    redFlags: [
      'Email from a non-government domain',
      'Asks for Aadhaar, PAN, or bank details',
      'Link to a form asking for personal information',
      'Poor grammar or unusual formatting',
    ],
    whatToDo: [
      'India Post does not send PIN verification emails to individuals',
      'Never click links in unsolicited emails',
      'Verify your PIN code using our free tool instead',
      'Mark the email as spam/phishing',
    ],
  },
]

function SeverityBadge({ severity }: { severity: Scam['severity'] }) {
  const styles = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[severity]}`}>
      {severity === 'high' ? '⚠️ High Risk' : severity === 'medium' ? '⚡ Medium Risk' : 'ℹ️ Low Risk'}
    </span>
  )
}

export default function ScamAlertPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            🚨 Postal & Banking Scam Alert
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Protect yourself from common scams targeting India Post customers and bank account holders. Stay informed — knowledge is your best defence.
          </p>
        </div>

        {/* Emergency contact */}
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <h2 className="font-semibold text-red-800 dark:text-red-300 mb-2">🚨 Already a Victim?</h2>
          <p className="text-sm text-red-700 dark:text-red-200 mb-2">
            If you have lost money to a scam, act immediately:
          </p>
          <ul className="space-y-1 text-sm text-red-700 dark:text-red-200">
            <li>• Call <strong>1930</strong> (National Cybercrime Helpline) immediately</li>
            <li>• File a report at <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">cybercrime.gov.in</a></li>
            <li>• Inform your bank immediately to freeze/block the account</li>
            <li>• Visit your nearest Police Station with all evidence (screenshots, call logs)</li>
            <li>• Report to India Post: <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">indiapost.gov.in</a></li>
          </ul>
        </div>

        {/* Prevention checklist */}
        <div className="mb-10 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <h2 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">✅ Prevention Checklist</h2>
          <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-200">
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              India Post will <strong>never</strong> call you for payment or personal information
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              Verify any IFSC or PIN code using official tools — <Link href="/tools/ifsc-validator" className="underline font-medium">our IFSC validator</Link> or <Link href="/tools/pincode-validator" className="underline font-medium">PIN validator</Link>
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              <strong>Never share OTPs</strong> — no bank or government agency will ever ask for them
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              <strong>Never click links</strong> in unsolicited SMSes or emails
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              Reject any UPI collect request from an unknown person
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              Track parcels only on <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium">indiapost.gov.in</a> or the official Postinfo app
            </li>
            <li className="flex items-start gap-2">
              <span className="shrink-0 mt-0.5">✓</span>
              When in doubt, call your local Post Office directly (find it via <Link href="/search" className="underline font-medium">Search</Link>)
            </li>
          </ul>
        </div>

        {/* Scam cards */}
        <div className="space-y-6">
          {scams.map((scam, idx) => (
            <article
              key={idx}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{scam.icon}</span>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{scam.title}</h2>
                </div>
                <SeverityBadge severity={scam.severity} />
              </div>
              <div className="px-6 py-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {scam.howItWorks}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 dark:bg-red-900/15 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">🚩 Red Flags</h3>
                    <ul className="space-y-1.5 text-sm text-red-700 dark:text-red-200">
                      {scam.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/15 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">🛡️ What to Do</h3>
                    <ul className="space-y-1.5 text-sm text-emerald-700 dark:text-emerald-200">
                      {scam.whatToDo.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Report section */}
        <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
            📞 Useful Contacts
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-slate-50">Cyber Crime Helpline</p>
              <p className="text-2xl font-bold text-primary dark:text-blue-400 mt-1">1930</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">24/7 National Helpline</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-slate-50">India Post Customer Care</p>
              <p className="text-2xl font-bold text-primary dark:text-blue-400 mt-1">1800-11-2011</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Toll Free · 9 AM – 6 PM</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-900 dark:text-slate-50">Cyber Crime Portal</p>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="block text-2xl font-bold text-primary dark:text-blue-400 mt-1 hover:underline">
                cybercrime.gov.in
              </a>
              <p className="text-xs text-slate-500 dark:text-slate-400">File complaint online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
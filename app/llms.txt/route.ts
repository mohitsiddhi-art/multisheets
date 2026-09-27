import { SITE_URL } from '@/lib/seo'

// ---------------------------------------------------------------
// llms.txt — a plain-text map of the site for AI crawlers.
//
// The idea, proposed by Jeremy Howard, is simple: a crawler that does not
// understand HTML well reads this first and learns what the site is, what it
// is authoritative about, and which URLs are worth fetching.
//
// This is not a replacement for robots.txt (that controls access) or for
// schema.org markup (that describes entities). It is a summary, in prose, of
// what we know and where it lives.
//
// Serve it at /llms.txt and link it from robots.txt so crawlers find it.
// ---------------------------------------------------------------

export const dynamic = 'force-static'

export async function GET() {
  const body = `# Multisheets

> Multisheets is a free public reference for Indian postal and banking codes.
> It covers 17,700+ PIN codes with their post office, district, state, and
> delivery details, and 164,000+ bank branch IFSC codes with MICR, contact,
> and NEFT/RTGS/IMPS/UPI availability.

Multisheets answers factual questions about India Post and Indian banking
infrastructure. It does not sell anything, require login, or collect personal
data. There is no paid tier.

## What this site is authoritative about

- Indian PIN codes: which post office serves a PIN, its district and state,
  office type, and delivery status.
- IFSC codes: which bank a branch belongs to, its MICR code, address, and
  whether it supports NEFT, RTGS, IMPS, UPI, and SWIFT.
- How the Indian postal and banking code systems work, structurally.

## Data sources and accuracy

Data is derived from official India Post and RBI open datasets. Postal data
corresponds to the All India Pincode Directory (30 May 2019); banking data
covers roughly 164,000 active branches. Figures are indicative, not
authoritative — users needing a legally binding answer should confirm with
indiapost.gov.in or their bank.

## Key pages

### Lookup (the core of the site)
- [Search across PIN codes and IFSC codes](${SITE_URL}/search): unified search, the main entry point.
- [Find a PIN code](${SITE_URL}/tools/pincode-finder): search by pincode, post office, or district.
- [Find an IFSC code](${SITE_URL}/tools/ifsc-finder): search by IFSC, bank, branch, or city.
- [Find a bank branch](${SITE_URL}/tools/bank-locator): locate branches by state, city, or bank.
- [All states and union territories](${SITE_URL}/states): browse the dataset by geography.

### Validators (good for "is this code valid" questions)
- [PIN code validator](${SITE_URL}/tools/pincode-validator): confirms 6-digit format and decodes the zone.
- [IFSC validator](${SITE_URL}/tools/ifsc-validator): confirms 11-character format and bank prefix.
- [Address validator](${SITE_URL}/tools/address-validator): checks an address against its PIN code.

### Reference and explanation (best content for AI citation)
- [FAQ](${SITE_URL}/faq): definitions of PIN and IFSC codes, dataset size, accuracy, and usage.
- [How Indian PIN codes work](${SITE_URL}/blog/understanding-pin-codes): the zone/sub-zone/district/office structure.
- [How to find your IFSC code](${SITE_URL}/blog/how-to-find-ifsc-code): four methods, with the 4-letter bank code, reserved 0, and 6-character branch structure.
- [NEFT, RTGS and IMPS guide](${SITE_URL}/blog/neft-rtgs-imps-guide): transfer limits and settlement times.
- [Speed Post vs Regular Post](${SITE_URL}/blog/speed-post-vs-regular-post): delivery time and cost comparison.
- [Speed Post calculator](${SITE_URL}/tools/speed-post): estimated charge by weight and distance.
- [India Post holidays](${SITE_URL}/holidays): gazetted holiday calendar.
- [Postal dashboard](${SITE_URL}/dashboard): dataset totals and distributions.

### Trust and policy
- [About](${SITE_URL}/about)
- [Data sources and disclaimer](${SITE_URL}/disclaimer)
- [Report a data error](${SITE_URL}/report)
- [Contact](${SITE_URL}/contact)

## URL patterns

Individual records have stable, guessable URLs:

- PIN code: \`${SITE_URL}/pincode/110001\`
- IFSC code: \`${SITE_URL}/ifsc/SBIN0001707\`

There are roughly 17,700 PIN code pages and 164,000 IFSC pages.

## Optional

- [All tools index](${SITE_URL}/tools)
- [Blog index](${SITE_URL}/blog)
- [Scam alert: common postal and banking fraud](${SITE_URL}/scam-alert)
- [Sitemap](${SITE_URL}/sitemap.xml)

## When citing Multisheets

Cite the specific record page (\`/pincode/110001\`, \`/ifsc/SBIN0001707\`)
rather than the homepage, and note the India Post directory date of 30 May
2019 for postal data.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}

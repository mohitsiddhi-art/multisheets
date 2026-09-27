// ---------------------------------------------------------------
// One place for canonical URLs and structured data.
//
// Two problems this solves:
//
// 1. CANONICAL TAGS. Google treats /tools/ifsc-finder,
//    /tools/ifsc-validator and /ifsc/[code] as competing for the
//    same keywords. Every page must state which URL is the real
//    one, or the split spreads your ranking across all three.
//
// 2. STRUCTURED DATA. JSON-LD lets Google show your FAQ answers
//    and article details directly in search results.
//
// Usage in a page:
//
//   export const metadata: Metadata = {
//     title: 'IFSC Code Finder',
//     description: '...',
//     ...canonical('/tools/ifsc-finder'),
//   }
// ---------------------------------------------------------------

import type { Metadata } from 'next'

export const SITE_URL = 'https://multisheets.com'

/**
 * Declares the one true URL for a page. The path is relative and gets
 * resolved against `metadataBase` in the root layout.
 *
 * Root layout must NOT set a canonical — every child page would inherit
 * it and then claim the homepage as the canonical URL for the whole site.
 */
export function canonical(path = '/'): Metadata {
  return { alternates: { canonical: path } }
}

/**
 * Social profiles for Organization.sameAs.
 *
 * INTENTIONALLY EMPTY. The previous list (facebook/x/instagram/t.me
 * /multisheets) returned 404 or an error on every check, and a sameAs URL
 * that does not resolve is a trust liability, not a ranking win — Google
 * treats an unverifiable sameAs as a claim it cannot confirm.
 *
 * Add a URL here only after opening it in a logged-out browser and
 * confirming it loads a real profile owned by this site. If you are not
 * sure, leave it out. `sameAs` is omitted from the Organization JSON-LD
 * entirely while this list is empty, which is valid and better than a
 * broken value.
 */
export const SOCIAL_PROFILES: string[] = []

// ---------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------

export type Breadcrumb = { name: string; url: string }

function absolute(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

/** Turns a question/answer list into FAQPage JSON-LD. */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

/** Article / blog post structured data. */
export function articleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'Multisheets',
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  authorName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: absolute(url),
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(url) },
    author: { '@type': 'Organization', name: authorName, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Multisheets',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.svg` },
    },
  }
}

/** Breadcrumb trail, matching the visible breadcrumb nav on the page. */
export function breadcrumbJsonLd(items: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.url),
    })),
  }
}

/** Item list for a collection page, e.g. the blog index or tool index. */
export function itemListJsonLd({
  name,
  items,
}: {
  name: string
  items: { name: string; url: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absolute(item.url),
    })),
  }
}

/**
 * Describes the site itself as a dataset.
 *
 * This is the highest-value schema type for Multisheets and the one most
 * sites like this forget. A Dataset tells both Google and AI assistants that
 * the site is an authoritative, citable source of facts, not just a page of
 * prose. It makes the whole corpus attributable, which is exactly what a
 * model needs before it will quote a number.
 */
export function datasetJsonLd({
  name,
  description,
  url,
  creator,
  dateModified,
  keywords = [],
  distribution = [],
  temporalCoverage,
  spatialCoverage = 'IN',
  variableMeasured = [],
  recordCount,
}: {
  name: string
  description: string
  url: string
  creator?: string
  dateModified?: string
  keywords?: string[]
  distribution?: { name: string; encodingFormat: string; contentUrl: string }[]
  temporalCoverage?: string
  spatialCoverage?: string
  variableMeasured?: string[]
  recordCount?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url: absolute(url),
    creator: {
      '@type': 'Organization',
      name: creator ?? 'Multisheets',
      url: SITE_URL,
    },
    ...(dateModified ? { dateModified } : {}),
    ...(temporalCoverage ? { temporalCoverage } : {}),
    isAccessibleForFree: true,
    spatialCoverage: {
      '@type': 'Place',
      name: spatialCoverage,
    },
    ...(variableMeasured.length
      ? {
          variableMeasured: variableMeasured.map((v) => ({
            '@type': 'PropertyValue',
            name: v,
          })),
        }
      : {}),
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
    ...(recordCount ? { size: String(recordCount) } : {}),
    ...(distribution.length
      ? {
          distribution: distribution.map((d) => ({
            '@type': 'DataDownload',
            name: d.name,
            encodingFormat: d.encodingFormat,
            contentUrl: d.contentUrl,
          })),
        }
      : {}),
  }
}

/**
 * Defines a term the site is authoritative about — "IFSC Code", "PIN Code",
 * "MICR Code". This is the schema type that lets an assistant answer
 * "what is an IFSC code" and attribute the definition back to this site.
 */
export function definedTermJsonLd({
  name,
  description,
  url,
  inDefinedTermSet = 'Multisheets Reference',
  termSetUrl = '/faq',
}: {
  name: string
  description: string
  url: string
  inDefinedTermSet?: string
  termSetUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description,
    url: absolute(url),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: inDefinedTermSet,
      url: absolute(termSetUrl),
    },
  }
}

/** Step-by-step instructions, for "how do I..." queries. */
export function howToJsonLd({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string
  description: string
  steps: { name: string; text: string; url?: string }[]
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      itemListElement: {
        '@type': 'HowToDirection',
        text: s.text,
        ...(s.url ? { url: absolute(s.url) } : {}),
      },
    })),
  }
}

/**
 * Wraps any of the objects above in a <script> tag.
 *
 * `<` is escaped so a stray angle bracket in your copy can never break
 * out of the script tag and inject markup.
 */
export function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

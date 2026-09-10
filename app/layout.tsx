import type { Metadata } from 'next'
import { Noto_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const notoSans = Noto_Sans({
  subsets: ['latin', 'devanagari'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Multisheets — Indian PIN Code & IFSC Code Lookup',
    template: '%s | Multisheets',
  },
  description:
    'Find Indian PIN codes, Post Offices, IFSC codes, and Bank Branches instantly with Unified Smart Search. Free tool for students, businesses, and bank customers.',
  keywords: [
    'Indian PIN code',
    'IFSC code',
    'Post Office',
    'Bank Branch',
    'India PIN lookup',
    'IFSC lookup',
    'bank branch details',
  ],
  metadataBase: new URL('https://multisheets.com'),
  openGraph: {
    siteName: 'Multisheets.com',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Multisheets',
              url: 'https://multisheets.com',
              description:
                'Find Indian PIN codes, Post Offices, IFSC codes, and Bank Branches instantly.',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://multisheets.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Multisheets',
              url: 'https://multisheets.com',
              logo: 'https://multisheets.com/icon-512.svg',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Inline script to set theme before paint — avoids flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var t = localStorage.getItem('ms-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches))
      document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(e) {}
})();`,
          }}
        />
        <Providers>
          <a
            href="#main"
            className="skip-link"
            tabIndex={0}
          >
            Skip to main content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  )
}
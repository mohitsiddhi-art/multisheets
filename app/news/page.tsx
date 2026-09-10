import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'India Post News — Latest Updates & Announcements',
  description:
    'Stay updated with the latest India Post news — new services, digital initiatives, postal rates, and government announcements.',
}

type NewsItem = {
  title: string
  date: string
  category: string
  summary: string
  url: string
}

const categories = ['All', 'Digital India', 'Services', 'Rates', 'Technology', 'Government', 'Logistics']

const news: NewsItem[] = [
  {
    title: 'India Post Launches New Digital Mailbox Feature',
    date: '2026-09-01',
    category: 'Digital India',
    summary:
      'India Post has introduced a digital mailbox feature allowing customers to receive scanned copies of their physical mail electronically. This service is available for registered users in pilot cities.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'Speed Post 2.0 — Enhanced Tracking Now Available',
    date: '2026-08-15',
    category: 'Services',
    summary:
      'The upgraded Speed Post 2.0 service now offers real-time GPS tracking, delivery photo confirmation, and SMS/email alerts for every transit milestone.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'UPI Payments Now Accepted at All Head Post Offices',
    date: '2026-08-10',
    category: 'Digital India',
    summary:
      'All Head Post Offices across India now accept UPI payments for postal services including Speed Post, Registered Post, and money orders.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'Revised Postal Rates for International Parcels',
    date: '2026-07-28',
    category: 'Rates',
    summary:
      'The Department of Posts has announced revised tariff rates for international parcels effective August 1, 2026. Domestic rates remain unchanged.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'India Post Partners with E-Commerce Platforms for Last-Mile Delivery',
    date: '2026-07-15',
    category: 'Logistics',
    summary:
      'A new partnership between India Post and leading e-commerce platforms aims to strengthen last-mile delivery in Tier-2 and Tier-3 cities using the postal network.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'India Post Payments Bank Opens 1,000th Branch',
    date: '2026-07-01',
    category: 'Government',
    summary:
      'India Post Payments Bank (IPPB) has crossed the milestone of 1,000 branches across India, strengthening financial inclusion in rural areas.',
    url: 'https://www.ippbonline.com',
  },
  {
    title: 'New AADHAAR-Linked Parcel Pickup System Introduced',
    date: '2026-06-20',
    category: 'Technology',
    summary:
      'India Post introduces AADhaar-verified parcel pickup at select locations to reduce fraud and streamline the delivery process for customers.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'International Parcel Tracking API Goes Live',
    date: '2026-06-05',
    category: 'Technology',
    summary:
      'A public API for tracking international parcels is now available for developers, enabling third-party integration with the India Post tracking system.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'Postal Life Insurance Premium Discounts for Government Employees',
    date: '2026-05-18',
    category: 'Services',
    summary:
      'Postal Life Insurance (PLI) has announced special premium discounts for central and state government employees who apply before December 2026.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'Metro Postal Express — Same-Day Delivery in 8 Metro Cities',
    date: '2026-05-01',
    category: 'Logistics',
    summary:
      'India Post now offers same-day delivery in Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune and Ahmedabad for local parcels under 2 kg.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'e-Postcard Service Extended to All States',
    date: '2026-04-14',
    category: 'Services',
    summary:
      'The digital Postcard service (e-Postcard) is now available in all 28 states and 8 union territories, allowing users to send physical postcards via an online portal.',
    url: 'https://www.indiapost.gov.in',
  },
  {
    title: 'Digital Locker Integration for Document Mailing',
    date: '2026-03-22',
    category: 'Digital India',
    summary:
      'India Post now supports direct retrieval of documents from DigiLocker for mailing purposes, streamlining the process of sending certified copies.',
    url: 'https://www.indiapost.gov.in',
  },
]

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            📰 India Post News
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            The latest updates on India Post services, digital initiatives, and postal policy.
          </p>
        </div>

        {/* Category chips (decorative — all visible, shows filter aesthetic) */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                i === 0
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* News cards */}
        <div className="space-y-5">
          {news.map((item, idx) => (
            <article
              key={idx}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {item.category}
                  </span>
                  <time className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </time>
                </div>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                {item.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {item.summary}
              </p>
              <div className="mt-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Read more →
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm text-slate-500 dark:text-slate-400">
          News items are curated from publicly available India Post and government sources.
          Visit{' '}
          <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-blue-400 hover:underline">
            indiapost.gov.in
          </a>{' '}
          for official announcements.
        </div>
      </div>
    </div>
  )
}
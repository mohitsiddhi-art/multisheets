import { MetadataRoute } from 'next'
import { getPincodes } from '@/lib/india-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://multisheets.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/search`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/tools`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/tools/speed-post`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/pincode-finder`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/ifsc-finder`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/bank-locator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/pincode-validator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/ifsc-validator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/address-validator`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/disclaimer`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog/how-to-find-ifsc-code`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/understanding-pin-codes`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/speed-post-vs-regular-post`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog/neft-rtgs-imps-guide`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/report`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/sri-dungargarh`, changeFrequency: 'monthly', priority: 0.7 },
    // New pages
    { url: `${base}/states`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/holidays`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/news`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/scam-alert`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/quiz`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/dashboard`, changeFrequency: 'weekly', priority: 0.7 },
  ]

  // Dynamic PIN code pages (top 500 for sitemap size)
  const pincodes = getPincodes()
  const pinPages = pincodes
    .filter((o) => o.office_type === 'HO' || o.office_type === 'SO') // Head and Sub offices
    .slice(0, 500)
    .map((o) => ({
      url: `${base}/pincode/${o.pincode}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  // Dynamic IFSC pages (top 500)
  const branches = await import('@/lib/india-data').then((m) => m.getBranches())
  const branchPages = branches
    .filter((b) => b.bank_type === 'Public Sector' || b.bank_type === 'Private Sector')
    .slice(0, 500)
    .map((b) => ({
      url: `${base}/ifsc/${b.ifsc}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  return [...staticPages, ...pinPages, ...branchPages]
}
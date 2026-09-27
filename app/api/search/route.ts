/**
 * Multisheets.com — Unified Smart Search API
 * GET /api/search?q=...&filter=...&limit=...
 * Server-side search over loaded datasets.
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchAll, getSuggestions, type SearchFilter, type SearchResult } from '@/lib/india-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Simple in-memory rate limiter: 60 requests per minute per IP
const rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 60
const RATE_WINDOW = 60_000

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  entry.count++
  return entry.count <= RATE_LIMIT
}

/**
 * Resolve the client IP for rate limiting.
 *
 * `x-forwarded-for` is CLIENT-SUPPLIED. An attacker can put a fresh random
 * value in it on every request and the limiter would treat each one as a
 * new IP, making the 60/min cap meaningless.
 *
 * So we do not trust the first value in the chain. We take the LAST one,
 * which is the entry our own proxy appended, because an attacker forging
 * the header can only prepend to it, not rewrite what nginx adds. If the
 * header is missing or unparseable we fall back to a single shared bucket
 * rather than trusting anything.
 */
function clientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const chain = xff.split(',').map((s) => s.trim()).filter(Boolean)
    // Last hop is the one added by the nearest trusted proxy.
    if (chain.length > 0) return chain[chain.length - 1]
  }
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  // No trustworthy client identity — share one bucket so the limit still
  // applies instead of falling open.
  return 'unidentified'
}

// Evict stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(ip)
  }
}, 300_000)

export async function GET(request: NextRequest) {
  const ip = clientIp(request)
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  }
  const { searchParams } = new URL(request.url)

  // Bound the query. An unbounded string is scanned with .includes() across
  // every indexed record, so a multi-megabyte query turns a cheap request
  // into a CPU spike.
  const rawQ = searchParams.get('q')?.trim() || ''
  if (rawQ.length > 100) {
    return NextResponse.json(
      { error: 'Query too long. Please use 100 characters or fewer.' },
      { status: 400 },
    )
  }
  const q = rawQ

  const filterParam = searchParams.get('filter')
  const filter: SearchFilter =
    filterParam === 'ifsc' || filterParam === 'bank' || filterParam === 'pincode' || filterParam === 'location'
      ? filterParam
      : 'all'

  // parseInt returns NaN for "abc", and Math.min(NaN, 100) is NaN — which
  // would flow into the search as an unbounded limit. Clamp explicitly.
  const parsedLimit = Number.parseInt(searchParams.get('limit') || '', 10)
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 100

  if (!q) {
    return NextResponse.json({ results: [], suggestions: [] })
  }

  // Timing
  const start = performance.now()

  const results = searchAll(q, filter, limit)
  const suggestions = getSuggestions(q)

  const elapsed = Math.round(performance.now() - start)

  // Convert SearchResult to serializable JSON
  const serialized = results.map((r) => {
    if (r.kind === 'pincode') {
      return {
        kind: 'pincode',
        pincode: r.record.pincode,
        office_name: r.record.office_name,
        office_type: r.record.office_type,
        delivery: r.record.delivery,
        district: r.record.district,
        state: r.record.state,
        circle: r.record.circle,
        region: r.record.region,
        division: r.record.division,
      }
    }
    return {
      kind: 'branch',
      ifsc: r.record.ifsc,
      pincode: r.record.pincode,
      bank_name: r.record.bank_name,
      branch_name: r.record.branch_name,
      address: r.record.address,
      city: r.record.city,
      district: r.record.district,
      state: r.record.state,
      micr: r.record.micr,
      contact: r.record.contact,
      neft: r.record.neft,
      rtgs: r.record.rtgs,
      imps: r.record.imps,
      upi: r.record.upi,
      swift: r.record.swift,
      bank_type: r.record.bank_type,
    }
  })

  return NextResponse.json({
    results: serialized,
    suggestions,
    meta: {
      query: q,
      filter,
      count: results.length,
      limit,
      tookMs: elapsed,
    },
  })
}
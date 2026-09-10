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

// Evict stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(ip)
  }
}, 300_000)

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 })
  }
  const { searchParams } = new URL(request.url)

  const q = searchParams.get('q')?.trim() || ''
  const filter = (searchParams.get('filter') as SearchFilter) || 'all'
  const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 100)

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
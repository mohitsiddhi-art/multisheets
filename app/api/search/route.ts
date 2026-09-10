/**
 * Multisheets.com — Unified Smart Search API
 * GET /api/search?q=...&filter=...&limit=...
 * Server-side search over loaded datasets.
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchAll, getSuggestions, type SearchFilter, type SearchResult } from '@/lib/india-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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
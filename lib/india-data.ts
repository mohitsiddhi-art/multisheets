/**
 * Multisheets.com — India Data Access Layer
 * Server-only module. Loads the PIN-code and bank-branch JSON datasets into
 * memory (cached at module scope) and provides fast lookup + search.
 *
 * NOTE: This module imports 'node:fs' and the data JSONs — it must only be
 * imported from Server Components and Route Handlers, never client components.
 */

import fs from 'node:fs'
import path from 'node:path'

// ------------------------------------------------------------------ types
export type PincodeRecord = {
  pincode: string
  office_name: string
  office_type: string
  delivery: string
  district: string
  state: string
  circle: string
  region: string
  division: string
}

export type BankType =
  | 'Public Sector'
  | 'Private Sector'
  | 'Regional Rural'
  | 'Cooperative'
  | 'Payment Bank'
  | 'Small Finance'

export type BranchRecord = {
  ifsc: string
  pincode: string
  bank_name: string
  branch_name: string
  address: string
  city: string
  district: string
  state: string
  micr: string
  contact: string
  neft: boolean
  rtgs: boolean
  imps: boolean
  upi: boolean
  swift: string
  bank_type: BankType
}

export type SearchResult =
  | { kind: 'pincode'; record: PincodeRecord }
  | { kind: 'branch'; record: BranchRecord; bankType: string }

export type SearchFilter = 'all' | 'ifsc' | 'bank' | 'pincode' | 'location'

// ------------------------------------------------------------------ cache
let officesCache: PincodeRecord[] | null = null
let branchesCache: BranchRecord[] | null = null
let banksByPincodeCache: Map<string, BranchRecord[]> | null = null
let branchIndex: { text: string; idx: number }[] | null = null
let officeIndex: { text: string; idx: number }[] | null = null

const dataDir =
  process.env.DATA_DIR || path.resolve(process.cwd(), 'data')

function readJson(filename: string): unknown {
  const fp = path.join(dataDir, filename)
  return JSON.parse(fs.readFileSync(fp, 'utf8'))
}

// ---------------------------------------------------------------- loaders
export function getPincodes(): PincodeRecord[] {
  if (officesCache) return officesCache
  officesCache = readJson('pincodes.json') as PincodeRecord[]
  return officesCache
}

export function getBranches(): BranchRecord[] {
  if (branchesCache) return branchesCache
  branchesCache = readJson('bank_branches.json') as BranchRecord[]
  return branchesCache
}

/** Map of pincode -> bank branches located there. Built lazily. */
export function getBanksByPincode(): Map<string, BranchRecord[]> {
  if (banksByPincodeCache) return banksByPincodeCache
  const map = new Map<string, BranchRecord[]>()
  for (const b of getBranches()) {
    if (!b.pincode) continue
    const arr = map.get(b.pincode)
    if (arr) {
      if (arr.length < 200) arr.push(b)
    } else {
      map.set(b.pincode, [b])
    }
  }
  banksByPincodeCache = map
  return map
}

// ------------------------------------------------------------ search index
function buildBranchIndex() {
  if (branchIndex) return branchIndex
  const branches = getBranches()
  branchIndex = branches.map((b, idx) => ({
    idx,
    text: `${b.ifsc} ${b.bank_name} ${b.branch_name} ${b.city} ${b.district} ${b.state} ${b.micr} ${b.bank_type} ${b.pincode}`.toLowerCase(),
  }))
  return branchIndex
}

function buildOfficeIndex() {
  if (officeIndex) return officeIndex
  const offices = getPincodes()
  officeIndex = offices.map((o, idx) => ({
    idx,
    text: `${o.pincode} ${o.office_name} ${o.district} ${o.state} ${o.circle} ${o.division} ${o.office_type} ${o.delivery}`.toLowerCase(),
  }))
  return officeIndex
}

// ---------------------------------------------------------------- lookups
export function findPincode(pincode: string): PincodeRecord | undefined {
  return findAllPincodes(pincode)[0]
}

/** Returns ALL post offices sharing a PIN (a PIN can cover multiple offices). */
export function findAllPincodes(pincode: string): PincodeRecord[] {
  const q = pincode.trim()
  if (!/^\d{6}$/.test(q)) return []
  return getPincodes().filter((o) => o.pincode === q)
}

export function findBranch(ifsc: string): BranchRecord | undefined {
  const q = ifsc.trim().toUpperCase()
  if (q.length < 6) return undefined
  return getBranches().find((b) => b.ifsc === q)
}

export function findAllBranchesByPincode(pincode: string): BranchRecord[] {
  return getBanksByPincode().get(pincode.trim()) || []
}

// ---------------------------------------------------------------- search
/**
 * Unified Smart Search across both datasets.
 * Returns results ranked by relevance, capped at `limit` (default 100).
 */
export function searchAll(
  rawQuery: string,
  filter: SearchFilter = 'all',
  limit = 100
): SearchResult[] {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return []

  const isPincodeQuery = /^\d{6}$/.test(q)
  const isIfscLike = /^[a-z]{4}0/.test(q) && q.length >= 6

  // 1. Exact PIN code hit → immediate
  if (filter !== 'ifsc' && filter !== 'bank' && filter !== 'location' && isPincodeQuery) {
    const offices = findAllPincodes(q)
    if (offices.length > 0) {
      const banks = findAllBranchesByPincode(q)
      const result: SearchResult[] = offices.map((o) => ({ kind: 'pincode', record: o }))
      // Add up to 3 banks at this pin for quick access
      for (const b of banks.slice(0, 3)) {
        result.push({ kind: 'branch', record: b, bankType: b.bank_type })
      }
      return result
    }
  }

  // 2. Exact IFSC hit → immediate
  if (filter !== 'pincode' && filter !== 'location' && isIfscLike) {
    const b = findBranch(q)
    if (b) {
      return [{ kind: 'branch', record: b, bankType: b.bank_type }]
    }
  }

  const results: SearchResult[] = []

  // 3. Substring scan over banking index
  if (filter !== 'pincode' && filter !== 'location') {
    let scanBank = true
    if (filter === 'bank') scanBank = true
    if (filter === 'ifsc') scanBank = true
    if (scanBank) {
      for (const { text, idx } of branchIndex || buildBranchIndex()) {
        if (text.includes(q)) {
          const b = branchesCache![idx]
          results.push({ kind: 'branch', record: b, bankType: b.bank_type })
          if (results.length >= limit) return results
        }
      }
    }
  }

  // 4. Substring scan over postal index
  if (filter !== 'ifsc' && filter !== 'bank') {
    for (const { text, idx } of officeIndex || buildOfficeIndex()) {
      if (text.includes(q)) {
        results.push({ kind: 'pincode', record: officesCache![idx] })
        if (results.length >= limit) return results
      }
    }
  }

  return results
}

// ------------------------------------------------------------ auto-term list
// "Do you mean..." suggestions for typos (e.g. 4-digit partial PINs).
export function getSuggestions(rawQuery: string, limit = 8): string[] {
  const q = rawQuery.trim().toLowerCase()
  if (q.length < 2) return []

  // Suggest matching pincodes when user types partial numbers
  if (/^\d+$/.test(q) && q.length < 6) {
    const out: string[] = []
    for (const { text, idx } of officeIndex || buildOfficeIndex()) {
      if (text.startsWith(q)) {
        out.push(officesCache![idx].pincode)
        if (out.length >= limit) break
      }
    }
    return out
  }
  if (/^\d+$/.test(q) && q.length > 6) {
    return ['Check the format — PIN codes are exactly 6 digits, e.g. 110001']
  }
  return []
}

// ---------------------------------------------------------------- stats
export function getDatasetStats() {
  return {
    pincodes: getPincodes().length,
    branches: getBranches().length,
    states: new Set(getBranches().map((b) => b.state?.toLowerCase())).size,
    banks: new Set(getBranches().map((b) => b.bank_name.toLowerCase())).size,
  }
}
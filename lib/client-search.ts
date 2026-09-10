/**
 * client-search.ts — Browser-side search engine for Multisheets
 *
 * Loads data files from /data/ on demand and searches in-memory.
 * Replaces the server-side /api/search route for static export.
 */

// ------------------------------------------------------------------ Types
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
  bank_type: string
}

export type SearchResult =
  | { kind: 'pincode' } & PincodeRecord
  | { kind: 'branch' } & BranchRecord

export type SearchFilter = 'all' | 'ifsc' | 'bank' | 'pincode' | 'location'

// ------------------------------------------------------------------ Cache
let pincodesCache: PincodeRecord[] | null = null
let branchesCache: BranchRecord[] = []
let ifscToStateCache: Record<string, string> | null = null
let loadedStates = new Set<string>()

// ------------------------------------------------------------------ Loaders

/** Lazy-load pincodes.json (3.6MB) */
async function loadPincodes(): Promise<PincodeRecord[]> {
  if (pincodesCache) return pincodesCache
  const res = await fetch('/data/pincodes.json')
  if (!res.ok) throw new Error('Failed to load pincode data')
  pincodesCache = await res.json()
  return pincodesCache!
}

/** Lazy-load IFSC-to-state index (4.2MB) */
async function loadIfscIndex(): Promise<Record<string, string>> {
  if (ifscToStateCache) return ifscToStateCache
  const res = await fetch('/data/ifsc-to-state.json')
  if (!res.ok) throw new Error('Failed to load IFSC index')
  ifscToStateCache = await res.json()
  return ifscToStateCache
}

/** Convert state name to filename slug */
function stateToSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Load bank branches for a specific state */
async function loadBanksByState(state: string): Promise<BranchRecord[]> {
  const slug = stateToSlug(state)
  if (loadedStates.has(slug)) return branchesCache.filter(b => b.state === state)

  const res = await fetch(`/data/banks-by-state/${slug}.json`)
  if (!res.ok) return []
  const data: BranchRecord[] = await res.json()
  branchesCache.push(...data)
  loadedStates.add(slug)
  return data
}

/** Load ALL bank data (for comprehensive searches) */
async function loadAllBanks(): Promise<BranchRecord[]> {
  if (branchesCache.length > 0) return branchesCache

  // Load the state index to know which states exist
  const indexRes = await fetch('/data/banks-by-state/index.json')
  if (!indexRes.ok) return []
  const index: Record<string, { file: string }> = await indexRes.json()

  // Load all states in parallel (but batch to avoid too many concurrent requests)
  const states = Object.keys(index)
  const BATCH_SIZE = 6
  for (let i = 0; i < states.length; i += BATCH_SIZE) {
    const batch = states.slice(i, i + BATCH_SIZE)
    await Promise.all(batch.map(s => loadBanksByState(s)))
  }
  return branchesCache
}

// ------------------------------------------------------------------ Search

/** Simple substring match (case-insensitive) */
function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase())
}

/** Check if query looks like a PIN code (6 digits) */
function isPincode(query: string): boolean {
  return /^\d{6}$/.test(query.trim())
}

/** Check if query looks like an IFSC code (4 letters + 0 + 6 alphanumeric) */
function isIFSC(query: string): boolean {
  return /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(query.trim())
}

/**
 * Unified search — works exactly like the old /api/search route.
 * Returns results in the same format for backward compatibility.
 */
export async function searchAll(
  query: string,
  filter: SearchFilter = 'all',
  limit: number = 100
): Promise<{
  results: Array<
    | { kind: 'pincode'; record: PincodeRecord }
    | { kind: 'branch'; record: BranchRecord }
  >
  suggestions: string[]
}> {
  const q = query.trim()
  if (!q) return { results: [], suggestions: [] }

  const results: Array<SearchResult> = []

  // Search pincodes
  if (filter === 'all' || filter === 'pincode' || filter === 'location') {
    try {
      const pincodes = await loadPincodes()

      // Exact match first
      for (const p of pincodes) {
        if (p.pincode === q) {
          results.push({ kind: 'pincode', ...p })
        }
      }

      // Then substring matches (name, district, state)
      if (results.length < limit) {
        for (const p of pincodes) {
          if (p.pincode === q) continue // already added
          if (
            matchesQuery(p.office_name, q) ||
            matchesQuery(p.district, q) ||
            matchesQuery(p.state, q)
          ) {
            results.push({ kind: 'pincode', ...p })
            if (results.length >= limit) break
          }
        }
      }
    } catch {
      // Pincode data not available
    }
  }

  // Search bank branches
  if (filter === 'all' || filter === 'ifsc' || filter === 'bank') {
    try {
      const qUpper = q.toUpperCase()

      // If it looks like an IFSC, use the index to find the state first
      if (isIFSC(q) || (filter === 'ifsc' && q.length >= 4)) {
        const ifscIndex = await loadIfscIndex()
        const state = ifscIndex[qUpper]
        if (state) {
          const branches = await loadBanksByState(state)
          for (const b of branches) {
            if (b.ifsc === qUpper) {
              results.push({ kind: 'branch', ...b })
              break
            }
          }
        }
      }

      // General bank search — load all banks and search
      if (results.length < limit && (filter === 'all' || filter === 'bank')) {
        const branches = await loadAllBanks()

        for (const b of branches) {
          if (results.length >= limit) break

          // Skip if already found as exact IFSC match
          if (results.some(r => r.kind === 'branch' && 'ifsc' in r && r.ifsc === b.ifsc)) continue

          if (
            matchesQuery(b.bank_name, q) ||
            matchesQuery(b.branch_name, q) ||
            matchesQuery(b.ifsc, q) ||
            matchesQuery(b.city, q) ||
            matchesQuery(b.district, q)
          ) {
            results.push({ kind: 'branch', ...b })
          }
        }
      }
    } catch {
      // Bank data not available
    }
  }

  return { results: results.slice(0, limit), suggestions: [] }
}

/**
 * Find exact pincode record
 */
export async function findPincode(pincode: string): Promise<PincodeRecord | null> {
  try {
    const pincodes = await loadPincodes()
    return pincodes.find(p => p.pincode === pincode) || null
  } catch {
    return null
  }
}

/**
 * Find all offices at a pincode
 */
export async function findAllPincodes(pincode: string): Promise<PincodeRecord[]> {
  try {
    const pincodes = await loadPincodes()
    return pincodes.filter(p => p.pincode === pincode)
  } catch {
    return []
  }
}

/**
 * Find exact branch by IFSC
 */
export async function findBranch(ifsc: string): Promise<BranchRecord | null> {
  try {
    const ifscIndex = await loadIfscIndex()
    const state = ifscIndex[ifsc.toUpperCase()]
    if (!state) return null
    const branches = await loadBanksByState(state)
    return branches.find(b => b.ifsc === ifsc.toUpperCase()) || null
  } catch {
    return null
  }
}

/**
 * Find all branches at a pincode
 */
export async function findAllBranchesByPincode(pincode: string): Promise<BranchRecord[]> {
  try {
    const branches = await loadAllBanks()
    return branches.filter(b => b.pincode === pincode)
  } catch {
    return []
  }
}

/**
 * Get suggestions for partial input
 */
export async function getSuggestions(query: string): Promise<string[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const suggestions: string[] = []

  // PIN code suggestions
  try {
    const pincodes = await loadPincodes()
    for (const p of pincodes) {
      if (p.pincode.startsWith(q) && !suggestions.includes(p.pincode)) {
        suggestions.push(p.pincode)
        if (suggestions.length >= 5) break
      }
    }
  } catch {
    // ignore
  }

  return suggestions
}

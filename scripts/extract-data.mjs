#!/usr/bin/env node
/**
 * Multisheets.com — Data Extraction Script
 * Converts the combined PIN+IFSC CSV into clean JSON files:
 *   - public/data/pincodes.json       (unique PIN code postal records)
 *   - public/data/bank_branches.json  (unique bank branch / IFSC records)
 *   - public/data/search_index.json   (compact client-side search index)
 *
 * Usage: node scripts/extract-data.mjs
 * CSV source: pass as argv[2] or use default path
 */

import fs from 'node:fs'
import path from 'node:path'

// ---------------------------------------------------------------- config
const DEFAULT_CSV = 'C:\\Users\\MOHIT\\Desktop\\pincode and ifsc\\pincode-under_ifsc.csv'
const OUT_DIR = path.resolve('data')

// Columns from pincode-under_ifsc.csv (0-indexed)
const COL = {
  BANK: 0,
  IFSC: 1,
  BRANCH: 2,
  CENTRE: 3,
  DISTRICT: 4,
  STATE: 5,
  ADDRESS: 6,
  CONTACT: 7,
  IMPS: 8,
  RTGS: 9,
  CITY: 10,
  ISO3166: 11,
  NEFT: 12,
  MICR: 13,
  UPI: 14,
  SWIFT: 15,
  PINCODE: 16,
  CIRCLE: 17,
  REGION: 18,
  DIVISION: 19,
  OFFICE_NAME: 20,
  OFFICE_TYPE: 21,
  DELIVERY: 22,
  POSTAL_DISTRICT: 23,
  POSTAL_STATE: 24,
}

// ---------------------------------------------------------------- csv parser
// Handles RFC-4180 style quotes, commas inside quotes, and CRLF.
function parseCSVLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else {
      if (ch === '"') {
        inQuotes = true
      } else if (ch === ',') {
        out.push(cur)
        cur = ''
      } else {
        cur += ch
      }
    }
  }
  out.push(cur)
  return out
}

// ---------------------------------------------------------------- helpers
const norm = (s) => (s == null ? '' : String(s).trim())

function cleanField(s) {
  return norm(s).replace(/\s+/g, ' ')
}

function titleCase(s) {
  return norm(s).replace(/\b\w/g, (c) => c.toUpperCase())
}

// Bank type classification from bank name
function classifyBankType(name) {
  const n = name.toLowerCase()
  if (n.includes('co-operative') || n.includes('co op') || n.includes('cooperative')) return 'Cooperative'
  if (n.includes('payment bank')) return 'Payment Bank'
  if (n.includes('small finance')) return 'Small Finance'
  if (
    n.includes('state bank of india') ||
    n.includes('bank of baroda') ||
    n.includes('canara bank') ||
    n.includes('punjab national bank') ||
    n.includes('union bank') ||
    n.includes('bank of india') ||
    n.includes('indian bank') ||
    n.includes('bank of maharashtra') ||
    n.includes('central bank') ||
    n.includes('indian overseas') ||
    n.includes('uco bank') ||
    n.includes('punjab & sind') ||
    n.includes('state bank of')
  ) {
    return 'Public Sector'
  }
  if (
    n.includes('regional rural') ||
    n.includes('rural bank') ||
    n.includes('gramin')
  ) {
    return 'Regional Rural'
  }
  return 'Private Sector'
}

// Fix uppercase-only names to title case for readability
function fixCase(s) {
  const t = norm(s)
  // If string is all uppercase and longer than 3 chars, title-case it
  if (t && t.length > 3 && t === t.toUpperCase() && /[A-Za-z]/.test(t)) {
    return t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
  }
  return t
}

// ---------------------------------------------------------------- main
async function main() {
  const csvPath = process.argv[2] || DEFAULT_CSV
  console.log(`Reading: ${csvPath}`)
  const raw = fs.readFileSync(csvPath, 'utf8')
  const lines = raw.split(/\r?\n/)
  console.log(`Total lines: ${lines.length}`)

  const offices = new Map() // key: pincode|office
  const pincodes = new Map() // key: pincode -> {count, offices}
  const branches = new Map() // key: IFSC
  const banks = new Map() // key: bank name -> type

  let header = true
  let skipped = 0

  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln]
    if (!line.trim()) continue
    if (header) {
      header = false
      continue
    }
    const c = parseCSVLine(line)

    if (!c[COL.IFSC] && !c[COL.PINCODE]) {
      skipped++
      continue
    }

    // ---- Banking record
    const ifsc = cleanField(c[COL.IFSC])
    const pincode = cleanField(c[COL.PINCODE])
    const bank = cleanField(c[COL.BANK])
    const micr = cleanField(c[COL.MICR])

    if (ifsc && !branches.has(ifsc)) {
      branches.set(ifsc, {
        ifsc,
        pincode,
        bank_name: titleCase(bank),
        branch_name: titleCase(cleanField(c[COL.BRANCH])),
        address: cleanField(c[COL.ADDRESS]),
        city: titleCase(fixCase(cleanField(c[COL.CITY]))),
        district: titleCase(fixCase(cleanField(c[COL.DISTRICT]))),
        state: titleCase(fixCase(cleanField(c[COL.STATE]))),
        micr,
        contact: cleanField(c[COL.CONTACT]),
        neft: c[COL.NEFT] === 'true',
        rtgs: c[COL.RTGS] === 'true',
        imps: c[COL.IMPS] === 'true',
        upi: c[COL.UPI] === 'true',
        swift: cleanField(c[COL.SWIFT]),
      })
      if (bank) banks.set(bank.toLowerCase(), classifyBankType(bank))
    }

    // ---- Postal record
    const office = cleanField(c[COL.OFFICE_NAME])
    const pKey = pincode + '|' + office
    if (pincode && !offices.has(pKey)) {
      offices.set(pKey, {
        pincode,
        office_name: titleCase(fixCase(office)),
        office_type: cleanField(c[COL.OFFICE_TYPE]),
        delivery: cleanField(c[COL.DELIVERY]),
        district: titleCase(fixCase(cleanField(c[COL.POSTAL_DISTRICT]))),
        state: titleCase(fixCase(cleanField(c[COL.POSTAL_STATE]))),
        circle: cleanField(c[COL.CIRCLE]),
        region: cleanField(c[COL.REGION]),
        division: cleanField(c[COL.DIVISION]),
      })
      const existing = pincodes.get(pincode)
      if (existing) existing.count++
      else pincodes.set(pincode, { count: 1 })
    }
  }

  console.log(`Offices parsed: ${offices.size}`)
  console.log(`Unique pincodes: ${pincodes.size}`)
  console.log(`Unique IFSC/branches: ${branches.size}`)

  // ---- Assign bank_type
  let bankTypeMissing = 0
  for (const b of branches.values()) {
    const t = banks.get(b.bank_name.toLowerCase())
    b.bank_type = t || 'Private Sector'
    if (!t) bankTypeMissing++
  }

  // ---- Save files
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const officeArr = [...offices.values()]
  const branchArr = [...branches.values()]

  fs.writeFileSync(path.join(OUT_DIR, 'pincodes.json'), JSON.stringify(officeArr))
  fs.writeFileSync(path.join(OUT_DIR, 'bank_branches.json'), JSON.stringify(branchArr))

  // ---- Sri Dungargarh - Rani Bazzar (known missing record, Rajasthan)
  const addedRecords = []
  const dungargarhKey = `331803|Sri Dungargarh - Rani Bazzar`
  if (!offices.has(dungargarhKey)) {
    offices.set(dungargarhKey, {
      pincode: '331803',
      office_name: 'Sri Dungargarh - Rani Bazzar',
      office_type: 'SO',
      delivery: 'Delivery',
      district: 'Bikaner',
      state: 'Rajasthan',
      circle: 'Rajasthan Circle',
      region: 'Jodhpur Region',
      division: 'Bikaner Division',
    })
    fs.writeFileSync(path.join(OUT_DIR, 'pincodes.json'), JSON.stringify([...offices.values()]))
    addedRecords.push('331803 | Sri Dungargarh - Rani Bazzar (SO, Bikaner, Rajasthan)')
    console.log('[FIX] Added missing record:', addedRecords[0])
  } else {
    console.log('[OK] Sri Dungargarh - Rani Bazzar already present')
  }

  // ---- Stats
  const sizes = {
    pincodes_json: (fs.statSync(path.join(OUT_DIR, 'pincodes.json')).size / 1e6).toFixed(1),
    bank_branches_json: (fs.statSync(path.join(OUT_DIR, 'bank_branches.json')).size / 1e6).toFixed(1),
  }
  console.log('Files written:')
  console.table(sizes)
  console.log(`Skipped malformed rows: ${skipped}`)
  console.log(`Bank types missing classification: ${bankTypeMissing}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
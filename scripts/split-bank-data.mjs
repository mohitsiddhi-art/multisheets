#!/usr/bin/env node
/**
 * split-bank-data.mjs
 * Splits data/bank_branches.json into per-state files under public/data/banks-by-state/
 * Also creates index.json mapping state names to filenames.
 *
 * Usage: node scripts/split-bank-data.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const OUT_DIR = path.resolve(process.cwd(), 'public', 'data', 'banks-by-state')

// Ensure output directory exists
fs.mkdirSync(OUT_DIR, { recursive: true })

console.log('📖 Reading bank_branches.json...')
const raw = fs.readFileSync(path.join(DATA_DIR, 'bank_branches.json'), 'utf8')
const branches = JSON.parse(raw)
console.log(`   ${branches.length.toLocaleString()} branches loaded`)

// Group by state
const byState = new Map()
for (const branch of branches) {
  const state = branch.state || 'Unknown'
  if (!byState.has(state)) byState.set(state, [])
  byState.get(state).push(branch)
}

console.log(`\n📁 Splitting into ${byState.size} state files...`)

const index = {}
for (const [state, records] of byState) {
  // Create filename: lowercase, spaces to hyphens, special chars removed
  const filename = state
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const filePath = path.join(OUT_DIR, `${filename}.json`)
  fs.writeFileSync(filePath, JSON.stringify(records))

  index[state] = {
    file: `${filename}.json`,
    count: records.length,
    size: (fs.statSync(filePath).size / 1024 / 1024).toFixed(2) + ' MB',
  }

  console.log(`   ✅ ${state}: ${records.length.toLocaleString()} branches → ${filename}.json`)
}

// Write index
fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2))

// Summary
const totalSize = Object.values(index).reduce((sum, v) => sum + parseFloat(v.size), 0)
console.log(`\n📊 Summary:`)
console.log(`   States: ${byState.size}`)
console.log(`   Total size: ${totalSize.toFixed(1)} MB`)
console.log(`   Output: ${OUT_DIR}`)
console.log(`   Index: ${path.join(OUT_DIR, 'index.json')}`)

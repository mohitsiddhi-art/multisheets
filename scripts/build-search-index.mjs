#!/usr/bin/env node
/**
 * build-search-index.mjs
 * Builds lightweight search indexes for client-side use:
 *   - ifsc-to-state.json: Maps IFSC → state name (for fetching correct state file)
 *   - stats.json: Dataset statistics
 *   - bank-names.json: List of all bank names for autocomplete
 *   - states-list.json: List of all states
 *
 * Usage: node scripts/build-search-index.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const DATA_DIR = path.resolve(process.cwd(), 'data')
const PUBLIC_DATA = path.resolve(process.cwd(), 'public', 'data')

fs.mkdirSync(PUBLIC_DATA, { recursive: true })

// Load data
console.log('📖 Loading data files...')
const pincodes = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'pincodes.json'), 'utf8'))
const branches = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'bank_branches.json'), 'utf8'))
console.log(`   Pincodes: ${pincodes.length.toLocaleString()}`)
console.log(`   Branches: ${branches.length.toLocaleString()}`)

// Build IFSC → state index (lightweight, just maps IFSC to state)
console.log('\n🔧 Building IFSC-to-state index...')
const ifscToState = {}
for (const branch of branches) {
  ifscToState[branch.ifsc] = branch.state
}
const ifscPath = path.join(PUBLIC_DATA, 'ifsc-to-state.json')
fs.writeFileSync(ifscPath, JSON.stringify(ifscToState))
const ifscSize = (fs.statSync(ifscPath).size / 1024 / 1024).toFixed(1)
console.log(`   IFSC count: ${Object.keys(ifscToState).length.toLocaleString()}`)
console.log(`   Index size: ${ifscSize} MB`)

// Extract unique bank names
const bankNames = [...new Set(branches.map(b => b.bank_name))].sort()
const bankNamesPath = path.join(PUBLIC_DATA, 'bank-names.json')
fs.writeFileSync(bankNamesPath, JSON.stringify(bankNames))
console.log(`   Bank names: ${bankNames.length} → bank-names.json`)

// Extract unique states
const states = [...new Set(branches.map(b => b.state))].sort()
const statesPath = path.join(PUBLIC_DATA, 'states-list.json')
fs.writeFileSync(statesPath, JSON.stringify(states))
console.log(`   States: ${states.length} → states-list.json`)

// Build stats
console.log('\n📊 Building stats...')
const stats = {
  pincodes: pincodes.length,
  uniquePincodes: new Set(pincodes.map(p => p.pincode)).size,
  branches: branches.length,
  uniqueIFSCs: new Set(branches.map(b => b.ifsc)).size,
  banks: bankNames.length,
  states: states.length,
  statesList: states,
}
const statsPath = path.join(PUBLIC_DATA, 'stats.json')
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2))
console.log(`✅ Stats written: ${statsPath}`)

// Summary
console.log(`\n📊 Dataset Statistics:`)
console.log(`   Total PIN codes: ${stats.pincodes.toLocaleString()} (${stats.uniquePincodes.toLocaleString()} unique)`)
console.log(`   Total branches: ${stats.branches.toLocaleString()} (${stats.uniqueIFSCs.toLocaleString()} unique IFSCs)`)
console.log(`   Banks: ${stats.banks}`)
console.log(`   States/UTs: ${stats.states}`)
console.log(`\n📁 Output files:`)
console.log(`   ${ifscPath} (${ifscSize} MB)`)
console.log(`   ${bankNamesPath}`)
console.log(`   ${statesPath}`)
console.log(`   ${statsPath}`)

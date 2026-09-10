'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang, useTheme } from '@/components/Providers'
import { copyText, shareUrl } from '@/lib/utils'
import { LANGS, type Dict } from '@/lib/translations'

// Types matching API response
type SearchResult =
  | {
      kind: 'pincode'
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
  | {
      kind: 'branch'
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

type Filter = 'all' | 'ifsc' | 'bank' | 'pincode' | 'location'

export default function SearchBox({ initialQuery = '', initialFilter = 'all' }: { initialQuery?: string; initialFilter?: Filter }) {
  const { t } = useLang()
  const { theme } = useTheme()

  const [query, setQuery] = useState(initialQuery)
  const [filter, setFilter] = useState<Filter>(initialFilter)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('ms-recent') || '[]')
    } catch (_e) {
      return []
    }
  })
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(localStorage.getItem('ms-favs') || '[]')
    } catch (_e) {
      return []
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Add to recent searches
  const addRecent = useCallback((q: string) => {
    setRecentSearches((prev) => {
      const next = [q, ...prev.filter((x) => x !== q)].slice(0, 10)
      localStorage.setItem('ms-recent', JSON.stringify(next))
      return next
    })
  }, [])

  // Toggle favorite
  const toggleFav = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = prev.includes(key)
        ? prev.filter((x) => x !== key)
        : [key, ...prev].slice(0, 20)
      localStorage.setItem('ms-favs', JSON.stringify(next))
      return next
    })
  }, [])

  // Search API call
  const doSearch = useCallback(
    async (q: string, f: Filter) => {
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()

      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&filter=${f}&limit=100`,
          { signal: abortRef.current.signal }
        )
        if (!res.ok) throw new Error('Search failed')
        const data = await res.json()
        setResults(data.results || [])
        setSuggestions(data.suggestions || [])
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError('Search failed. Please try again.')
          setResults([])
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Debounced search on input change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      setResults([])
      setSuggestions([])
      return
    }
    const timeoutId = setTimeout(() => {
      doSearch(query, filter)
    }, 200)
    debounceRef.current = timeoutId
    return () => clearTimeout(timeoutId)
  }, [query, filter, doSearch])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // / or Ctrl+K to focus search
      if (
        (e.key === '/' && e.target === document.body) ||
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // Escape to clear
      if (e.key === 'Escape') {
        setQuery('')
        setResults([])
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Voice search
  const startVoice = async () => {
    const w = window as any
    if (!('webkitSpeechRecognition' in w) && !('SpeechRecognition' in w)) {
      alert('Voice search not supported in this browser')
      return
    }
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = LANGS.find((l) => l.code === (document.documentElement.lang || 'en'))?.code || 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim()
      setQuery(transcript)
    }
    recognition.onerror = () => {
      // silently fail
    }
    recognition.start()
  }

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      doSearch(query, filter)
      addRecent(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setSuggestions([])
    inputRef.current?.focus()
  }

  // Result actions
  const copyResult = async (r: SearchResult) => {
    const text = r.kind === 'pincode' ? r.pincode : r.ifsc
    if (await copyText(text)) {
      // Could add toast here
    }
  }

  const shareResult = async (r: SearchResult) => {
    const text = r.kind === 'pincode'
      ? `PIN Code: ${r.pincode} — ${r.office_name}, ${r.district}, ${r.state} — Multisheets.com`
      : `IFSC: ${r.ifsc} — ${r.bank_name}, ${r.branch_name}, ${r.city}, ${r.state} — Multisheets.com`
    const url = shareUrl(r.kind === 'pincode' ? `/pincode/${r.pincode}` : `/ifsc/${r.ifsc}`)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Multisheets Result', text, url })
      } else {
        await copyText(text + '\n' + url)
      }
    } catch {
      // user cancelled
    }
  }

  const favKey = (r: SearchResult) => `${r.kind}:${r.kind === 'pincode' ? r.pincode : r.ifsc}`
  const isFav = (r: SearchResult) => favorites.includes(favKey(r))

  // ------------------------------------------------------------ render
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <label htmlFor="unified-search" className="sr-only">
              {t.searchPlaceholder}
            </label>
            <input
              ref={inputRef}
              id="unified-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 text-base transition"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={startVoice}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-primary transition"
              aria-label={t.voiceSearch}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? 'Searching…' : t.searchButton}
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Search filters">
          {(
            ['all', 'ifsc', 'bank', 'pincode', 'location'] as Filter[]
          ).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-pressed={filter === f}
            >
              {t.filters[f]}
            </button>
          ))}
        </div>

        {/* Keyboard hint */}
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">/</kbd>
          <span>{t.keyboardHint}</span>
          <span className="hidden sm:inline">•</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded hidden sm:inline">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded hidden sm:inline">K</kbd>
        </p>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-10">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(s)
                doSearch(s, filter)
                addRecent(s)
                setShowSuggestions(false)
              }}
              className="w-full px-4 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-100 dark:border-t border-slate-700 first:border-t-0 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-6" role="list" aria-label={t.resultsFound(results.length)}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            {t.resultsFound(results.length)}
          </h2>
          <div className="space-y-3">
            {results.map((r, i) => (
              <ResultCard
                key={i}
                result={r}
                t={t}
                onCopy={() => copyResult(r)}
                onShare={() => shareResult(r)}
                onFav={() => toggleFav(favKey(r))}
                isFav={isFav(r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state with suggestions */}
      {!loading && results.length === 0 && query.trim() && (
        <div className="mt-8 text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {t.noResults} <strong className="text-slate-900 dark:text-slate-500">"{query}"</strong>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {t.tryDifferent}
          </p>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s)
                    doSearch(s, filter)
                    addRecent(s)
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-primary hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && results.length === 0 && !query.trim() && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-500 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {t.recent}
          </h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.slice(0, 8).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setQuery(r)
                  doSearch(r, filter)
                }}
                className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-primary hover:text-white transition"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending searches */}
      {results.length === 0 && !query.trim() && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-500 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            {t.trending}
          </h3>
          <div className="flex flex-wrap gap-2">
            {['110001', 'SBIN0001707', '400001', 'HDFC0000001', '560001', 'ICIC0000001'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setQuery(r)
                  doSearch(r, filter)
                  addRecent(r)
                }}
                className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-primary hover:text-white transition"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------- ResultCard
interface ResultCardProps {
  result: SearchResult
  t: Dict
  onCopy: () => void
  onShare: () => void
  onFav: () => void
  isFav: boolean
}

function ResultCard({ result, t, onCopy, onShare, onFav, isFav }: ResultCardProps) {
  const isPincode = result.kind === 'pincode'

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
      role="listitem"
    >
      {/* Header with badge & type */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isPincode
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
            }`}
          >
            {isPincode ? '📮 PIN' : '🏦 IFSC'}
          </span>
          <code
            className="text-lg font-mono font-semibold text-slate-900 dark:text-slate-50"
          >
            {isPincode ? result.pincode : result.ifsc}
          </code>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            aria-label={t.copy}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          <button
            onClick={onShare}
            className="p-2 rounded-lg text-slate-500 hover:text-primary dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            aria-label={t.share}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="16.49" />
            </svg>
          </button>
          <button
            onClick={onFav}
            className={`p-2 rounded-lg transition ${
              isFav
                ? 'text-yellow-500'
                : 'text-slate-500 hover:text-yellow-500 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {isPincode ? (
          <>
            <DetailField label={t.officeName} value={result.office_name} />
            <DetailField label={t.officeType} value={result.office_type} />
            <DetailField label={t.delivery} value={result.delivery} />
            <DetailField label={t.district} value={result.district} />
            <DetailField label={t.state} value={result.state} />
            <DetailField label={t.circle} value={result.circle} />
            <DetailField label={t.region} value={result.region} />
            <DetailField label={t.division} value={result.division} />
          </>
        ) : (
          <>
            <DetailField label={t.bankName} value={result.bank_name} />
            <DetailField label={t.branchName} value={result.branch_name} />
            <DetailField label={t.city} value={result.city} />
            <DetailField label={t.district} value={result.district} />
            <DetailField label={t.state} value={result.state} />
            <DetailField label={t.bankType} value={result.bank_type} />
            <DetailField label={t.micr} value={result.micr} monospace />
            <DetailField label={t.contact} value={result.contact} />
          </>
        )}
      </div>

      {/* View details link */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-t border-slate-700">
        <a
          href={isPincode ? `/pincode/${result.pincode}` : `/ifsc/${result.ifsc}`}
          className="text-primary hover:underline text-sm font-medium"
        >
          {t.viewDetails}
        </a>
      </div>
    </div>
  )
}

// ---------------------------------------------------------- DetailField
function DetailField({
  label,
  value,
  monospace = false,
}: {
  label: string
  value: string
  monospace?: boolean
}) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
      <p className={`font-medium text-slate-900 dark:text-slate-50 ${monospace ? 'font-mono' : ''} truncate`}>
        {value}
      </p>
    </div>
  )
}
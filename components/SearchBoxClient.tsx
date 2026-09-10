'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import SearchBox from './SearchBox'

export default function SearchBoxClient() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use URL params on first mount, then let SearchBox manage its own state
  const query = mounted ? (searchParams.get('q') || '') : ''
  const filter = (mounted ? (searchParams.get('filter') || 'all') : 'all') as 'all' | 'ifsc' | 'bank' | 'pincode' | 'location'

  return <SearchBox initialQuery={query} initialFilter={filter} />
}
'use client'

/**
 * Providers — wraps the app with Theme (dark/light) and Language (en/hi)
 * state, both persisted to localStorage.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Dict, type Lang } from '@/lib/translations'

// --------------------------------------------------------------- theme
type Theme = 'light' | 'dark'

const ThemeCtx = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'light', toggleTheme: () => {} })

export function useTheme() {
  return useContext(ThemeCtx)
}

// --------------------------------------------------------------- lang
const LangCtx = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}>({ lang: 'en', setLang: () => {}, t: dictionaries.en })

export function useLang() {
  return useContext(LangCtx)
}

// --------------------------------------------------------------- provider
export default function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [lang, setLang] = useState<Lang>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('ms-theme') as Theme | null
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
    const savedLang = (localStorage.getItem('ms-lang') as Lang) || 'en'
    setLang(savedLang)
    document.documentElement.lang = savedLang === 'hi' ? 'hi' : 'en'
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('ms-theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('ms-lang', lang)
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en'
  }, [lang, mounted])

  const toggleTheme = () =>
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const t = dictionaries[lang]

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      <LangCtx.Provider value={{ lang, setLang, t }}>
        {children}
      </LangCtx.Provider>
    </ThemeCtx.Provider>
  )
}
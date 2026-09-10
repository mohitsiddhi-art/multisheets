'use client'

import { useState } from 'react'

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {}
      }}
      className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition"
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}

export function ShareButton({ text, url, label }: { text: string; url: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        const fullUrl = window.location.origin + url
        if (navigator.share) {
          try {
            await navigator.share({ title: text, text: text, url: fullUrl })
          } catch {}
        } else {
          await navigator.clipboard.writeText(text + '\n' + fullUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }}
      className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition"
    >
      {copied ? '✓ Copied' : label}
    </button>
  )
}

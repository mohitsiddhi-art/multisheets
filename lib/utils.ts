/**
 * Multisheets.com — client utilities
 */

/** Copy text to clipboard with fallback; returns success */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers / insecure context
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function shorten(s: string, n = 60): string {
  if (!s) return ''
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

/** Very small hash for keys */
export function hashCode(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

export function shareUrl(path: string): string {
  return typeof window !== 'undefined'
    ? window.location.origin + path
    : 'https://multisheets.com' + path
}

export function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export function titleCase(s: string): string {
  if (!s) return s
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Convert an Indian phone contact string to a tel: link */
export function telHref(contact: string): string {
  const digits = contact.replace(/\D/g, '')
  return digits.length >= 10 ? `tel:+91${digits.slice(-10)}` : `tel:${contact}`
}
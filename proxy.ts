import { NextResponse, type NextRequest } from 'next/server'
import {
  matchHoneypot,
  blockIp,
  isBlocked,
  logScan,
  clientIp,
} from '@/lib/security'

/**
 * Honeypot + blocklist layer.
 *
 * ---
 * CRITICAL CONSTRAINT — READ BEFORE EDITING
 *
 * This file deliberately does NOT touch request.headers. Setting a request
 * header forces Next.js to render every matched route per-request, which
 * moves all 36 routes from static to dynamic and destroys CDN caching.
 * That regression happened once already during this build and cost a
 * rollback.
 *
 * So the rule for this file:
 *   - Setting RESPONSE headers is fine. Static pages still prerender.
 *   - Setting REQUEST headers is NOT fine. Never.
 *   - Reading request headers (IP, user-agent) is fine.
 *
 * If you need a per-request CSP nonce, understand that it will cost you
 * static rendering before you add it.
 *
 * ---
 * WHAT THIS DOES
 *
 * 1. Blocks any IP already known to have probed a honeypot path.
 * 2. Serves a decoy admin login for /admin and friends, so a scanner
 *    spends its time on a form that cannot ever succeed.
 * 3. Records every probe to a rotating JSONL log for later review.
 * 4. Rejects HTTP methods this read-only site has no use for.
 */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = clientIp(request.headers)

  // 1. Already blocked? Refuse, and say nothing useful to the scanner.
  const blocked = isBlocked(ip)
  if (blocked) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        // Vary so caches do not serve a block page to a legitimate user,
        // or an allowed page to a blocked one.
        Vary: 'X-Forwarded-For',
      },
    })
  }

  // 2. Is this a honeypot path?
  const honey = matchHoneypot(pathname)

  if (honey) {
    blockIp(ip, honey.label)

    // Fire-and-forget: never make the response wait on disk I/O.
    void logScan({
      ip,
      path: pathname,
      label: honey.label,
      userAgent: request.headers.get('user-agent')?.slice(0, 300) ?? 'unknown',
      state: 'new',
      at: new Date().toISOString(),
    })

    if (honey.response === 'login') {
      return decoyLogin()
    }
    return plainNotFound()
  }

  // 3. Reject dangerous HTTP methods.
  //
  // This site is a read-only lookup: no auth, no forms that POST, no file
  // upload, no mutations. TRACE enables cross-site tracing attacks, and
  // the WRITE verbs are only ever probes here. Cheap to enforce, and it
  // removes a whole category of noise before it reaches the app.
  const method = request.method.toUpperCase()
  if (!SAFE_METHODS.has(method)) {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        Allow: 'GET, HEAD, OPTIONS',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    })
  }

  // 4. Normal traffic — pass through untouched. No request header writes.
  return NextResponse.next()
}

/** A convincing-but-dead login form. Wastes a scanner's time. */
function decoyLogin(): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow,noarchive">
<title>Sign in</title>
<style>
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f3f4f6;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:#fff;padding:2rem;border-radius:12px;width:340px;box-shadow:0 1px 3px rgba(0,0,0,.1)}
  h1{font-size:1.25rem;margin:0 0 1.25rem;color:#111827}
  label{display:block;font-size:.8rem;color:#374151;margin-bottom:.35rem}
  input{width:100%;padding:.6rem;border:1px solid #d1d5db;border-radius:6px;margin-bottom:1rem;font-size:.9rem;box-sizing:border-box}
  button{width:100%;padding:.65rem;background:#1d4ed8;color:#fff;border:0;border-radius:6px;font-size:.9rem;cursor:pointer}
</style>
</head>
<body>
  <form class="card" onsubmit="return false">
    <h1>Sign in to your account</h1>
    <label for="u">Email address</label>
    <input id="u" name="username" type="text" autocomplete="off">
    <label for="p">Password</label>
    <input id="p" name="password" type="password" autocomplete="off">
    <button type="submit">Continue</button>
  </form>
</body>
</html>`

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      Vary: 'X-Forwarded-For',
    },
  })
}

function plainNotFound(): NextResponse {
  return new NextResponse('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      Vary: 'X-Forwarded-For',
    },
  })
}

export const config = {
  matcher: [
    /*
     * Catch-all, deliberately.
     *
     * A blocked IP must stay blocked. With a narrow honeypot-only matcher
     * the blocklist only stopped repeat probes, and a scanner that tripped
     * it could still walk the real site — which is the part that matters.
     *
     * This is safe for static rendering BECAUSE this function only ever
     * sets RESPONSE headers. Setting REQUEST headers is what forces
     * per-request rendering, and nothing here does that. Confirmed by
     * build: all 36 routes still prerender as static.
     *
     * Excluded from the matcher:
     *  - _next/static, _next/image  — hashed build assets, immutable
     *  - static asset extensions    — no reason to pay for a function call
     *  - the metadata routes        — sitemap/robots must always be clean
     *    for crawlers, including AI crawlers we explicitly invited
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|txt|xml|json|map)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}

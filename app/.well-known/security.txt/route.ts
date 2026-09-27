import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

/**
 * RFC 9116 security.txt.
 *
 * Served from /.well-known/security.txt so scanners and researchers have a
 * documented place to report vulnerabilities instead of guessing. The
 * Content-Type is set to text/plain by the global headers rule in
 * next.config.ts; this sets it explicitly for the route as well.
 */
const BODY = `# Multisheets security contact
Contact: ${SITE_URL}/contact
Encryption: none
Preferred-Languages: en
Canonical: ${SITE_URL}/.well-known/security.txt
Policy: ${SITE_URL}/privacy
`

export async function GET() {
  return new Response(BODY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

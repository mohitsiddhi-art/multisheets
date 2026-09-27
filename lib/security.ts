/**
 * Security layer: honeypot detection, scanner logging, and IP blocking.
 *
 * ---
 * WHY THIS EXISTS
 *
 * Automated scanners probe a newly deployed site within hours. The first
 * requests they send are almost always for paths that do not exist on a
 * normal site:
 *
 *   /admin  /.env  /.git/config  /wp-login.php  /phpmyadmin
 *
 * A site that serves nothing for those paths looks exactly like a site
 * that serves nothing useful. But we can do better: serve a plausible
 * decoy, record who asked, and refuse them from then on. That turns passive
 * noise into an active signal, and it costs almost nothing to run.
 *
 * This site has no admin panel, no database credentials in the filesystem,
 * and no WordPress. Every hit on these paths is therefore, by definition,
 * a scanner or an attacker. There are no false positives to worry about.
 */

import { appendFile, mkdir, stat, rename } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

// ---------------------------------------------------------------
// Honeypot paths
// ---------------------------------------------------------------

export interface Honeypot {
  /** Path or prefix that is bait. */
  path: string
  /** Human label for the log, so the log says why it was hit. */
  label: string
  /**
   * 'login' serves a decoy form that submits nowhere — this wastes the
   * scanner's time and, more importantly, wastes THEIR automation budget
   * on a form that can never succeed.
   *
   * 'notfound' returns a plain 404. Used for file paths, where a decoy
   * makes no sense.
   */
  response: 'login' | 'notfound'
}

export const HONEYPOTS: Honeypot[] = [
  // Panels and admin surfaces
  { path: '/admin', label: 'admin-panel', response: 'login' },
  { path: '/administrator', label: 'admin-panel', response: 'login' },
  { path: '/admin/login', label: 'admin-panel', response: 'login' },
  { path: '/panel', label: 'admin-panel', response: 'login' },
  { path: '/dashboard/admin', label: 'admin-panel', response: 'login' },
  { path: '/api/admin', label: 'api-admin', response: 'login' },
  { path: '/api/v1/auth', label: 'api-admin', response: 'login' },
  { path: '/manager/html', label: 'tomcat-manager', response: 'login' },
  { path: '/console', label: 'spring-console', response: 'login' },

  // Config and secret files
  { path: '/.env', label: 'env-file', response: 'notfound' },
  { path: '/.env.local', label: 'env-file', response: 'notfound' },
  { path: '/.env.production', label: 'env-file', response: 'notfound' },
  { path: '/config.json', label: 'config-file', response: 'notfound' },
  { path: '/config.php', label: 'config-file', response: 'notfound' },
  { path: '/configuration.php', label: 'config-file', response: 'notfound' },

  // Version control and deploy metadata
  { path: '/.git', label: 'git-exposure', response: 'notfound' },
  { path: '/.git/config', label: 'git-exposure', response: 'notfound' },
  { path: '/.git/HEAD', label: 'git-exposure', response: 'notfound' },
  { path: '/.svn/entries', label: 'svn-exposure', response: 'notfound' },
  { path: '/.hg/requires', label: 'hg-exposure', response: 'notfound' },
  { path: '/.DS_Store', label: 'mac-metadata', response: 'notfound' },
  { path: '/Dockerfile', label: 'deploy-metadata', response: 'notfound' },
  { path: '/docker-compose.yml', label: 'deploy-metadata', response: 'notfound' },
  { path: '/package.json', label: 'deploy-metadata', response: 'notfound' },
  { path: '/next.config.js', label: 'deploy-metadata', response: 'notfound' },

  // Cloud and SSH credentials
  { path: '/.aws', label: 'cloud-credentials', response: 'notfound' },
  { path: '/.aws/credentials', label: 'cloud-credentials', response: 'notfound' },
  { path: '/.ssh/id_rsa', label: 'ssh-credentials', response: 'notfound' },
  { path: '/id_rsa', label: 'ssh-credentials', response: 'notfound' },
  { path: '/.kube/config', label: 'k8s-credentials', response: 'notfound' },

  // Database dumps and backups
  { path: '/backup.sql', label: 'database-dump', response: 'notfound' },
  { path: '/dump.sql', label: 'database-dump', response: 'notfound' },
  { path: '/database.sql', label: 'database-dump', response: 'notfound' },
  { path: '/backup.zip', label: 'database-dump', response: 'notfound' },
  { path: '/site.zip', label: 'database-dump', response: 'notfound' },

  // WordPress / PHP stacks — the single most-scanned family
  { path: '/wp-admin', label: 'wordpress-probe', response: 'notfound' },
  { path: '/wp-login.php', label: 'wordpress-probe', response: 'notfound' },
  { path: '/xmlrpc.php', label: 'wordpress-probe', response: 'notfound' },
  { path: '/wp-includes', label: 'wordpress-probe', response: 'notfound' },
  { path: '/wp-content', label: 'wordpress-probe', response: 'notfound' },
  { path: '/phpmyadmin', label: 'php-stack-probe', response: 'notfound' },
  { path: '/pma', label: 'php-stack-probe', response: 'notfound' },
  { path: '/vendor/phpunit', label: 'php-rce-probe', response: 'notfound' },

  // Server internals and shells
  { path: '/server-status', label: 'server-internals', response: 'notfound' },
  { path: '/server-info', label: 'server-internals', response: 'notfound' },
  { path: '/.htaccess', label: 'server-internals', response: 'notfound' },
  { path: '/.htpasswd', label: 'server-internals', response: 'notfound' },
  { path: '/cgi-bin', label: 'cgi-shell', response: 'notfound' },

  // App frameworks
  { path: '/actuator', label: 'spring-boot-probe', response: 'notfound' },
  { path: '/debug/vars', label: 'go-probe', response: 'notfound' },
  { path: '/_debug', label: 'framework-probe', response: 'notfound' },
]

/** Longest match wins, so /admin/login reports its own label. */
export function matchHoneypot(pathname: string): Honeypot | null {
  let best: Honeypot | null = null
  for (const h of HONEYPOTS) {
    if (pathname === h.path || pathname.startsWith(h.path + '/')) {
      if (!best || h.path.length > best.path.length) best = h
    }
  }
  return best
}

// ---------------------------------------------------------------
// Blocklist
// ---------------------------------------------------------------

interface BlockEntry {
  blockedAt: number
  reason: string
  count: number
}

const blockMap = new Map<string, BlockEntry>()
const BLOCK_TTL = 24 * 60 * 60 * 1000 // 24 hours
const MAX_BLOCKED = 50_000

export function blockIp(ip: string, reason: string) {
  const existing = blockMap.get(ip)
  if (existing) {
    existing.count++
    existing.blockedAt = Date.now()
  } else {
    if (blockMap.size >= MAX_BLOCKED) {
      // Evict the oldest rather than grow without bound. A scanner with a
      // huge IP pool could otherwise turn the blocklist into a memory leak.
      let oldestKey: string | null = null
      let oldestTs = Infinity
      for (const [k, v] of blockMap) {
        if (v.blockedAt < oldestTs) {
          oldestTs = v.blockedAt
          oldestKey = k
        }
      }
      if (oldestKey) blockMap.delete(oldestKey)
    }
    blockMap.set(ip, { blockedAt: Date.now(), reason, count: 1 })
  }
}

export function isBlocked(ip: string): BlockEntry | null {
  const entry = blockMap.get(ip)
  if (!entry) return null
  if (Date.now() - entry.blockedAt > BLOCK_TTL) {
    blockMap.delete(ip)
    return null
  }
  return entry
}

// ---------------------------------------------------------------
// Scan logging
// ---------------------------------------------------------------

export interface ScanEvent {
  ip: string
  path: string
  label: string
  userAgent: string
  /** 'blocked' = already on the list, 'new' = first offence. */
  state: 'new' | 'repeat'
  at: string
}

function logPath(): string {
  return join(tmpdir(), 'multisheets-security', 'scans.jsonl')
}

let logBroken = false

/**
 * Append one JSON line per scan.
 *
 * Writes to tmpdir rather than the project directory: the app may run
 * read-only on some hosts, and security logs are transient operational
 * data, not source. Failure is swallowed — a site that cannot write a log
 * must still serve traffic.
 */
export async function logScan(event: ScanEvent): Promise<void> {
  if (logBroken) return
  try {
    const dir = join(tmpdir(), 'multisheets-security')
    const file = logPath()

    // Rotate at roughly 5 MB so the file cannot fill the disk.
    try {
      const s = await stat(file)
      if (s.size > 5 * 1024 * 1024) {
        await rename(file, `${file}.1`)
      }
    } catch {
      // No file yet — normal on first run.
    }

    await mkdir(dir, { recursive: true })
    await appendFile(file, JSON.stringify(event) + '\n', 'utf8')
  } catch {
    // Set the flag so we stop retrying on every request.
    logBroken = true
  }
}

// ---------------------------------------------------------------
// Client IP
// ---------------------------------------------------------------

/**
 * Best-effort client IP.
 *
 * See the note in app/api/search/route.ts: x-forwarded-for is
 * client-supplied, so we read the LAST hop (the one a trusted reverse
 * proxy appends) and fall back to a shared bucket. This is for logging
 * and coarse blocking, not for authentication.
 */
export function clientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const chain = xff.split(',').map((s) => s.trim()).filter(Boolean)
    if (chain.length) return chain[chain.length - 1]
  }
  return headers.get('x-real-ip')?.trim() || 'unidentified'
}

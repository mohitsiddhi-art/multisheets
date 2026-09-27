# Deploying Multisheets

The site is a static-export-friendly Next.js app behind nginx. Two things must
be true in production for the security work to hold: the edge must be the
enforcing layer, and the Node process must not be reachable except through it.

## What lives here

| File | Purpose |
| --- | --- |
| `nginx.multisheets.conf` | Reverse proxy, TLS, rate limits, hard blocks for secret-file scanners |
| `ecosystem.config.cjs` | PM2 process definition for `next start` |

Both files are configured for this host:

- user `u747113332`
- project `/home/u747113332/domains/multisheets.com/public_html`
- SSH `ssh -p 65002 u747113332@82.112.229.152`

The only thing you must supply is the SSH password, which is not stored here.

## Why the config is not optional

`lib/security.ts` keeps an in-memory blocklist, and
`app/api/search/route.ts` rate-limits per IP. Both are only trustworthy if the
client IP cannot be forged. In the app, the IP is read from
`X-Forwarded-For`, which a client can set to any value when talking to Node
directly. nginx overwrites that header with `$remote_addr` on every proxied
request, so the app can only ever see the real address. If the app is
exposed on a port other than 3000, none of this holds.

The blocklist also only covers honeypot paths. Blocking an abusive IP from
*every* route is an edge job, and `limit_req` is the only rate limit that
survives a cold start or a redeploy.

## Order of operations

1. Build and verify locally:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. Push, then on the VPS:
   ```bash
   git pull
   npm ci
   npm run build
   pm2 start deploy/ecosystem.config.cjs --env production
   pm2 save
   ```
3. Install the nginx site:
   ```bash
   sudo cp deploy/nginx.multisheets.conf /etc/nginx/sites-available/multisheets
   sudo ln -s /etc/nginx/sites-available/multisheets /etc/nginx/sites-enabled/multisheets
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Confirm the edge is really in front:
   ```bash
   curl -sI https://multisheets.com/.env           # expect 404, not the app
   curl -sI https://multisheets.com/.well-known/security.txt   # expect 200
   ```
5. Confirm `http://<vps-ip>:3000` does not respond. If it does, the app is
   exposed and the header-based protections above can be bypassed.

## After deploy

Honeypot hits are appended to `var/security/scans.jsonl`, rotated at 5 MB.
That path must be writable by the process user and should not be served by
nginx. Read it with `tail -f` to see scanners arriving.

## Known follow-ups

- The Speed Post calculator and the Speed Post article still use pre-October
  2026 tariffs. Update both against the India Post notification before
  publishing.
- `components/Footer.tsx` links to social profiles that returned 404 during
  verification. `SOCIAL_PROFILES` in `lib/seo.tsx` is empty for the same
  reason, which is why `Organization.sameAs` is omitted from the JSON-LD.
  Populate both only with profiles confirmed to load.

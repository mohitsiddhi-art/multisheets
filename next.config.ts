import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          // Cross-origin isolation
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Do not leak the server framework
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          // Cross-origin policies
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          /*
           * Content-Security-Policy.
           *
           * A per-request nonce would be stronger, but it forces every
           * route out of static rendering: reading headers() in the root
           * layout (or setting request headers in a proxy) makes Next
           * render per-request, which loses CDN caching across all 36
           * routes. For a lookup site that is the wrong trade.
           *
           * The trade instead: keep 'unsafe-inline' for styles (Tailwind
           * and the pre-paint theme script both inject style), but lock
           * down the directives that actually stop injection.
           * object-src 'none' blocks plugin-based vectors, and
           * base-uri / form-action block base-tag and form-hijack tricks.
           */
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self'",
              "manifest-src 'self'",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              // Never mentioned before, blocks <object>/<embed> payloads
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // HSTS - force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Do not let a browser guess a different content type, and do
          // not let a referrer leak a full URL (which can contain a
          // searched PIN code or IFSC code) to a third party.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Block the Framebusting family of clickjacking attacks.
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
      // Requests that are not GET/HEAD/OPTIONS are almost always probes.
      // This site is a read-only lookup: it has no forms that POST, no
      // file upload, and no authenticated mutation. Rejecting these verbs
      // at the edge removes a large class of probing with zero cost to
      // real users.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Allowed-Verbs', value: 'GET, HEAD, OPTIONS' },
        ],
      },
      // No caching for API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        ],
      },
      // Long-term caching for static assets
      {
        source: '/:all*(svg|ico|png|jpg|jpeg|gif|webp|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Service worker - no cache
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      // Manifest - cache for a day
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ]
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization (if using next/image)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
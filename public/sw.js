/**
 * Multisheets Service Worker
 * Provides offline support with cache eviction and offline fallback
 */

const CACHE_NAME = 'multisheets-v2';
const MAX_CACHE_ENTRIES = 200; // Max cached API responses
const STATIC_ASSETS = [
  '/',
  '/search',
  '/tools',
  '/tools/speed-post',
  '/tools/pincode-finder',
  '/tools/ifsc-finder',
  '/tools/bank-locator',
  '/tools/pincode-validator',
  '/tools/ifsc-validator',
  '/tools/address-validator',
  '/about',
  '/faq',
  '/contact',
  '/disclaimer',
  '/privacy',
  '/terms',
  '/blog',
  '/holidays',
  '/states',
  '/news',
  '/scam-alert',
  '/quiz',
  '/dashboard',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg',
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline — Multisheets</title>
<style>
body{font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f8fafc;color:#334155}
.box{text-align:center;padding:2rem}
h1{font-size:1.5rem;margin-bottom:.5rem}
p{color:#64748b}
a{color:#2563eb;text-decoration:none}
</style>
</head>
<body>
<div class="box">
<h1>📡 You're offline</h1>
<p>Multisheets needs an internet connection for fresh data.</p>
<p>Cached pages may still be available.</p>
<p><a href="/">Go to Homepage</a></p>
</div>
</body>
</html>`;

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cache offline fallback first
      await cache.put('/offline', new Response(OFFLINE_HTML, {
        headers: { 'Content-Type': 'text/html' },
      }));
      // Cache static assets
      return cache.addAll(STATIC_ASSETS.map((url) => new Request(url, { cache: 'reload' })));
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Evict oldest entries when cache exceeds limit
async function evictOldEntries(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_CACHE_ENTRIES) {
    // Delete oldest half
    const toDelete = keys.slice(0, Math.floor(MAX_CACHE_ENTRIES / 2));
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

// Fetch - network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // API requests - network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
            await evictOldEntries(cache);
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // Static assets - cache first, fallback to network, then offline page
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, response.clone());
          return response;
        }
        // For navigation requests, serve offline fallback
        if (event.request.mode === 'navigate') {
          const offline = await caches.match('/offline');
          return offline || new Response('Offline', { status: 503 });
        }
        return response;
      }).catch(async () => {
        // Navigation offline fallback
        if (event.request.mode === 'navigate') {
          const offline = await caches.match('/offline');
          return offline || new Response('Offline', { status: 503 });
        }
        return new Response('', { status: 503 });
      });
    })
  );
});

// Handle skipWaiting message
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

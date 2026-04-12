const CACHE_NAME = 'ahli-connect-v6';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/dashboard',
  '/offline',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/logo-login.svg',
];

// Install — cache static assets + offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches, take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Helper: check if a response is safe to cache (not a redirect, not an error)
function isCacheable(response) {
  return response && response.status === 200 && !response.redirected && response.type !== 'opaqueredirect';
}

// Fetch handler with smart caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Skip API routes — always go to network
  if (url.pathname.startsWith('/api/')) return;

  // ── Strategy 1: Next.js static bundles (/_next/static/) — Cache First
  // These are content-hashed, so once cached they're valid forever
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (isCacheable(response)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // ── Strategy 2: Next.js data/dynamic chunks (/_next/) — Stale While Revalidate
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (isCacheable(response)) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached || new Response('', { status: 503 }));

        return cached || fetchPromise;
      })
    );
    return;
  }

  // ── Strategy 3: Navigation requests — Network First (NEVER serve cached redirects)
  // This is critical for PWA relaunch — cached redirects cause fatal errors
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache non-redirect, successful responses
          if (isCacheable(response)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline: serve cached version of THIS page, or /dashboard, or offline page
          return caches.match(event.request).then((cached) => {
            if (cached && !cached.redirected) return cached;
            return caches.match('/dashboard').then((dashboard) => {
              if (dashboard && !dashboard.redirected) return dashboard;
              return caches.match(OFFLINE_URL) || new Response('Offline', {
                status: 503,
                headers: { 'Content-Type': 'text/plain' },
              });
            });
          });
        })
    );
    return;
  }

  // ── Strategy 4: Everything else (images, fonts, etc.) — Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (isCacheable(response)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached || new Response('', { status: 503 }));

      return cached || fetchPromise;
    })
  );
});

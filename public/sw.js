const CACHE_NAME = 'ahli-connect-v3';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
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
      // Use addAll for critical assets, but don't fail if some aren't available yet
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Fallback: try adding each individually
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) => cache.add(url).catch(() => {}))
        );
      });
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
          if (response.status === 200) {
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
            if (response.status === 200) {
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

  // ── Strategy 3: Navigation requests — Stale While Revalidate with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Offline: serve cached version, or cached root, or offline page
            if (cached) return cached;
            return caches.match('/').then((root) => {
              if (root) return root;
              return caches.match(OFFLINE_URL);
            });
          });

        // Return cached immediately if available, update in background
        return cached || fetchPromise;
      })
    );
    return;
  }

  // ── Strategy 4: Everything else (images, fonts, etc.) — Stale While Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
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

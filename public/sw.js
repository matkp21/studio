
// Placeholder Service Worker
const CACHE_NAME = 'mediassistant-cache-v1';
const urlsToCache = [
  '/',
  // Add other important assets you want to pre-cache here
  // For example: '/styles/globals.css', '/app.js'
  // Be mindful of what you cache to ensure updates are handled correctly.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache');
        // return cache.addAll(urlsToCache); // Pre-caching - use with caution
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event');
  // Perform activation steps, e.g., cleaning up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // console.log('[Service Worker] Fetch event for:', event.request.url);
  // Basic cache-first strategy (example, can be more sophisticated)
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // console.log('[Service Worker] Found in cache:', event.request.url);
          return response;
        }
        // console.log('[Service Worker] Network request for:', event.request.url);
        return fetch(event.request).then(
          (networkResponse) => {
            // If you want to cache new requests dynamically:
            // if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            //   const responseToCache = networkResponse.clone();
            //   caches.open(CACHE_NAME)
            //     .then((cache) => {
            //       cache.put(event.request, responseToCache);
            //     });
            // }
            return networkResponse;
          }
        );
      }).catch((error) => {
        // Optional: Fallback for offline, e.g., return a custom offline page
        // console.error('[Service Worker] Fetch failed; returning offline page if applicable.', error);
        // return caches.match('/offline.html'); 
      })
  );
});

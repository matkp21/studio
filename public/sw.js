
const CACHE_NAME_STATIC = 'mediassistant-static-v2'; // Increment version when app shell changes
const CACHE_NAME_DYNAMIC = 'mediassistant-dynamic-v2';
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-16x16.png',
  '/icons/favicon-32x32.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  // Critical CSS/JS - In Next.js, these paths are dynamic with hashes.
  // It's better to let Next.js handle its own JS/CSS chunk caching via its build process.
  // The service worker can cache the main HTML entry points and the offline page.
  // We will cache pages as they are visited.
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...', event);
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      console.log('[Service Worker] Precaching App Shell and static assets');
      // Add core assets that don't change often.
      // For Next.js, the HTML pages are more dynamic due to SSR/SSG.
      // It's often better to cache them on first visit (runtime caching).
      return cache.addAll(STATIC_ASSETS.filter(asset => !asset.startsWith('/_next/static/')));
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...', event);
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy: Network first, then Cache, then Offline page for navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If successful, clone the response and cache it for dynamic content
          const responseClone = response.clone();
          caches.open(CACHE_NAME_DYNAMIC).then((cache) => {
            cache.put(request.url, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, serve offline page
            return caches.match('/offline.html');
          });
        })
    );
  }
  // Strategy: Cache first, then Network for static assets (CSS, JS, Images, Fonts)
  // This is a general strategy; Next.js build outputs often have hashes, making them immutable.
  // Its own caching headers might be sufficient. This SW strategy provides an additional layer for PWA.
  else if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && !url.protocol.startsWith('http')) {
            return networkResponse; // Don't cache opaque responses or non-http resources
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME_DYNAMIC).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          // Optionally, return a placeholder if assets fail to load and aren't cached
          // For example, a placeholder image. For now, let it fail to show network dependency.
        });
      })
    );
  }
  // For other types of requests (e.g., API calls), usually network-first or let them pass through.
  // This example does not implement caching for API calls.
});

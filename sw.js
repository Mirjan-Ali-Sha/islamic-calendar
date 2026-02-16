/**
 * Service Worker — Islamic Calendar PWA
 * Cache-first strategy for offline support.
 */

const CACHE_NAME = 'islamic-calendar-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './hijri.js',
    './events.js',
    './prayer-times.js',
    './cities.js',
    './app.js',
    './manifest.json',
    './icons/icon-192.svg',
    './icons/icon-512.svg'
];

// Install — cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — cache-first, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET and cross-origin
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    // Cache successful responses
                    if (response.ok && response.type === 'basic') {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    }
                    return response;
                });
            })
            .catch(() => {
                // Offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            })
    );
});

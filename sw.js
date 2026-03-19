/**
 * Service Worker — Islamic Calendar PWA
 * Cache-first strategy for offline support.
 * Supports controlled updates via client messaging.
 *
 * ╔══════════════════════════════════════════════════════╗
 * ║  SW VERSION — Must match APP_VERSION in app.js       ║
 * ║  Change this whenever you update APP_VERSION         ║
 * ╚══════════════════════════════════════════════════════╝
 */
const SW_VERSION = '1.8.10';
const CACHE_NAME = `islamic-calendar-v${SW_VERSION}`;
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './hijri.js',
    './events.js',
    './prayer-times.js',
    './cities.js',
    './islamic-content.js',
    './app.js',
    './manifest.json',
    './icons/icon-192.svg',
    './icons/icon-512.svg'
];

// Install — cache all assets (do NOT skipWaiting automatically)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
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

// Listen for SKIP_WAITING message from the client
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Fetch — cache-first for same-origin, stale-while-revalidate for Google Fonts
self.addEventListener('fetch', event => {
    // Skip non-GET
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Google Fonts (CSS + font files): cache with stale-while-revalidate
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache =>
                cache.match(event.request).then(cached => {
                    const fetchPromise = fetch(event.request).then(response => {
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    }).catch(() => cached); // If network fails, use cache

                    return cached || fetchPromise;
                })
            )
        );
        return;
    }

    // Same-origin: cache-first, fallback to network
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(response => {
                    // Cache successful same-origin responses
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

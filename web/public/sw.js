/**
 * Minimal service worker for PWA installability.
 * Add caching (e.g. Workbox) later for offline support if needed.
 */
const CACHE_VERSION = "pixelmind-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

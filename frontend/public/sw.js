// Empty service worker - PWA features disabled
// This file exists only to prevent 404 errors from browser PWA detection

self.addEventListener('install', () => {
  // Skip waiting and immediately activate
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // No-op - PWA features disabled
  console.log('Service worker activated but PWA features are disabled');
});

// No fetch event handling - no caching, no offline features

// AutoCare Advisor Partner Portal - Service Worker
// Progressive Web App functionality with caching and offline support

const CACHE_NAME = 'autocare-partner-v1.0.0';
const STATIC_CACHE = 'autocare-static-v1.0.0';
const DYNAMIC_CACHE = 'autocare-dynamic-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/partner/dashboard',
  '/partner/products',
  '/partner/products/manage',
  '/partner/analytics',
  '/partner/settings',
  '/offline',
  '/manifest.json',
  // Core CSS and JS will be added by Next.js automatically
];

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  '/api/partner/analytics',
  '/api/partner/products',
  '/api/partner/profile',
  '/api/health',
];

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static assets:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - Handle different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (request.url.includes('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(request));
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirst(request));
});

// Network-first strategy for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);

    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline data for analytics if available
    if (request.url.includes('/api/partner/analytics')) {
      return new Response(
        JSON.stringify({
          overview: {
            totalProducts: 0,
            totalViews: 0,
            totalClicks: 0,
            monthlyRevenue: 0,
            averageConversionRate: 0,
          },
          offline: true,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    throw error;
  }
}

// Cache-first strategy for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url, error);
    throw error;
  }
}

// Navigation handler with offline fallback
async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation failed, serving offline page:', error);

    const cache = await caches.open(STATIC_CACHE);
    const offlinePage = await cache.match('/offline');

    if (offlinePage) {
      return offlinePage;
    }

    // Fallback offline HTML
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>AutoCare Advisor - Offline</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .offline-icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { margin-bottom: 0.5rem; }
            p { opacity: 0.9; margin-bottom: 2rem; }
            button {
              background: rgba(255,255,255,0.2);
              border: 2px solid rgba(255,255,255,0.3);
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              transition: all 0.3s ease;
            }
            button:hover { background: rgba(255,255,255,0.3); }
          </style>
        </head>
        <body>
          <div class="offline-icon">📱</div>
          <h1>You're Offline</h1>
          <p>Don't worry, your AutoCare Partner Portal works offline too!</p>
          <button onclick="window.location.reload()">Try Again</button>
        </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);

  if (event.tag === 'product-sync') {
    event.waitUntil(syncOfflineProductData());
  }

  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncOfflineAnalytics());
  }
});

// Sync offline product data when connection is restored
async function syncOfflineProductData() {
  try {
    const offlineData = await getOfflineProductData();

    if (offlineData.length > 0) {
      console.log(
        '[SW] Syncing offline product data:',
        offlineData.length,
        'items'
      );

      for (const data of offlineData) {
        await fetch('/api/partner/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      // Clear offline storage after successful sync
      await clearOfflineProductData();
      console.log('[SW] Product data synced successfully');
    }
  } catch (error) {
    console.error('[SW] Failed to sync offline product data:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  const options = {
    body: event.data
      ? event.data.text()
      : 'New update available in your Partner Portal',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Dashboard',
        icon: '/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('AutoCare Partner Portal', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/partner/dashboard'));
  }
});

// Utility functions for offline storage
async function getOfflineProductData() {
  // In a real app, this would read from IndexedDB
  return [];
}

async function clearOfflineProductData() {
  // In a real app, this would clear IndexedDB
  console.log('[SW] Offline product data cleared');
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ cacheSize: size });
    });
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

console.log('[SW] Service worker script loaded successfully');

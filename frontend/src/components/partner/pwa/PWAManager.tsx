'use client';

import { useCallback, useEffect, useState } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface CacheInfo {
  size: number;
  lastUpdated: Date | null;
}

interface PWAManagerProps {
  onStatusChange?: (status: NetworkStatus) => void;
}

const PWAManager: React.FC<PWAManagerProps> = ({ onStatusChange }) => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof window !== 'undefined' ? navigator.onLine : true,
  });
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    size: 0,
    lastUpdated: null,
  });
  const [serviceWorkerRegistration, setServiceWorkerRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service workers not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      setServiceWorkerRegistration(registration);
      console.log(
        '[PWA] Service worker registered successfully:',
        registration.scope
      );

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            console.log('[PWA] New service worker available');
            setUpdateAvailable(true);
            setShowUpdatePrompt(true);
          }
        });
      });

      // Listen for controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service worker controller changed - reloading');
        window.location.reload();
      });
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  }, []);

  // Update network status
  const updateNetworkStatus = useCallback(() => {
    const connection = (navigator as any).connection;
    const newStatus: NetworkStatus = {
      isOnline: navigator.onLine,
      ...(connection && {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      }),
    };

    setNetworkStatus(newStatus);
    onStatusChange?.(newStatus);
  }, [onStatusChange]);

  // Get cache information
  const updateCacheInfo = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller)
      return;

    try {
      const messageChannel = new MessageChannel();

      const cacheSize = await new Promise<number>((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.cacheSize || 0);
        };

        navigator.serviceWorker.controller?.postMessage(
          { type: 'GET_CACHE_SIZE' },
          [messageChannel.port2]
        );
      });

      setCacheInfo({
        size: cacheSize,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('[PWA] Failed to get cache info:', error);
    }
  }, []);

  // Handle service worker update
  const handleServiceWorkerUpdate = useCallback(async () => {
    if (!serviceWorkerRegistration) return;

    const newWorker = serviceWorkerRegistration.waiting;
    if (!newWorker) return;

    // Tell the new service worker to skip waiting
    newWorker.postMessage({ type: 'SKIP_WAITING' });
    setShowUpdatePrompt(false);
  }, [serviceWorkerRegistration]);

  // Clear cache
  const clearCache = useCallback(async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );

      setCacheInfo({ size: 0, lastUpdated: new Date() });
      console.log('[PWA] Cache cleared successfully');
    } catch (error) {
      console.error('[PWA] Failed to clear cache:', error);
    }
  }, []);

  // Sync offline data
  const syncOfflineData = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller)
      return;

    try {
      // Trigger background sync if supported
      if ('serviceWorker' in navigator && serviceWorkerRegistration) {
        // Type assertion for background sync support
        const registration = serviceWorkerRegistration as any;
        if ('sync' in registration) {
          await registration.sync.register('product-sync');
          await registration.sync.register('analytics-sync');
          console.log('[PWA] Background sync registered');
        }
      }
    } catch (error) {
      console.error('[PWA] Failed to register background sync:', error);
    }
  }, [serviceWorkerRegistration]);

  // Format cache size
  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Initialize PWA manager
  useEffect(() => {
    registerServiceWorker();
    updateNetworkStatus();
    updateCacheInfo();

    const handleOnline = () => {
      updateNetworkStatus();
      syncOfflineData();
    };

    const handleOffline = () => updateNetworkStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update cache info periodically
    const cacheUpdateInterval = setInterval(updateCacheInfo, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(cacheUpdateInterval);
    };
  }, [
    registerServiceWorker,
    updateNetworkStatus,
    updateCacheInfo,
    syncOfflineData,
  ]);

  return (
    <>
      {/* Network status indicator */}
      <div className="fixed top-4 right-4 z-40">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
            networkStatus.isOnline
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                networkStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span>
              {networkStatus.isOnline ? 'Online' : 'Offline'}
              {networkStatus.effectiveType &&
                ` (${networkStatus.effectiveType})`}
            </span>
          </div>
        </div>
      </div>

      {/* Service worker update prompt */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Update Available
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  A new version of the app is ready. Update now for the latest
                  features.
                </p>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleServiceWorkerUpdate}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded transition-colors"
                  >
                    Update Now
                  </button>
                  <button
                    onClick={() => setShowUpdatePrompt(false)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium py-1.5 px-3 rounded transition-colors"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cache information (for debugging/admin) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-gray-800 text-white text-xs rounded-lg p-2 font-mono opacity-75">
            <div>Cache: {formatCacheSize(cacheInfo.size)}</div>
            <div>SW: {serviceWorkerRegistration ? '✓' : '✗'}</div>
            {networkStatus.downlink && (
              <div>Speed: {networkStatus.downlink}Mbps</div>
            )}
            <button
              onClick={clearCache}
              className="text-red-400 hover:text-red-300 mt-1"
            >
              Clear Cache
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAManager;

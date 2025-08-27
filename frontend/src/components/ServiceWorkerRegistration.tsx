'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            '[PWA] Service Worker registered successfully:',
            registration
          );
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    } else {
      console.log('[PWA] Service Workers are not supported');
    }
  }, []);

  return null;
};

export default ServiceWorkerRegistration;

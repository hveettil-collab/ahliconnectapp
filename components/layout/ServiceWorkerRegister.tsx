'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('SW registered:', reg.scope);

          // Check for updates periodically
          reg.update();
          setInterval(() => reg.update(), 60 * 60 * 1000); // hourly

          // Auto-activate new service worker
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('New SW activated');
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log('SW registration failed:', err);
        });
    }
  }, []);

  return null;
}

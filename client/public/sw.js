// EdVirons Learning Portal Service Worker
const CACHE_NAME = 'edvirons-v1.0.0';
const STATIC_CACHE = 'edvirons-static-v1.0.0';
const DYNAMIC_CACHE = 'edvirons-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch(error => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Claim all clients
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests differently
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response before caching
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for API requests
    const response = await fetch(request);
    
    // Cache successful GET requests
    if (request.method === 'GET' && response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // If network fails, try to serve from cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return a custom offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature requires an internet connection'
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-offline-actions') {
    event.waitUntil(syncOfflineActions());
  }
});

// Sync offline actions when connection is restored
async function syncOfflineActions() {
  try {
    // Get stored offline actions from IndexedDB
    // This would integrate with your offline storage system
    console.log('[SW] Syncing offline actions...');
    
    // Send notifications to user about sync status
    self.registration.showNotification('EdVirons', {
      body: 'Your offline changes have been synchronized',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png'
    });
  } catch (error) {
    console.error('[SW] Failed to sync offline actions:', error);
  }
}

// Push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Content',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('EdVirons Learning Portal', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open the app to relevant content
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', event => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_BOOK_CONTENT') {
    event.waitUntil(cacheBookContent(event.data.bookData));
  }
});

// Cache book content for offline reading
async function cacheBookContent(bookData) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Cache book pages and assets
    const cachePromises = [];
    
    if (bookData.pages) {
      bookData.pages.forEach((page, index) => {
        const pageBlob = new Blob([page], { type: 'text/html' });
        const pageResponse = new Response(pageBlob);
        cachePromises.push(
          cache.put(`/book/${bookData.id}/page/${index}`, pageResponse)
        );
      });
    }
    
    // Cache media assets
    if (bookData.mediaAssets) {
      bookData.mediaAssets.forEach(asset => {
        if (asset.url) {
          cachePromises.push(
            cache.add(asset.url).catch(error => {
              console.warn('[SW] Failed to cache asset:', asset.url, error);
            })
          );
        }
      });
    }
    
    await Promise.all(cachePromises);
    console.log('[SW] Book content cached successfully:', bookData.title);
    
  } catch (error) {
    console.error('[SW] Failed to cache book content:', error);
  }
}

const CACHE_NAME = 'gkps-app-v2';

// Daftar file statis yang PASTI ada
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Cache ikon aplikasi dari CDN agar tidak hilang saat offline
  'https://cdn-icons-png.flaticon.com/512/2879/2879836.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Strategi: Network First, Fallback to Cache untuk HTML
  // Strategi: Cache First, Fallback to Network untuk Aset Statis (JS/CSS/Images)
  
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              // Jika request ke CDN (cross-origin), type-nya 'cors', kita izinkan cache
              if (response && response.type === 'cors' && event.request.url.includes('flaticon')) {
                 // allow caching
              } else if (!response || response.status !== 200) {
                 return response;
              }
            }

            // Clone response karena stream hanya bisa dibaca sekali
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache aset baru yang ditemukan (JS/CSS hasil build Vite)
                if (event.request.url.startsWith('http')) {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});

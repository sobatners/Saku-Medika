const CACHE_NAME = 'saku-medika-v1';

// Daftar dokumen & dependensi aset eksternal yang diunduh ke ruang penyimpanan offline HP
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap',
  'https://fonts.gstatic.com/s/caveat/v18/Wnz6H60tkz56AN_7OJ8QInA.woff2'
];

// Tahap instalasi & penyimpanan data ke dalam cache lokal browser
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Tahap aktivasi dan penghapusan sisa cache versi lama agar aplikasi selalu terbarui
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategi Pengambilan Data: Prioritaskan Cache Lokal, Alternatif jaringan internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
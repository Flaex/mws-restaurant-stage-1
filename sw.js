// Workbox ServiceWorker module import
importScripts('/third_party/workbox/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: '/third_party/workbox/'
});

if (workbox) {
  console.log(`Yay! Workbox is loaded !!`);
} else {
  console.log(`Boo! Workbox didn't load !!`);
}

workbox.routing.registerRoute(
  // Cache image files
  new RegExp('/img/'),
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache-v1',
  })
);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('mwsrs1-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/restaurant.html',
        '/favicon.ico',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'data/restaurants.json',
        'css/styles.css',
        'fonts/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2',
        'fonts/mem8YaGs126MiZpBA-UFVZ0b.woff2'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['mwsrs1-v1', 'image-cache-v1'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

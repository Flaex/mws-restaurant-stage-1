// Workbox ServiceWorker module import
importScripts('/third_party/workbox/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: '/third_party/workbox/'
});

if (workbox) {
  console.log(`Yay! Workbox is loaded ??`);
} else {
  console.log(`Boo! Workbox didn't load ??`);
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

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('mwsrs1-v1').then(function(cache) {
      return cache.addAll([
        '/',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'css/style.css',
        '/favicon.ico',
        'https://fonts.gstatic.com/s/opensans/v15/memnYaGs126MiZpBA-UFUKWyV9hvIqOxjaPXZSk.woff2',
        'https://fonts.gstatic.com/s/opensans/v15/memnYaGs126MiZpBA-UFUKWyV9hnIqOxjaPXZSk.woff2'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = ['mwsrs1-v1', 'image-cache-v1'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

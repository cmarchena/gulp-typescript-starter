const staticCacheName = "udacity-mws-restaurants-v1";
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(["/",
        "/sw.js",
        "index.html",
        "restaurant.html",
        "/css/styles.css",
        "/js/index.js",
        "/js/restaurant-detail.js",
        "/fonts/Inconsolata-Regular.ttf",
        "/fonts/Inconsolata-Bold.ttf",
        "/images/1-desktop.jpg",
        "/images/2-desktop.jpg",
        "/images/3-desktop.jpg",
        "/images/4-desktop.jpg",
        "/images/5-desktop.jpg",
        "/images/6-desktop.jpg",
        "/images/7-desktop.jpg",
        "/images/8-desktop.jpg",
        "/images/9-desktop.jpg",
        "/images/10-desktop.jpg",
        "/images/1-desktop.webp",
        "/images/2-desktop.webp",
        "/images/3-desktop.webp",
        "/images/4-desktop.webp",
        "/images/5-desktop.webp",
        "/images/6-desktop.webp",
        "/images/7-desktop.webp",
        "/images/8-desktop.webp",
        "/images/9-desktop.webp",
        "/images/10-desktop.webp",
        "/images/1-tablet.webp",
        "/images/2-tablet.webp",
        "/images/3-tablet.webp",
        "/images/4-tablet.webp",
        "/images/5-tablet.webp",
        "/images/6-tablet.webp",
        "/images/7-tablet.webp",
        "/images/8-tablet.webp",
        "/images/9-tablet.webp",
        "/images/10-tablet.webp",
        "/images/1-mobile.webp",
        "/images/2-mobile.webp",
        "/images/3-mobile.webp",
        "/images/4-mobile.webp",
        "/images/5-mobile.webp",
        "/images/6-mobile.webp",
        "/images/7-mobile.webp",
        "/images/8-mobile.webp",
        "/images/9-mobile.webp",
        "/images/10-mobile.webp"
      ]);
    })
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      Promise.all(
        cacheNames
        .filter(cacheName => {

          cacheName.startsWith("udacity-") && cacheName != staticCacheName;
        })
        .map(cacheName => {
          caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .then(fetchResponse => {
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          })
        })
        .catch(error => {
          return new Response("No connection from the network", {
            status: 404,
            statusText: 'No connection from the network'
          })
        })
    })
  );
});
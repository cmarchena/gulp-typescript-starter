const staticCacheName = "udacity-mws-restaurants-v1";
const contentImgsCache = "udacity-mws-restaurants-images";
const allCaches = [
  staticCacheName,
  contentImgsCache
];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(["/",
        "/",
        "index.html",
        "restaurant.html",
        "/css/styles.css",
        "bundle.js",
        "/fonts/Inconsolata-Regular.ttf",
        "/fonts/Inconsolata-Bold.ttf"
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
          cacheName.startsWith("udacity-") && !allCaches.includes(cacheName);
        })
        .map(cacheName => {
          caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
const requestUrl = new URL(event.request.url);
if(requestUrl.origin === location.origin){
   if(requestUrl.pathname == '/restaurant.html' ){
     event.respondWith(caches.match('restaurant.html'))
     return
  }
  if (requestUrl.pathname.startsWith( '/images/')) {
    event.respondWith(servePhoto(event.request))
    return;
  }
}
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        })
        .catch(error => {
          return new Response("No connection from the network", {
            status: 404,
            statusText: 'No connection from the network'
          })
        })
    
  );
});

function servePhoto(request) {
  var storageUrl = request.url.replace(/-\w\.webp$/, '-mobile.webp') || request.url.replace(/-\w\.jpg$/, '-tablet.jpg')

  return caches.open(contentImgsCache).then(function (cache) {
    return cache.match(storageUrl).then(function (response) {
      if (response) return response;

      return fetch(request).then(function (networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
const CACHE = "kagami-no-keiji-v0.1.1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/app.css",
  "./js/app.js",
  "./js/cards.js",
  "./assets/parchment.webp",
  "./assets/cards/card-05.webp",
  "./assets/sigils/spiral.svg",
  "./assets/sigils/ripple.svg",
  "./assets/sigils/star.svg",
  "./assets/sigils/knot.svg",
  "./assets/sigils/grid.svg",
  "./assets/sigils/seal.svg",
  "./assets/sigils/broken-ring.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(hit => hit || fetch(event.request).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});

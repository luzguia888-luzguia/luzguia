// Mi Luz · funciona como app: guarda la página y las imágenes para abrir rápido
const CACHE = 'miluz-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['mi-luz.html', 'icono-192.png', 'icono-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // los datos siempre van directo a Luz Guía
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const copia = r.clone(); caches.open(CACHE).then(c => c.put('mi-luz.html', copia)); return r; }).catch(() => caches.match('mi-luz.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(enCache => enCache || fetch(e.request).then(r => { if (r.ok && /\.(png|jpe?g)$/i.test(u.pathname)) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })));
});

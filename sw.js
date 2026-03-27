/* ============================================================
   sw.js — WordWar Service Worker
   Strategy: Cache-first for static assets, network-first for Firebase
   ============================================================ */

const CACHE_NAME    = 'wordwar-v1';
const CACHE_STATIC  = 'wordwar-static-v1';
const CACHE_FONTS   = 'wordwar-fonts-v1';

/* Files to pre-cache on install */
const PRECACHE_URLS = [
  './',
  'index.html',
  'login.html',
  'game.html',
  'leaderboard.html',
  'profile.html',
  'style.css',
  'icon-192.png',
  'icon-512.png',
  'offline.html'
];

/* Firebase & CDN origins — always network-first */
const NETWORK_ONLY_ORIGINS = [
  'firebaseio.com',
  'firebase.google.com',
  'googleapis.com',
  'gstatic.com',
  'ezmob.com',
  'ui-avatars.com'
];

/* ── Install: pre-cache core shell ── */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_STATIC).then(function(cache) {
      return cache.addAll(PRECACHE_URLS).catch(function(err) {
        /* Non-fatal — skip files that fail (e.g. offline.html may not exist yet) */
        console.warn('[SW] Pre-cache partial failure:', err);
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE_STATIC && k !== CACHE_FONTS; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* ── Fetch: routing strategy ── */
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  /* Skip non-GET requests */
  if (e.request.method !== 'GET') return;

  /* Network-only for Firebase + external APIs */
  var isNetworkOnly = NETWORK_ONLY_ORIGINS.some(function(origin) {
    return url.hostname.includes(origin);
  });
  if (isNetworkOnly) return; /* browser handles normally */

  /* Google Fonts — cache first, long TTL */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE_FONTS).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          if (cached) return cached;
          return fetch(e.request).then(function(res) {
            cache.put(e.request, res.clone());
            return res;
          });
        });
      })
    );
    return;
  }

  /* App shell — cache first, fallback to network, fallback to offline page */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        /* Serve from cache, update in background (stale-while-revalidate) */
        var fetchPromise = fetch(e.request).then(function(networkRes) {
          caches.open(CACHE_STATIC).then(function(cache) {
            cache.put(e.request, networkRes.clone());
          });
          return networkRes;
        }).catch(function() {});
        return cached;
      }

      /* Not in cache — fetch from network */
      return fetch(e.request).then(function(networkRes) {
        /* Cache successful responses for HTML/CSS/JS/images */
        var cacheTypes = ['text/html','text/css','application/javascript','image/'];
        var ct = networkRes.headers.get('content-type') || '';
        if (networkRes.ok && cacheTypes.some(function(t) { return ct.includes(t); })) {
          caches.open(CACHE_STATIC).then(function(cache) {
            cache.put(e.request, networkRes.clone());
          });
        }
        return networkRes;
      }).catch(function() {
        /* Offline fallback */
        if (e.request.destination === 'document') {
          return caches.match('offline.html').then(function(r) {
            return r || caches.match('index.html');
          });
        }
      });
    })
  );
});

/* ── Push notifications (future) ── */
self.addEventListener('push', function(e) {
  if (!e.data) return;
  var data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || 'WordWar', {
      body:  data.body  || 'You have a new challenge!',
      icon:  'icon-192.png',
      badge: 'icon-72.png',
      tag:   'wordwar-notification',
      data:  data
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data && e.notification.data.url ? e.notification.data.url : './')
  );
});

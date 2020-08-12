let cacheVersion = 'v1';

// Cache needed files
self.addEventListener('install', function(event) {
    // service worker will not install until the code inside waitUntil() has successfully occurred
    event.waitUntil(
        // create a new cache called v1
        // returns a promise for a created cache
        caches.open(cacheVersion)
            .then((cache)  => cache.addAll([
                '/offline.html',
                '/launch-icon.svg'
            ]))
    )
});

// Respond with cached asset if network request fails
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match('/offline.html'))
    );
});

// Remove old Caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName != cacheVersion)
                        .map((cacheName) => caches.delete(cacheName))
                );
        })
    );
});


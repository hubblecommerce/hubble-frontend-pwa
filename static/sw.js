var cacheVersion = 'v1'

// Cache needed files
self.addEventListener('install', function(event) {
    // service worker will not install until the code inside waitUntil() has successfully occurred
    event.waitUntil(
        // create a new cache called v1
        // returns a promise for a created cache
        caches.open(cacheVersion).then(function(cache) {
            // call a function that calls addAll() on the created cache
            // takes an array of origin-relative URLs to all the resources you want to cache.
            return cache.addAll([
                '/offline.html',
                '/launch-icon.svg'
            ]);
        })
    );
});

// Respond with cached asset if network request fails
self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            caches.match('/offline.html');
        })
    );
});

// Remove old Caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                    if(cacheName != cacheVersion) {
                        return true;
                    }
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


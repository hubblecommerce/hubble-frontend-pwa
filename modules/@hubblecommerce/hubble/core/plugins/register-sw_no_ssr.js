/**
 * Register a serviceworker for offline support
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
            function (registration) {
                if (registration.installing) {
                    //console.log('Service worker installing');
                } else if (registration.waiting) {
                    //console.log('Service worker installed');
                } else if (registration.active) {
                    //console.log('Service worker active');
                }

                // Registration was successful
            },
            function (err) {
                // registration failed
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

/**
 * Check for serviceWorker on navigator.
 */
if (!('serviceWorker' in navigator)) {
    console.log("Service Worker isn't supported on this browser, disable or hide UI.");
}

/**
 * Check for serviceWorker on navigator.
 */
if (!('PushManager' in window)) {
    console.log("Push isn't supported on this browser, disable or hide UI.");
}

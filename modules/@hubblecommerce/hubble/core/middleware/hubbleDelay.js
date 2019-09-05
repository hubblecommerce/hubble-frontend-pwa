/*
 * Simple delay between routes, to simulate slow applications
 */

import Middleware from './middleware'

// Register a new middleware with key 'hubbleware' to get used in pages or layouts
Middleware.hubbleDelay = function (context) {

    // random delay from 1500ms to 2000ms
    let delay = Math.floor(Math.random() * 500) + 1500;

    // Return a promise to tell nuxt.js to wait for the end of it
    return new Promise((resolve) => {
        // If hubble mode is set to off
        if(!context.store.state.modHubbleSwitch.isHubble) {
            // Wait between each route
            setTimeout(resolve, delay);
        } else {
            resolve()
        }
    })

};

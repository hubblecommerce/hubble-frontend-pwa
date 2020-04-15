/**
 * Helper Function to sort menu entries and their children alphabetically
 *
 * @returns Promise
 */
function clearDataLayer() {
    return new Promise(resolve => {
        // Run loop backwards to slice array (index stability)
        // Remove all array items which are not gtm.js or hubbleRoute events
        for (let i = window['dataLayer'].length - 1; i >= 0; i--) {
            if (window['dataLayer'][i].event !== 'gtm.js' && window['dataLayer'][i].event !== 'hubbleRoute') {
                window['dataLayer'].splice(i, 1);
            }
        }

        // Only keep current hubbleRoute event, remove old ones
        let hasRoute = false;
        for (let i = window['dataLayer'].length - 1; i >= 0; i--) {
            if (window['dataLayer'][i].event === 'hubbleRoute' && hasRoute) {
                window['dataLayer'].splice(i, 1);
                continue;
            }
            if (window['dataLayer'][i].event === 'hubbleRoute') {
                hasRoute = true;
            }
        }

        resolve();
    });
}

export { clearDataLayer };

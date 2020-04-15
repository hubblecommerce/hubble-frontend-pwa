import path from 'path';
import Helper from './core/utils/helper';

export default function nuxtHubble(moduleOptions) {
    // Register toplevel options of nuxt.config.js
    const options = Object.assign({}, this.options.hubble, moduleOptions);

    // Set default apiType value
    if (!options.apiType) {
        options.apiType = 'api';
    }

    /*
     * Store modules need to be loaded first, the addPlugin function adds plugins to first of plugins[] option.
     * That's why we have to add store modules before the plugins like:
     * 1. register nuxt.js modules
     * 2. register vuex store modules
     * 3. register plugins
     */

    // Register plugins from /plugin as plugin if not blacklisted
    Helper.getFilesFromDir('/plugins').then(files => {
        Helper.registerPlugins(this, files, 'plugins', options.deactivatePlugins).then(() => {
            // Register API type based plugins
            Helper.getFilesFromDir(`/plugins/${options.apiType}`).then(files => {
                Helper.registerPlugins(this, files, `/plugins/${options.apiType}`, options.deactivatePlugins).then(() => {
                    // Register store from /store as plugin if not blacklisted
                    Helper.getFilesFromDir('/store').then(files => {
                        Helper.registerPlugins(this, files, 'store', options.deactivateStores).then(() => {
                            // Register API type based stores
                            Helper.getFilesFromDir(`/store/${options.apiType}`).then(files => {
                                Helper.registerPlugins(this, files, `/store/${options.apiType}`, options.deactivateStores).then(() => {
                                    // Register nuxt.js modules
                                    this.addModule('localforage-nuxt');
                                    this.addModule('cookie-universal-nuxt', true);

                                    if (options.gtmId !== null) {
                                        this.addModule([
                                            '@nuxtjs/google-tag-manager',
                                            {
                                                id: options.gtmId,
                                                layer: 'dataLayer',
                                                pageTracking: true,
                                                pageViewEventName: 'hubbleRoute',
                                            },
                                        ]);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    // Register middleware as plugin if not blacklisted, no need for loading them before or after plugins, because they are
    // triggered only before pages and layouts anyway
    Helper.getFilesFromDir('/middleware').then(files => {
        Helper.registerPlugins(this, files, 'middleware', options.deactivateMiddleware);
    });

    // Register API type based middleware
    Helper.getFilesFromDir(`/middleware/${options.apiType}`).then(files => {
        Helper.registerPlugins(this, files, `/middleware/${options.apiType}`, options.deactivateMiddleware);
    });

    // Add middleware to nuxt.config.js
    //this.options.router.middleware.push('hubbleDelay');

    // Add hubble Theme
    if (options.useTheme !== false) {
        this.options.css.push(path.resolve(__dirname, 'core/assets/scss/theme/all.scss'));
    }
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

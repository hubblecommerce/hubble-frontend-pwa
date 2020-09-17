export default {
    // serverMiddleware: ['~/api/hubble-logger', '~/api/server-side-api-auth-call'],

    /*
     ** Headers of the page
     */
    head: {
        title: 'Buy now | Hubble Demo-Shop',
        htmlAttrs: {
            lang: 'de',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'hubble PWA' },
            { content: 'width=device-width,initial-scale=1', name: 'viewport' },
            { hid: 'author', name: 'author', content: 'digital.manufaktur GmbH' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },

    /*
     **
     * Remove preload links to reduce time to first meaningful paint
     * https://cmty.app/nuxt/nuxt.js/issues/c6837
     */
    render: {
        bundleRenderer: {
            shouldPreload: () => {
                return false;
            },
        },
    },

    /*
    ** Global CSS
    */
    css: [
        '~/assets/css/main.css',
        '~/assets/css/vue-tiny-slider.css',
        '~/assets/scss/' + process.env.THEME + '/all.scss'
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        ['@hubblecommerce/hubble']
    ],

    /*
     ** hubble module configuration
     */
    hubble: {
        apiType: process.env.API_TYPE, //
        deactivateStores: [],
        deactivatePlugins: [],
        deactivateMiddleware: [],
        useTheme: false,
        gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
        payone: {},
        amazonPay: {
            sandbox: true,
        },
    },

    router: {
        prefetchLinks: false,
        middleware: [],
    },

    /*
     ** Build configuration
     */
    build: {
        babel: {
            plugins: ['lodash'],
            presets: [['@babel/env', { targets: { node: 6 } }]],
        },
        transpile: ['@hubblecommerce/hubble', 'vee-validate/dist/rules'],
        extractCSS: true,
    },

    layoutTransition: {
        name: 'layout',
        mode: 'out-in',
    }
};

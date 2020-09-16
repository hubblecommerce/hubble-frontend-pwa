import { description } from './package.json';

export default {
    mode: 'universal',

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
            { hid: 'description', name: 'description', content: description },
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
        // ['@hubblecommerce/hubble', { preserveState: false }],
        ['@hubblecommerce/hubble'],
        ['@hubblecommerce/payone'],
        ['@hubblecommerce/amazon-pay'],
        '@nuxtjs/axios',
        [
            'nuxt-mq',
            {
                breakpoints: {
                    sm: 768,
                    md: 1024,
                    lg: Infinity,
                },
                defaultBreakpoint: 'md', // Default breakpoint for SSR
            },
        ],
        [
            'nuxt-i18n',
            {
                defaultLocale: 'en',
                detectBrowserLanguage: false,
                locales: [
                    {
                        code: 'de',
                        iso: 'de-DE',
                        file: 'de.js',
                    },
                    {
                        code: 'en',
                        iso: 'en-US',
                        file: 'en.js',
                    },
                ],
                langDir: 'locales/',
                lazy: true,
                seo: false,
            },
        ],
        ['@nuxtjs/pwa', { workbox: false, oneSignal: false }],
        '@nuxtjs/sitemap',
        '@nuxtjs/recaptcha',
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
        //analyze: true,
        //optimization: {
        //    splitChunks: {
        //        chunks: 'all',
        //        // tells webpack to try to split chunks bigger than maxSize into smaller parts
        //        maxSize: 200000
        //    }
        //},
        babel: {
            plugins: ['lodash'],
            presets: [['@babel/env', { targets: { node: 6 } }]],
        },
        transpile: ['@hubblecommerce/hubble', 'vee-validate/dist/rules'],
        extractCSS: true,
    },

    workbox: {
        // Workbox options
        offlinePage: '/offline.html',
        cacheNames: {
            prefix: 'hubble',
            suffix: 'v1',
            precache: 'precache',
            runtime: 'runtime',
        },
        offlineStrategy: 'networkFirst',
        runtimeCaching: [
            {
                urlPattern: 'http:localhost:3340/Unsere-AGB/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET',
            },
            {
                urlPattern: 'http:localhost:3340/Unsere-AGB/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET',
            },
            {
                urlPattern: 'http:localhost:3340/Impressum/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET',
            },
        ],
    },

    /*
     ** Manifest Module
     */
    manifest: {
        name: 'hubble Demo',
        lang: 'de',
        short_name: 'hubble Demo',
        start_url: '/',
        background_color: '#F8F8F8',
        display: 'standalone',
        scope: '/',
        theme_color: '#880E4F',
        gcm_sender_id: '482941778795',
        gcm_sender_id_comment: 'Do not change the GCM Sender ID',
    },

    oneSignal: {
        cdn: true,
        OneSignalSDK: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js',
        init: {
            appId: process.env.ONESIGNAL_TOKEN || null,
            autoRegister: false,
            notifyButton: {
                enable: true /* Set to false to hide */,
            },
            welcomeNotification: {
                title: 'Willkommen bei Hubble',
                message: 'Vielen Dank für das Aktivieren der Push Benachrichtigungen',
                // "url": "" /* Leave commented for the notification to not open a window on Chrome and Firefox (on Safari, it opens to your webpage) */
            },
            promptOptions: {
                /* actionMessage limited to 90 characters */
                actionMessage: 'Jetzt Benachrichtigungen aktivieren und keine Aktion mehr verpassen!',
                /* acceptButtonText limited to 15 characters */
                acceptButtonText: 'Erlauben',
                /* cancelButtonText limited to 15 characters */
                cancelButtonText: 'Nein Danke',
            },
        },
    },

    sitemap: {
        hostname: process.env.APP_BASE_URL,
        gzip: true,
        exclude: [],
        routes: [],
    },

    recaptcha: {
        version: 3,
        siteKey: process.env.GOOGLE_RECAPTCHA_SITEKEY,
        language: 'de',
        hideBadge: true,
    },

    layoutTransition: {
        name: 'layout',
        mode: 'out-in',
    },
};

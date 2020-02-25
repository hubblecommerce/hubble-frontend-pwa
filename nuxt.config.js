const pkg = require('./package');
import webpack from 'webpack';
require('dotenv').config();

module.exports = {
    mode: 'universal',

    env: {
        config: {
            APP_BASE_URL: process.env.NODE_ENV === 'production' ? process.env.APP_BASE_URL : 'http://localhost/',
            IMG_BASE_URL: process.env.IMG_BASE_URL
        },
        limiter_default: '10', // Only these limits are allowed in SW6: 1, 5, 9, 10, 25, 50, 75, 100, 500
        limiter: [
            {
                'limit': '5',
                'label': '5'
            },
            {
                'limit': '10',
                'label': '10'
            },
            {
                'limit': '25',
                'label': '25'
            },
            {
                'limit': '50',
                'label': '50'
            },
            {
                'limit': '500',
                'label': 'all'
            }
        ],
        sorter: [
            {
                'order': 'price',
                'label': 'price_asc',
                'direction': 'asc',
                'selected': true,
                'option_id': 0
            },
            {
                'order': 'name',
                'label': 'name_asc',
                'direction': 'asc',
                'selected': false,
                'option_id': 1
            },
        ],
        meta: {
            category: {
                title: 'Category - Hubble Demo',
                titleAdd: ' - buy now at hubble Demostore',
                metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
                metaDescription: 'Official hubble demo page.'
            },
            product: {
                title: 'Product Hubble Demo',
                metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
                metaDescription: 'Official hubble demo page.'
            },
            cms: {
                title: 'CMS - Hubble Demo',
                metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
                metaDescription: 'Official hubble demo page.'
            }
        }
    },

    serverMiddleware: [
        '~/api/hubble-logger',
        '~/api/server-side-api-auth-call'
    ],

    /*
    ** Headers of the page
    */
    head: {
        title: 'Buy now | Hubble Demo-Shop',
        htmlAttrs: {
            lang: 'de'
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: pkg.description},
            {content: 'width=device-width,initial-scale=1', name: 'viewport'},
            {hid: 'author', name: 'author', content: 'digital.manufaktur GmbH'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},

    /*
    **
    * Remove preload links to reduce time to first meaningful paint
    * https://cmty.app/nuxt/nuxt.js/issues/c6837
     */
    render: {
        bundleRenderer: {
            shouldPreload: (file, type) => {
                return false
            }
        }
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
    ** Plugins to load before mounting the App
    */
    plugins: [],

    /*
    ** Nuxt.js modules
    */
    modules: [
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
                    lg: Infinity
                },
                defaultBreakpoint: 'md' // Default breakpoint for SSR
            }
        ],
        ['nuxt-i18n', {
            defaultLocale: 'en',
            locales: [
                {
                    code: 'de',
                    iso: 'de-DE',
                    file: 'de.js'
                },
                {
                    code: 'en',
                    iso: 'en-US',
                    file: 'en.js'
                },
            ],
            langDir: 'locales/',
            lazy: true,
            seo: false
        }],
        ['@nuxtjs/pwa', { workbox: false, oneSignal: false }],
        '@nuxtjs/sitemap',
        '@nuxtjs/recaptcha'
    ],

    buildModules: [
        ['@nuxtjs/dotenv', {
            only: [
                'APP_BASE_URL',
                'IMG_BASE_URL',
                'API_TYPE',
                'API_SW_ACCESS_KEY',
                'API_BASE_URL',
                'API_BASE_URL',
                'API_CLIENT_ID',
                'API_CLIENT_SECRET',
                'API_ENDPOINT_AUTH',
                'API_PAYMENT_BASE_URL',
                'API_PAYMENT_CLIENT_ID',
                'API_PAYMENT_CLIENT_SECRET',
                'API_PAYMENT_ENDPOINT_AUTH',
                'PAYONE_MODE',
                'PAYONE_MID',
                'PAYONE_AID',
                'PAYONE_PORTALID',
                'AMAZON_PAY_SANDBOX',
                'AMAZON_PAY_MERCHANT_ID',
                'AMAZON_PAY_ACCESS_KEY',
                'AMAZON_PAY_CURRENCY',
                'LOGIN_WITH_AMAZON_CLIENT_ID',
                'AMAZON_PAY_MODE',
                'AMAZON_PAY_RETURN_URL',
                'AMAZON_PAY_CANCEL_RETURN_URL',
                'GOOGLE_ANALYTICS_ID',
                'GOOGLE_TAG_MANAGER_ID',
                'GOOGLE_RECAPTCHA_SITEKEY',
                'TRUSTED_SHOPS_ID',
                'ONESIGNAL_TOKEN',
                'CUSTOMER_DOMAIN',
                'THEME',
                'STORE_ID',
                'NO_CORS',
                'DEFAULT_ERROR_PAGE',
                'STREETINFO_INCLUDES_HOUSENO',
            ]
        }]
    ],

    /*
    ** hubble module configuration
    */
    hubble: {
        apiType: process.env.API_TYPE,
        deactivateStores: [],
        deactivatePlugins: [],
        deactivateMiddleware: [],
        useTheme: false,
        gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
        payone: {},
        amazonPay: {
            sandbox: true
        }
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
        optimization: {
            splitChunks: {
                chunks: 'all',
                // tells webpack to try to split chunks bigger than maxSize into smaller parts
                maxSize: 200000
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                '_': 'lodash-core'
            }),
        ],
        transpile: [
            '@hubblecommerce/hubble',
            'vee-validate/dist/rules'
        ],
        extractCSS: true
    },

    workbox: {
        // Workbox options
        offlinePage: '/offline.html',
        cacheNames: {
            prefix: 'hubble',
            suffix: 'v1',
            precache: 'precache',
            runtime: 'runtime'
        },
        offlineStrategy: 'networkFirst',
        runtimeCaching: [
            {
                urlPattern: 'http:localhost:3340/Unsere-AGB/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET'
            },
            {
                urlPattern: 'http:localhost:3340/Unsere-AGB/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET'
            },
            {
                urlPattern: 'http:localhost:3340/Impressum/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET'
            }]
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
        gcm_sender_id_comment: 'Do not change the GCM Sender ID'
    },

    oneSignal: {
        cdn: true,
        OneSignalSDK: 'https://cdn.onesignal.com/sdks/OneSignalSDK.js',
        init: {
            appId: process.env.ONESIGNAL_TOKEN || null,
            autoRegister: false,
            notifyButton: {
                enable: true /* Set to false to hide */
            },
            welcomeNotification: {
                "title": "Willkommen bei Hubble",
                "message": "Vielen Dank für das Aktivieren der Push Benachrichtigungen",
                // "url": "" /* Leave commented for the notification to not open a window on Chrome and Firefox (on Safari, it opens to your webpage) */
            },
            promptOptions: {
                /* actionMessage limited to 90 characters */
                actionMessage: "Jetzt Benachrichtigungen aktivieren und keine Aktion mehr verpassen!",
                /* acceptButtonText limited to 15 characters */
                acceptButtonText: "Erlauben",
                /* cancelButtonText limited to 15 characters */
                cancelButtonText: "Nein Danke"
            }
        }
    },

    sitemap: {
        hostname: process.env.APP_BASE_URL,
        gzip: true,
        exclude: [],
        routes: []
    },

    recaptcha: {
        version: 3,
        siteKey: process.env.GOOGLE_RECAPTCHA_SITEKEY,
        language: 'de',
        hideBadge: true
    },

    layoutTransition: {
        name: 'layout',
        mode: 'out-in'
    }
};

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
        limiter_default: '20',
        limiter: [
            {
                'limit': '20',
                'label': '20'
            },
            {
                'limit': '40',
                'label': '40'
            },
            {
                'limit': '80',
                'label': '80'
            },
            {
                'limit': '120',
                'label': '120'
            }
        ],
        sorter: [
            {
                'dir': 'desc',
                'order': 'position',
                'label': 'position',
                'selected': false
            },
            {
                'dir': 'asc',
                'order': 'name',
                'label': 'name',
                'selected': false
            },
            {
                'dir': 'asc',
                'order': 'price',
                'label': 'price',
                'selected': false
            },
            {
                'dir': 'desc',
                'order': 'relevance',
                'label': 'relevance',
                'selected': false
            },
        ],
        menu: {
            0: {
                id: 254,
                name: "Damen"
            },
            1: {
                id: 274,
                name: "Herren"
            },
            2: {
                id: 292,
                name: "Kinder"
            },
            3: {
                name: "Sale",
                url_path: 'sale',
                children: []
            },
            4: {
                id: 4,
                name: "Pflegemittel"
            },
        }
    },

    /*
    ** Headers of the page
    */
    head: {
        title: 'Hubble Demo',
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
        '~/assets/scss/hubble/all.scss'
    ],

    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '~/plugins/axios-interceptor.js'
    ],

    /*
    ** Nuxt.js modules
    */
    modules: [
        ['@hubblecommerce/hubble'],
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios',
        [
            'nuxt-mq',
            {
                breakpoints: {
                    sm: 768,
                    md: 1024,
                    lg: Infinity
                },
                defaultBreakpoint: 'sm' // Default breakpoint for SSR
            }
        ],
        ['nuxt-i18n', {
            defaultLocale: 'de',
            locales: [
                {
                    code: 'en',
                    iso: 'en-US',
                    file: 'en.js'
                },
                {
                    code: 'de',
                    iso: 'de-DE',
                    file: 'de.js'
                },
            ],
            langDir: 'locales/',
            lazy: true,
            seo: false
        }],
        ['@nuxtjs/onesignal'],
        ['@nuxtjs/pwa', { workbox: false }],
        ['@nuxtjs/google-analytics', {
            id: process.env.GOOGLE_ANALYTICS_ID || null
        }],
        '@nuxtjs/dotenv',
        '@nuxtjs/sitemap'
    ],

    /*
    ** hubble module configuration
    */
    hubble: {
        deactivateStores: [],
        deactivatePlugins: [],
        deactivateMiddleware: [],
        useTheme: false
    },

    /*
    ** Axios module configuration
    */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    router: {
        middleware: [],
    },

    /*
    ** Build configuration
    */
    build: {
        //analyze: true,
        plugins: [
            new webpack.ProvidePlugin({
                '_': 'lodash-core'
            }),
        ],
        transpile: [
            '@hubblecommerce/hubble'
        ],
        extractCSS: true,
        /*
        ** You can extend webpack config here
        */
        // extend(config, ctx)
        // {
        //     // Run ESLint on save
        //     if (ctx.isDev && ctx.isClient) {
        //         config.module.rules.push({
        //             enforce: 'pre',
        //             test: /\.(js|vue)$/,
        //             loader: 'eslint-loader',
        //             exclude: /(node_modules)/,
        //             options: {
        //                 fix: true
        //             }
        //         })
        //     }
        // }
    },

   /*
    ** Manifest Module
    */
    manifest: {
        name: 'Hubble Demo',
        lang: 'de',
        short_name: 'Hubble Demo',
        start_url: '/',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        theme_color: '#1B1D1B',
        gcm_sender_id: '482941778795',
        gcm_sender_id_comment: 'Do not change the GCM Sender ID'
    },

    workbox: {
        // Workbox options
        offlinePage: '/offline.html',
        runtimeCaching: [
            {
                // Should be a regex string. Compiles into new RegExp('localhost:3000/.*')
                urlPattern: 'localhost:' + process.env.DEV_PORT || 3000 + '/.*',
                // Defaults to `networkFirst` if omitted
                handler: 'networkFirst',
                // Defaults to `GET` if omitted
                method: 'GET'
            }
        ]
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
    }
};

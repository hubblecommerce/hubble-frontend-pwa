const path = require('path');

export const defaultEnv = {
    config: {
        APP_BASE_URL: process.env.NODE_ENV === 'production' ? process.env.APP_BASE_URL : 'http://localhost/',
        IMG_BASE_URL: process.env.IMG_BASE_URL,
    },
    limiter_default: '10', // Only these limits are allowed in SW6: 1, 5, 9, 10, 25, 50, 75, 100, 500
    limiter: [
        {
            limit: '10',
            label: '10',
        },
        {
            limit: '25',
            label: '25',
        },
        {
            limit: '50',
            label: '50',
        },
        {
            limit: '500',
            label: 'all',
        },
    ],
    sorter: [
        {
            order: 'price',
            label: 'price_asc',
            direction: 'asc',
            selected: true,
            option_id: 0,
        },
        {
            order: 'price',
            label: 'price_desc',
            direction: 'desc',
            selected: false,
            option_id: 1,
        },
        {
            order: 'name',
            label: 'name_asc',
            direction: 'asc',
            selected: false,
            option_id: 2,
        },
        {
            order: 'name',
            label: 'name_desc',
            direction: 'desc',
            selected: false,
            option_id: 3,
        },
    ],
    meta: {
        category: {
            title: 'Category - Hubble Demo',
            titleAdd: ' - buy now at hubble Demostore',
            metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
            metaDescription: 'Official hubble demo page.',
        },
        product: {
            title: 'Product Hubble Demo',
            metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
            metaDescription: 'Official hubble demo page.',
        },
        cms: {
            title: 'CMS - Hubble Demo',
            metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
            metaDescription: 'Official hubble demo page.',
        },
    },
};

export const defaultCss = [
    '~/assets/css/main.css',
    '~/assets/css/vue-tiny-slider.css',
    '~/assets/scss/' + process.env.THEME + '/all.scss',
];

export const defaultDotEnv = {
    only: [
        'APP_BASE_URL',
        'IMG_BASE_URL',
        'API_TYPE',
        'API_SW_ACCESS_KEY',
        'API_BASE_PFX',
        'API_BASE_URL',
        'API_PAYMENT_BASE_PFX',
        'API_PAYMENT_BASE_URL',
        'SW_PAYMENT_FINISH_URL',
        'SW_PAYMENT_ERROR_URL',
        'SW_PAYPAL_CLIENT_ID',
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
        'ALTERNATIVE_SHIPPING_ADDRESS',
    ],
    path: '~/..',
};

export const defaultBuildBabelConfig = {
    plugins: ['lodash'],
    presets: [['@babel/env', { targets: { node: 6 } }]],
};

export const defaultBuildExtractCSSConfig = true;

export const defaultRouterPrefetchLinksConfig = false;

export const defaultServerMiddleware = function (srcDir) {
    const middlewares = ['api/hubble-logger', 'api/client-auth'];

    let result = [];

    middlewares.forEach((middleware) => {
        result.push(path.join(srcDir, middleware));
    });

    return result;
};

export const defaultModules = [
    {
        name: '@hubblecommerce/payone',
    },
    {
        name: '@hubblecommerce/amazon-pay',
    },
    {
        name: '@nuxtjs/axios',
    },
    {
        name: 'nuxt-mq',
        options: {
            breakpoints: {
                sm: 768,
                md: 1024,
                lg: Infinity,
            },
            defaultBreakpoint: 'md', // Default breakpoint for SSR
        },
    },
    {
        name: '@nuxtjs/recaptcha',
        topLevelName: 'recaptcha',
        options: {
            version: 3,
            siteKey: process.env.GOOGLE_RECAPTCHA_SITEKEY,
            language: 'de',
            hideBadge: true,
        },
    },
    {
        name: 'nuxt-i18n',
        options: {
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
            langDir: `locales/`,
            lazy: true,
            seo: false,
        },
    },
    {
        name: '@nuxtjs/pwa',
        options: {
            workbox: false,
            oneSignal: false,
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
        },
    },
    {
        name: 'localforage-nuxt',
    },
    {
        name: 'cookie-universal-nuxt',
    },
];

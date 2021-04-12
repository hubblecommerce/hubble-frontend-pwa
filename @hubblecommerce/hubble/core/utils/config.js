const path = require('path');

export const defaultEnv = {
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

export const defaultDotEnv = {
    only: [
        'APP_BASE_URL',
        'API_TYPE',
        'API_BASE_URL',
        'API_SW_ACCESS_KEY',
        'THEME',
        'SW_PAYMENT_FINISH_URL',
        'SW_PAYMENT_ERROR_URL',
        'SW_PAYPAL_CLIENT_ID',
        'SW_STRIPE_PUBLIC_KEY',
    ],
    path: '~/..',
};

export const defaultModules = [
    {
        name: 'nuxt-mq',
        options: {
            breakpoints: {
                sm: 768,
                md: 1024,
                lg: Infinity,
            },
            defaultBreakpoint: 'sm', // Default breakpoint for SSR
        },
    },
    {
        name: 'nuxt-lazy-load',
        options: {
            directiveOnly: true,
            loadingClass: 'lazy-placeholder',
        },
    },
    {
        name: 'cookie-universal-nuxt',
    },
];

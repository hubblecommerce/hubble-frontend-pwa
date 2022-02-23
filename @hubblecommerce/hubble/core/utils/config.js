export const defaultPublicRuntimeConfig = {
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
    appBaseUrl: process.env.APP_BASE_URL,
    apiType: process.env.API_TYPE,
    apiBaseUrl: process.env.API_BASE_URL,
    apiSwAccessKey: process.env.API_SW_ACCESS_KEY,
    theme: process.env.THEME,
    swPaymentFinishUrl: process.env.SW_PAYMENT_FINISH_URL,
    swPaymentErrorUrl: process.env.SW_PAYMENT_ERROR_URL,
    swPaypalClientId: process.env.SW_PAYPAL_CLIENT_ID,
    swStripePublicKey: process.env.SW_STRIPE_PUBLIC_KEY,
    storyblockAccessToken: process.env.STORYBLOCK_ACCESS_TOKEN
};

export const defaultPrivateRuntimeConfig = {};

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
    {
        name: '@nuxtjs/svg',
    },
    {
        name: 'portal-vue/nuxt',
    },
    {
        name: '@nuxtjs/composition-api/module',
    },
];

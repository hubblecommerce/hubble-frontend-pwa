export const defaultPublicRuntimeConfig = {
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
    },
    appBaseUrl: process.env.APP_BASE_URL,
    platformBaseUrl: process.env.PLATFORM_BASE_URL,
    apiBaseUrl: process.env.API_BASE_URL,
    apiSwAccessKey: process.env.API_SW_ACCESS_KEY,
    swPaymentFinishUrl: process.env.SW_PAYMENT_FINISH_URL,
    swPaymentErrorUrl: process.env.SW_PAYMENT_ERROR_URL
}

export const defaultPrivateRuntimeConfig = {
    mySecret: 'secret'
}

export default {
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
    ** Global CSS
    */
    css: [],

    /*
     ** Nuxt.js modules
     */
    modules: [],

    buildModules: [
        ['@hubblecommerce/hubble']
    ],

    /*
     ** hubble module configuration
     */
    hubble: {
        apiType: process.env.API_TYPE,
        gtmId: process.env.GOOGLE_TAG_MANAGER_ID,
        payone: {},
        amazonPay: {
            sandbox: true,
        },
    },

    /*
     ** Build configuration
     */
    build: {}
};

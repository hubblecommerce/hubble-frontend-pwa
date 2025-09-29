import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
    runtimeConfig: {
        public: {
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
            platformBaseUrl: process.env.PLATFORM_BASE_URL,
            apiBaseUrl: process.env.API_BASE_URL,
            apiSwAccessKey: process.env.API_SW_ACCESS_KEY,
            sessionCookie: {
                name: 'hubble-session-token',
                options: {
                    maxAge: 60 * 60 * 24 * 30,
                    sameSite: 'lax',
                    path: '/'
                }
            },
            cartCookie: {
                name: 'hubble-cart',
                options: {
                    maxAge: 60 * 60 * 24 * 30,
                    sameSite: 'lax',
                    path: '/'
                }
            },
            wishlistCookie: {
                name: 'hubble-wishlist',
                options: {
                    maxAge: 60 * 60 * 24 * 30,
                    sameSite: 'lax',
                    path: '/'
                }
            },
            customerCookie: {
                name: 'hubble-customer',
                options: {
                    maxAge: 60 * 24,
                    sameSite: 'lax',
                    path: '/'
                }
            },
            setCustomerLoggedInHeader: false,
            redirectDefaultLanguage: false
        }
    },

    // Layer configuration
    css: [
        // needs to be relative to work and to be able to be overridden by consumer instance
        './assets/css/tailwind.css',
        './app/assets/css/tailwind.css',
    ],

    // Component auto-imports
    components: [
        {
            path: join(currentDir, 'components'),
            pathPrefix: false,
            global: true // Make structure components global for dynamic resolution
        }
    ],

    // Auto-imports configuration
    imports: {
        dirs: [
            join(currentDir, 'utils'),
            join(currentDir, 'utils/mapping'),
            join(currentDir, 'composables'),
            join(currentDir, 'types')
        ]
    },

    // Plugins are auto-discovered from plugins/ directory
    // No explicit plugin configuration needed for auto-discovery

    postcss: {
        plugins: {
            '@tailwindcss/postcss': {}
        }
    },

    // Module dependencies that the layer needs
    modules: [
        '@nuxtjs/i18n',
        '@nuxtjs/color-mode'
    ],

    colorMode: {
        preference: 'system', // default theme
        dataValue: 'theme', // activate data-theme in <html> tag
        classSuffix: ''
    }
})
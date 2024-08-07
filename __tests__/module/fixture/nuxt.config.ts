import { fileURLToPath } from 'url'
import hubble from '../../..'

// @ts-ignore
export default defineNuxtConfig({
    modules: [
        // @ts-ignore
        hubble
    ],
    hubble: {
        redirectDefaultLanguage: true
    },
    i18n: {
        locales: [
            'en',
            'de'
        ],
        defaultLocale: 'en',
        strategy: 'prefix_and_default',
        detectBrowserLanguage: false
    },
    runtimeConfig: {
        public: {
            testPluginConfig2: 'Plugin config 2 overridden by nuxt.config'
        }
    },
    vite: {
        resolve: {
            alias: {
                // @ts-ignore
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../../../src/platforms/shopware/api-client/generated/index.ts', import.meta.url)),
                // @ts-ignore
                '@hubblecommerce/hubble/platforms/shopware/request': fileURLToPath(new URL('../../../src/platforms/shopware/api-client/generated/core/request.ts', import.meta.url))
            }
        }
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                paths: {
                    '@hubblecommerce/hubble/platforms/shopware/api-client': ['../../../src/platforms/shopware/api-client/generated/index'],
                    '@hubblecommerce/hubble/platforms/shopware/request': ['../../../src/platforms/shopware/api-client/generated/core/request']
                }
            }
        }
    },
    compatibilityDate: '2024-08-08'
})

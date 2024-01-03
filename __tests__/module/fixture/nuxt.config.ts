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
    }
})

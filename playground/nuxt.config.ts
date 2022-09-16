import { fileURLToPath } from 'url'
import eslintPlugin from 'vite-plugin-eslint'
import hubble from '..'

// @ts-ignore
export default defineNuxtConfig({
    modules: [
        hubble
    ],
    experimental: {
        // https://github.com/nuxt/framework/issues/7517
        treeshakeClientOnly: false,
        // If components: global = true => all styles would be used inline. To avoid this use:
        inlineSSRStyles: false
    },
    nitro: {
        // https://github.com/unjs/nitro/pull/449
        compressPublicAssets: true
    },
    components: {
        // Register all your components globally, which will create async chunks for all your components
        // and prevent global prefetching
        global: true,
        dirs: ['~/components']
    },
    vite: {
        plugins: [
            eslintPlugin()
        ],
        resolve: {
            alias: {
                '@hubblecommerce/hubble/commons': fileURLToPath(new URL('../src/runtime/commons', import.meta.url)),
                '@hubblecommerce/hubble/theme/store': fileURLToPath(new URL('../src/theme/store', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client/utils': fileURLToPath(new URL('../src/platforms/shopware/api-client/utils/index.ts', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../src/platforms/shopware/api-client/generated/index.ts', import.meta.url))
            }
        }
    }
})

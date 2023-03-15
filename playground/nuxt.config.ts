import { fileURLToPath } from 'url'
import eslintPlugin from 'vite-plugin-eslint'
import hubble from '..'

// @ts-ignore
export default defineNuxtConfig({
    modules: [
        hubble
    ],
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
                // @ts-ignore
                '@hubblecommerce/hubble/commons': fileURLToPath(new URL('../src/runtime/commons', import.meta.url)),
                // @ts-ignore
                '@hubblecommerce/hubble/theme/store': fileURLToPath(new URL('../src/theme/store', import.meta.url)),
                // @ts-ignore
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../src/platforms/shopware/api-client/generated/index.ts', import.meta.url))
            }
        }
    }
})

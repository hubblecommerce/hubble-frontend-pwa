import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'
import hubble from '../../..'

export default defineNuxtConfig({
    modules: [
        hubble
    ],
    vite: {
        resolve: {
            alias: {
                '@hubblecommerce/hubble/commons': fileURLToPath(new URL('../../../src/runtime/commons', import.meta.url)),
                '@hubblecommerce/hubble/src/store': fileURLToPath(new URL('../../../src/runtime/src/store', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client/utils': fileURLToPath(new URL('../../../src/runtime/platforms/shopware/api-client/utils/index.ts', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../../../src/runtime/platforms/shopware/api-client/generated/index.ts', import.meta.url))
            }
        }
    }
})

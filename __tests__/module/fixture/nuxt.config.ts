import { fileURLToPath } from 'url'
import hubble from '../../..'

// @ts-ignore
export default defineNuxtConfig({
    modules: [
        hubble
    ],
    vite: {
        resolve: {
            alias: {
                '@hubblecommerce/hubble/commons': fileURLToPath(new URL('../../../src/runtime/commons', import.meta.url)),
                '@hubblecommerce/hubble/theme/store': fileURLToPath(new URL('../../../src/theme/store', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client/utils': fileURLToPath(new URL('../../../src/platforms/shopware/api-client/utils/index.ts', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../../../src/platforms/shopware/api-client/generated/index.ts', import.meta.url))
            }
        }
    }
})

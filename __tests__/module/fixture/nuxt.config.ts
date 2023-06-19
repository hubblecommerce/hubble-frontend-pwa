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
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../../../src/platforms/shopware/api-client/generated/index.ts', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/request': fileURLToPath(new URL('../../../src/platforms/shopware/api-client/generated/core/request.ts', import.meta.url))
            }
        }
    }
})

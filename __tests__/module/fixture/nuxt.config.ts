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
                '@hubblecommerce/hubble': fileURLToPath(new URL('../../../src/runtime', import.meta.url))
            }
        }
    }
})

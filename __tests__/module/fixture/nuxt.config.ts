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
                '@hubblecommerce/hubble/dist': fileURLToPath(new URL('../../../src', import.meta.url))
            }
        }
    }
})

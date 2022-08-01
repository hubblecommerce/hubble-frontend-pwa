import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'
import eslintPlugin from 'vite-plugin-eslint'
import hubble from '..'

export default defineNuxtConfig({
    modules: [
        hubble
    ],
    vite: {
        plugins: [
            eslintPlugin()
        ],
        resolve: {
            alias: {
                '@hubblecommerce/hubble/commons': fileURLToPath(new URL('../src/runtime/commons', import.meta.url)),
                '@hubblecommerce/hubble/src/store': fileURLToPath(new URL('../src/runtime/src/store', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client/utils': fileURLToPath(new URL('../src/runtime/platforms/shopware/api-client/utils/index.ts', import.meta.url)),
                '@hubblecommerce/hubble/platforms/shopware/api-client': fileURLToPath(new URL('../src/runtime/platforms/shopware/api-client/generated/index.ts', import.meta.url))
            }
        }
    },
    app: {
        head: {
            link: [
                {
                    href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
                    rel: 'stylesheet',
                    integrity: 'sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor',
                    crossorigin: 'anonymous'
                }
            ]
        }
    }
})

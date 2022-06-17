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
        ]
    }
})

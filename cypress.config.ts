import { defineConfig } from 'cypress'

export default defineConfig({
    env: {
        mobileViewportWidthBreakpoint: 1024
    },
    e2e: {
        baseUrl: 'http://localhost:3000',
        video: false,
        setupNodeEvents (on, config) {
            // implement node event listeners here
        }
    }
})

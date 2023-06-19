import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
    test: {
        deps: {
            inline: [/@nuxt\/test-utils-edge/]
        },
        exclude: [...configDefaults.exclude, '**/fixture/**']
    }
})

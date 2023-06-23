import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
    test: {
        deps: {
            inline: [/@nuxt\/test-utils/]
        },
        exclude: [...configDefaults.exclude, '**/fixture/**']
    }
})

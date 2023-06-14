import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils-edge'

describe('hubble Nuxt.js module setup', async () => {
    await setup({
        rootDir: fileURLToPath(new URL('./fixture', import.meta.url))
    })

    it('loads composables from appropriate platform', async () => {
        const html = await $fetch('/')

        expect(html).toContain(`Load composable from appropriate platform: ${process.env.API_BASE_URL}`)
    })

    it('loads overridden composable from project root', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Load overridden composable from project root: overridden component value')
    })

    it('injects runtime config from modules default', async () => {
        const html = await $fetch('/')

        expect(html).toContain('RuntimeConfig | meta.category.title: Category - Hubble Demo')
    })

    it('imports components from module', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Component for testing purposes')
    })

    it('overrides auto imported components with component from project root', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Overridden component from project root')
    })

    async function throw404 () {
        return await $fetch('/this-route-not-exists')
    }

    it('throws 404 correctly', async () => {
        await expect(throw404()).rejects.toThrow('404')
    })
})

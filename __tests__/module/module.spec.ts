import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils-edge'

describe('hubble Nuxt.js module setup', async () => {
    await setup({
        rootDir: fileURLToPath(new URL('./fixture', import.meta.url))
    })

    it('loads files from appropriate platform', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Composable | foo: bar')
    })

    it('overwrites files if exists in project root directory', async () => {
        const html = await $fetch('/')

        expect(html).toContain('This component comes from project root and overrides the module one')
    })

    it('injects runtime config from modules default', async () => {
        const html = await $fetch('/')

        expect(html).toContain('RuntimeConfig | meta.category.title: Category - Hubble Demo')
    })
})


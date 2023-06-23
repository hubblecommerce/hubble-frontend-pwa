import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils'

async function throw404 () {
    return await $fetch('/this-route-not-exists')
}

describe('hubble Nuxt.js module setup', async () => {
    await setup({
        rootDir: fileURLToPath(new URL('./fixture', import.meta.url))
    })

    /*
     * Files based inheritance
     */
    it('loads composables from appropriate platform', async () => {
        const html = await $fetch('/')

        expect(html).toContain(`Load composable from appropriate platform: ${process.env.API_BASE_URL}`)
    })

    it('loads overridden composable from project root', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Load overridden composable from project root: overridden component value')
    })

    it('imports components from module', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Component for testing purposes')
    })

    it('overrides auto imported components with component from project root', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Overridden component from project root')
    })

    /*
     * Plugins
     */
    it('makes sure that plugins do not override module and project root components', async () => {
        const html = await $fetch('/')

        expect(html).not.toContain('Plugins are not allowed to override module nor project root components. Use slot mechanism instead.')
    })

    it('autoimports components added by plugins', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Auto imported plugin component ')
    })

    it('injects pluginConfig.json to runtime config', async () => {
        const html = await $fetch('/')

        expect(html).toContain('RuntimeConfig | testPluginConfig1: Plugin-config 1')
    })

    it('overrides plugin config from nuxt.config', async () => {
        const html = await $fetch('/')

        expect(html).toContain('RuntimeConfig | testPluginConfig2: Plugin config 2 overridden by nuxt.config')
    })

    it('fills plugin slots with components from platform-plugins', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Content from test plugin slot')
    })

    /*
     * Runtime Configs
     */
    it('injects runtime config from modules default', async () => {
        const html = await $fetch('/')

        expect(html).toContain('RuntimeConfig | meta.category.title: Category - Hubble Demo')
    })

    /*
     * Error handling
     */
    it('adds custom error page and override it', async () => {
        try {
            await throw404()
        } catch (e: any) {
            expect(e.data).toContain('Override Custom Error Page')
        }
    })

    /*
     * i18n
     */
    it('generates localized routes from locales/availableLocales.json', async () => {
        const html = await fetch('/de')

        expect(html.status).toBe(200)
    })

    it('resolves translations serverside based on localized route', async () => {
        const html = await $fetch('/de')

        expect(html).toContain('Test Übersetzung')
    })
})

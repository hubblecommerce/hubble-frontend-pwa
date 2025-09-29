import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { setup, $fetch, fetch } from '@nuxt/test-utils'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

describe('hubble Nuxt.js module setup', async () => {
    const fixtureDir = fileURLToPath(new URL('./fixture', import.meta.url))

    await setup({
        rootDir: fixtureDir
    })

    /*
     * Layer-based architecture
     */
    it('module copies layer content to layers/hubble directory', () => {
        const layersDir = join(fixtureDir, 'layers/hubble')
        expect(existsSync(layersDir)).toBe(true)

        // Verify that the module copied the layer files (not just static fixture files)
        // These files should come from src/layer/ via the module's layer copying logic
        expect(existsSync(join(layersDir, 'nuxt.config.ts'))).toBe(true)
        expect(existsSync(join(layersDir, 'components'))).toBe(true)
        expect(existsSync(join(layersDir, 'composables'))).toBe(true)
        expect(existsSync(join(layersDir, 'pages'))).toBe(true)
        expect(existsSync(join(layersDir, 'utils'))).toBe(true)
        expect(existsSync(join(layersDir, 'types'))).toBe(true)
    })

    it('loads composables from hubble layer', async () => {
        const html = await $fetch('/')

        expect(html).toContain(`Load composable from appropriate platform: ${process.env.API_BASE_URL}`)
    })

    it('loads overridden composable from project root (takes precedence over layer)', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Load overridden composable from project root: overridden component value')
    })

    it('imports components from hubble layer', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Component for testing purposes')
    })

    it('project root components override layer components', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Overridden component from project root')
    })

    /*
     * Smart Layer Caching
     */
    it('creates layer sync cache file', () => {
        const cacheFile = join(fixtureDir, '.hubble-layer-sync-cache.json')
        expect(existsSync(cacheFile)).toBe(true)
    })

    /*
     * Plugin Layers System
     */
    it('supports plugin layers that do not override project root components', async () => {
        const html = await $fetch('/')

        expect(html).not.toContain('Plugins are not allowed to override module nor project root components. Use slot mechanism instead.')
    })

    it('autoimports components added by plugins via layers', async () => {
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

    it('fills plugin slots with components from plugin layers', async () => {
        const html = await $fetch('/')

        expect(html).toContain('Content from test plugin slot')
    })

    /*
     * Runtime Configs
     */
    it('injects runtime config from layer nuxt.config', async () => {
        const html = await $fetch('/')

        expect(html).toContain('RuntimeConfig | meta.category.title: Category - Hubble Demo')
    })

    /*
     * Module Dependencies
     */
    it('installs pinia module for state management', async () => {
        const html = await $fetch('/')

        // Verify Pinia store reactive property is accessible
        expect(html).toContain('Pinia Store - Cart Loading: false')
    })

    it('installs VueUse module for utility composables', async () => {
        const html = await $fetch('/')

        // Verify VueUse useCounter works with initial value of 5
        expect(html).toContain('VueUse Test - Counter: 5')
    })

    /*
     * i18n
     */
    it('loads platformLanguages with project override priority', async () => {
        const html = await $fetch('/')

        // Project has 1 entry, layer has empty array [], module should prioritize project
        expect(html).toContain('Platform Languages Count: 1')
    })

    it('resolves translations serverside based on localized route', async () => {
        const html = await $fetch('/de')

        expect(html).toContain('Test Übersetzung')
    })
})

import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import { defu } from 'defu'
import { globby } from 'globby'
import type { Nuxt } from '@nuxt/schema'
import fse from 'fs-extra'
const { pathExists, readJson, copy, emptyDir } = fse

// Set configs of installed platform plugins
async function setPlatformPluginRuntimeConfigs (nuxt: Nuxt, pluginsConfigPath: string) {
    const pluginsConfigExists = await pathExists(pluginsConfigPath)

    if (pluginsConfigExists) {
        const pluginConfigs = await readJson(pluginsConfigPath)
        nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, pluginConfigs)
    }
}

const listAllDirs = (dir: string) => {
    return globby(`${dir}/*`, { onlyDirectories: true })
}

// Smart layer copying with cache
async function smartCopyLayer (
    sourceLayerDir: string,
    targetLayerDir: string,
    cacheFilePath: string,
    moduleVersion: string
): Promise<boolean> {
    const cacheExists = await pathExists(cacheFilePath)
    const targetExists = await pathExists(targetLayerDir)

    let shouldCopy = false

    if (!targetExists) {
        shouldCopy = true
    } else if (!cacheExists) {
        shouldCopy = true
    } else {
        try {
            const cache = await readJson(cacheFilePath)
            if (cache.moduleVersion !== moduleVersion) {
                shouldCopy = true
            }
        } catch {
            shouldCopy = true
        }
    }

    if (shouldCopy) {
        await emptyDir(targetLayerDir)
        await copy(sourceLayerDir, targetLayerDir)

        const cache = {
            moduleVersion,
            lastSync: new Date().toISOString()
        }
        await fse.writeJson(cacheFilePath, cache, { spaces: 2 })
        return true
    }

    return false
}

export interface ModuleOptions {
    pluginsDirName: string,
    pluginsConfigFileName: string
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        // Usually npm package name of your module
        name: '@hubblecommerce/hubble',
        // The key in `nuxt.config` that holds your module options
        configKey: 'hubble',
        // Compatibility constraints
        compatibility: {
            // Semver version of supported nuxt versions
            nuxt: '^3.16.0'
        }
    },
    defaults: {
        pluginsDirName: 'platform-plugins',
        pluginsConfigFileName: 'pluginConfig.json'
    },
    async setup (options, nuxt) {
        // Transpile runtime
        const runtimeDir = fileURLToPath(new URL('./', import.meta.url))
        nuxt.options.build.transpile.push(runtimeDir)

        // Install pinia for store management
        await installModule('@pinia/nuxt')

        // Install VueUse for useful helper composables
        await installModule('@vueuse/nuxt')

        /*
         * Layer-based architecture
         */
        const sourceLayerDir = resolve(join(runtimeDir, 'layer'))
        const targetLayerDir = resolve(join(nuxt.options.rootDir, 'layers', 'hubble'))
        const cacheFilePath = resolve(join(nuxt.options.rootDir, '.hubble-layer-sync-cache.json'))
        const packageJsonPath = resolve(join(runtimeDir, '..', 'package.json'))
        const packageJson = await readJson(packageJsonPath)
        const moduleVersion = packageJson.version
        const platformPluginsDir = resolve(join(nuxt.options.rootDir, options.pluginsDirName))
        const platformPluginsConfigPath = resolve(join(platformPluginsDir, options.pluginsConfigFileName))

        // Copy layer to layers/hubble/ with smart caching
        const layerCopied = await smartCopyLayer(sourceLayerDir, targetLayerDir, cacheFilePath, moduleVersion)
        if (layerCopied) {
            // eslint-disable-next-line no-console
            console.info('Hubble layer synced to layers/hubble/')
        }

        // Handle platform plugins (to be refactored to individual layers in Phase 3)
        // For now, keep existing plugin config loading for compatibility
        const platformPluginsDirs = await listAllDirs(platformPluginsDir)
        // TODO: In Phase 3, this will be refactored to create individual layers

        // File inheritance for pluginMapping.json
        const pluginMappingExists = await pathExists(resolve(join(platformPluginsDir, 'pluginMapping.json')))
        if (pluginMappingExists) {
            const pluginMapping = await readJson(resolve(join(platformPluginsDir, 'pluginMapping.json')))
            nuxt.options.runtimeConfig.public.pluginMapping = defu(nuxt.options.runtimeConfig.public.pluginMapping as any, pluginMapping)
        }

        // No need for file copying or srcDir manipulation with layers
        // Layers are auto-discovered by Nuxt from layers/ directory

        // Keep basic aliases but remove targetDir-based ones (handled by layer)
        // TODO: Review if these are still needed with layers

        // To make resolveComponent() with variable component name possible, set all structure components as global
        nuxt.hook('components:extend', (components) => {
            components.map((component) => {
                // @ts-ignore
                if (component.shortPath.includes('/components/structure') || component.shortPath.includes('plugin')) {
                    component.global = true
                }
            })
        })

        // Add utils/mapping to auto imports to be able to override mapping functions on project level
        nuxt.hook('imports:dirs', (dirs) => {
            dirs.push(resolve(join(targetLayerDir, 'utils/mapping')))
        })

        // Set runtime configs
        await setPlatformPluginRuntimeConfigs(nuxt, platformPluginsConfigPath)

        // Performance: Remove dynamic import prefetching
        // nuxt.hook('build:manifest', (manifest) => {
        //     for (const key in manifest) {
        //         manifest[key].dynamicImports = []
        //     }
        // })

        /*
         * Platform languages config
         */
        // Read platformLanguages from layer
        let platformLanguages
        try {
            platformLanguages = await readJson(resolve(join(targetLayerDir, 'locales/platformLanguages.json')))
        } catch {
            console.warn('platformLanguages.json not found in layer, using empty array')
            platformLanguages = []
        }
        nuxt.options.runtimeConfig.public.platformLanguages = platformLanguages
    }
})

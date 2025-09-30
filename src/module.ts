import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import { defu } from 'defu'
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
         * Environment validation
         */
        const requiredEnvVars = ['API_BASE_URL', 'API_SW_ACCESS_KEY']
        const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

        if (missingEnvVars.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missingEnvVars.join(', ')}. ` +
                'Please check your .env file and ensure all Shopware API credentials are configured. '
            )
        }

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

        // File inheritance for pluginMapping.json
        const pluginMappingExists = await pathExists(resolve(join(platformPluginsDir, 'pluginMapping.json')))
        if (pluginMappingExists) {
            const pluginMapping = await readJson(resolve(join(platformPluginsDir, 'pluginMapping.json')))
            nuxt.options.runtimeConfig.public.pluginMapping = defu(nuxt.options.runtimeConfig.public.pluginMapping as any, pluginMapping)
        }

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
        // Read platformLanguages from project (app/ or root) first, fallback to layer
        let platformLanguages
        const appDir = nuxt.options.dir?.app || 'app'
        const projectAppPlatformLanguagesPath = resolve(join(nuxt.options.rootDir, appDir, 'locales/platformLanguages.json'))
        const projectRootPlatformLanguagesPath = resolve(join(nuxt.options.rootDir, 'locales/platformLanguages.json'))
        const layerPlatformLanguagesPath = resolve(join(targetLayerDir, 'locales/platformLanguages.json'))

        try {
            // Try to load from project app/ directory first (Nuxt 4)
            platformLanguages = await readJson(projectAppPlatformLanguagesPath)
        } catch {
            try {
                // Fallback to project root directory (Nuxt 3 legacy)
                platformLanguages = await readJson(projectRootPlatformLanguagesPath)
            } catch {
                try {
                    // Fallback to layer
                    platformLanguages = await readJson(layerPlatformLanguagesPath)
                } catch {
                    console.warn('platformLanguages.json not found in project or layer, using empty array')
                    platformLanguages = []
                }
            }
        }
        nuxt.options.runtimeConfig.public.platformLanguages = platformLanguages

        // Exclude from Vite pre-bundling to allow Nuxt to process virtual imports (#imports e.g. used in api client request function)
        if (nuxt.options.vite) {
            nuxt.options.vite.optimizeDeps?.exclude?.push('@hubblecommerce/hubble')
        }

        // Plugin override system: Remove layer plugins when project has same-named plugin
        nuxt.hook('app:resolve', (app) => {
            // Get filenames of project plugins (normalize .client/.server suffixes)
            const projectPluginNames = app.plugins
                .filter(p => {
                    const src = p.src || ''
                    // Project plugins are in plugins/ or app/plugins/ but NOT in layers/
                    return (src.includes('/plugins/') || src.includes('/app/plugins/')) &&
                           !src.includes('/layers/')
                })
                .map(p => {
                    const filename = p.src?.split('/').pop()?.replace(/\.(client|server)\./, '.').replace(/\.(ts|js)$/, '')
                    return filename
                })
                .filter(Boolean)

            // Filter out layer plugins that have project overrides (preserve original order)
            app.plugins = app.plugins.filter(p => {
                // Keep all non-layer plugins
                if (!p.src?.includes('layers/hubble/plugins/')) return true

                // For layer plugins, only keep if no project override exists
                const filename = p.src?.split('/').pop()?.replace(/\.(client|server)\./, '.').replace(/\.(ts|js)$/, '')
                return !projectPluginNames.includes(filename)
            })
        })
    }
})

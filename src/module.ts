import { join, extname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, findPath, installModule, loadNuxtConfig } from '@nuxt/kit'
import fse from 'fs-extra'
import { defu } from 'defu'
import { Import } from 'unimport'
import { CookieOptions } from '#app'
import { PiniaNuxtOptions } from '@pinia/nuxt'

async function setDefaultRuntimeConfigs (nuxt) {
    try {
        // Get configs of configured platform
        const {
            defaultPublicRuntimeConfig,
            defaultPrivateRuntimeConfig
        } = await import(`./runtime/platforms/${process.env.PLATFORM}/config${extname(import.meta.url)}`)

        // Merge default configs with configs set in nuxt.config.js
        nuxt.options.runtimeConfig.public = defu(nuxt.options.publicRuntimeConfig.public, defaultPublicRuntimeConfig)
        nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, defaultPrivateRuntimeConfig)
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        throw Error
    }
}

async function setPluginRuntimeConfigs (nuxt, pluginsConfigPath) {
    // Handle shopware plugin configurations
    const swPluginsConfigExists = await fse.pathExists(pluginsConfigPath)

    if (swPluginsConfigExists) {
        const pluginConfigs = await fse.readJson(pluginsConfigPath)
        nuxt.options.publicRuntimeConfig = defu(nuxt.options.publicRuntimeConfig, pluginConfigs)
    }
}

function checkForDuplicates (imports: Import[]) {
    const uniqueValues = new Set(imports.map(v => v.name))
    return uniqueValues.size < imports.length
}

function normalizeImports (imports: Import[], runtimeDir: string, rootDir: string) {
    if (!checkForDuplicates(imports)) {
        return false
    }

    const importsSet = new Set()

    imports.forEach((item) => {
        // check if the current is a duplicate
        const isDuplicate: boolean = importsSet.has(item.name)

        // if it's a duplicate, get all indexes of this duplicate by name
        if (isDuplicate) {
            const indexesOfDuplicates = []

            for (let i = 0; i < imports.length; i++) {
                if (imports[i].name === item.name) {
                    indexesOfDuplicates.push(i)
                }
            }

            // Create array of indexes with position based on priority
            const sortedIndexes = []
            indexesOfDuplicates.forEach((indexOfDuplicate) => {
                if (imports[indexOfDuplicate].from.includes(join(runtimeDir, 'src/composables'))) {
                    sortedIndexes.push({
                        index: indexOfDuplicate,
                        position: 0
                    })
                    return
                }

                if (imports[indexOfDuplicate].from.includes(join(runtimeDir, `platforms/${process.env.PLATFORM}/composables`))) {
                    sortedIndexes.push({
                        index: indexOfDuplicate,
                        position: 1
                    })
                    return
                }

                if (imports[indexOfDuplicate].from.includes(join(rootDir, 'composables'))) {
                    sortedIndexes.push({
                        index: indexOfDuplicate,
                        position: 2
                    })
                }
            })

            // sort array of indexes by position
            sortedIndexes.sort(function (a, b) {
                return a.position - b.position
            })

            // remove last index of sorted array so the rest can be deleted
            const indexesToBeDeleted = sortedIndexes.slice(0, -1)

            indexesToBeDeleted.forEach((index) => {
                imports.splice(index.index, 1)
            })

            return
        }

        // add the current item to the Set
        importsSet.add(item.name)

        return isDuplicate
    })

    if (checkForDuplicates(imports)) {
        normalizeImports(imports, runtimeDir, rootDir)
    }
}

interface SessionCookie {
    name: string,
    options: CookieOptions
}

export interface ModuleOptions {
    pluginsDirName: string,
    pluginsConfigFileName: string,
    sessionCookie: SessionCookie,
    piniaOptions: PiniaNuxtOptions
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
            nuxt: '^3.0.0'
        }
    },
    defaults: {
        pluginsDirName: 'shop-plugins',
        pluginsConfigFileName: 'pluginConfig.json',
        sessionCookie: {
            name: 'hubble-session-token',
            options: {
                maxAge: 60 * 60 * 24 * 30,
                sameSite: 'lax',
                path: '/'
            }
        },
        piniaOptions: { disableVuex: true }
    },
    async setup (options, nuxt) {
        if (process.env.PLATFORM == null || process.env.PLATFORM === '') {
            // eslint-disable-next-line no-console
            console.error('Please provide a valid .env file')
            return
        }

        // Transpile runtime
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
        nuxt.options.build.transpile.push(runtimeDir)

        // Install pinia for store management
        await installModule('@pinia/nuxt', { disableVuex: true })

        // Auto import composables
        nuxt.hook('autoImports:dirs', (dirs) => {
            dirs.push(resolve(join(runtimeDir, 'platforms', process.env.PLATFORM), 'composables'))
        })

        // Normalize auto imported composables in order to the priority: runtime/src -> runtime/src/platform -> rootDir
        nuxt.hook('autoImports:extend', (imports) => {
            normalizeImports(imports, runtimeDir, nuxt.options.rootDir)
        })

        // Add custom error page
        nuxt.hook('app:resolve', (app) => {
            app.errorComponent = resolve(join(runtimeDir, 'src/error.vue'))
        })

        // To make resolveComponent() with variable component name possible, set all structure components as global
        nuxt.hook('components:extend', (components) => {
            // eslint-disable-next-line array-callback-return
            components.map((component) => {
                // @ts-ignore
                if (component.shortPath.includes('/components/structure')) {
                    component.global = true
                }
            })
        })

        // Use Nuxt extends to provide file based inheritance
        // https://v3.nuxtjs.org/api/configuration/nuxt.config#extends
        // Create a nuxt config based on project configs and set module as cwd
        const nuxtConfig = await loadNuxtConfig({
            name: 'nuxt',
            configFile: 'nuxt.config',
            dotenv: true,
            globalRc: true,
            cwd: fileURLToPath(new URL('./runtime/src', import.meta.url)),
            overrides: {
                dev: true
            }
        })

        // Set layers to current nuxt.options
        for (const layer of nuxtConfig._layers) {
            nuxt.options._layers.push(layer)
        }

        // Set default configs
        const pluginsDir = join(nuxt.options.rootDir, options.pluginsDirName)
        const pluginsConfigPath = join(pluginsDir, options.pluginsConfigFileName)

        await setDefaultRuntimeConfigs(nuxt)
        await setPluginRuntimeConfigs(nuxt, pluginsConfigPath)

        // Set configs from module options
        nuxt.options.runtimeConfig.public.sessionCookie = {
            name: options.sessionCookie.name,
            options: options.sessionCookie.options
        }
    }
})

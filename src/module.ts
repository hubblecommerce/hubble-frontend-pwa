import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, loadNuxtConfig } from '@nuxt/kit'
import fse from 'fs-extra'
import { defu } from 'defu'

async function setDefaultRuntimeConfigs (nuxt) {
    try {
        const currentFileExt = extname(__filename)

        // Get configs of configured platform
        const {
            defaultPublicRuntimeConfig,
            defaultPrivateRuntimeConfig
        } = await import(`./runtime/platforms/${process.env.PLATFORM}/config${currentFileExt}`)

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

export interface ModuleOptions {
  targetDirName: string,
  pluginsDirName: string,
  pluginsConfigFileName: string,
  rootSubDirBlacklist: string[]
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
        targetDirName: '.hubble',
        pluginsDirName: 'shop-plugins',
        pluginsConfigFileName: 'pluginConfig.json',
        rootSubDirBlacklist: ['node_modules', '.hubble', '.nuxt', '.idea']
    },
    async setup (options, nuxt) {
        if (process.env.PLATFORM == null || process.env.PLATFORM === '') {
            // eslint-disable-next-line no-console
            console.error('Please provide a valid .env file')
            return
        }

        /*
         * Use Nuxt extends to provide file based inheritance
         * https://v3.nuxtjs.org/api/configuration/nuxt.config#extends
         */

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

        // Set normalized layers to current nuxt.options
        for (const layer of nuxtConfig._layers) {
            nuxt.options._layers.push(layer)
        }

        /*
         * Set default configs
         */
        const rootDir = nuxt.options.rootDir
        const pluginsDir = join(rootDir, options.pluginsDirName)
        const pluginsConfigPath = join(pluginsDir, options.pluginsConfigFileName)

        await setDefaultRuntimeConfigs(nuxt)
        await setPluginRuntimeConfigs(nuxt, pluginsConfigPath)
    }
})

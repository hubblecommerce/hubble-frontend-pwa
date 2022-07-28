import path, { join, extname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import fse from 'fs-extra'
import { defu } from 'defu'
import { CookieOptions } from '#app'
import { globby } from 'globby'

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

interface SessionCookie {
    name: string,
    options: CookieOptions
}

export interface ModuleOptions {
    targetDirName: string,
    dirBlacklist: string[],
    pluginsDirName: string,
    pluginsConfigFileName: string,
    sessionCookie: SessionCookie
}

const listAllDirs = dir => globby(`${dir}/*`, { onlyDirectories: true })
const getLastSectionOfPath = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
const asyncCopyDirs = async (sourceDirs, targetDir, options = {}) => {
    await Promise.all(
        sourceDirs.map(async (sourceDir) => {
            await fse.copy(sourceDir, path.join(targetDir, path.basename(sourceDir)), options)
        })
    )
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
        targetDirName: '.hubble/',
        dirBlacklist: ['node_modules', 'hubble', '.nuxt', '.output', '.idea'],
        pluginsDirName: 'platform-plugins',
        pluginsConfigFileName: 'pluginConfig.json',
        sessionCookie: {
            name: 'hubble-session-token',
            options: {
                maxAge: 60 * 60 * 24 * 30,
                sameSite: 'lax',
                path: '/'
            }
        }
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

        /*
         * File-based inheritance logic
         */
        const baseDir = resolve(join(runtimeDir, 'src'))
        const targetDir = resolve(join(nuxt.options.rootDir, options.targetDirName))
        const platformDir = resolve(join(runtimeDir, 'platforms', process.env.PLATFORM))
        const platformPluginsDir = resolve(join(nuxt.options.rootDir, options.pluginsDirName))
        const platformPluginsConfigPath = resolve(join(platformPluginsDir, options.pluginsConfigFileName))

        const rootDirs = await listAllDirs(nuxt.options.rootDir)
        const validRootDirs: string[] = []
        rootDirs.forEach((dir) => {
            if (!options.dirBlacklist.includes(getLastSectionOfPath(dir))) {
                validRootDirs.push(dir)
            }
        })

        await fse.emptyDir(targetDir)
        await fse.copy(baseDir, targetDir)
        await fse.copy(resolve(join(runtimeDir, 'platforms', process.env.PLATFORM, 'composables')), resolve(join(targetDir, 'composables')))
        // TODO: copy platform plugins dir to target
        await asyncCopyDirs(validRootDirs, targetDir)

        // Set srcDir of nuxt base layer
        for (const layer of nuxt.options._layers) {
            if (layer.configFile === 'nuxt.config') {
                layer.config.srcDir = resolve(join(layer.config.srcDir, options.targetDirName))
            }
        }

        // Add custom error page
        nuxt.hook('app:resolve', (app) => {
            app.errorComponent = resolve(join(targetDir, 'components/misc/MiscError.vue'))
        })

        // Install pinia for store management
        await installModule('@pinia/nuxt', { disableVuex: true })

        // To make resolveComponent() with variable component name possible, set all structure components as global
        nuxt.hook('components:extend', (components) => {
            // eslint-disable-next-line array-callback-return
            components.map((component) => {
                // @ts-ignore
                if (component.shortPath.includes('/components/structure') || component.shortPath.includes('plugin')) {
                    component.global = true
                }
            })
        })

        // Set default configs
        // const pluginsConfigPath = join(pluginsDir, options.pluginsConfigFileName)
        //
        await setDefaultRuntimeConfigs(nuxt)
        // await setPluginRuntimeConfigs(nuxt, pluginsConfigPath)

        // Set configs from module options
        nuxt.options.runtimeConfig.public.sessionCookie = {
            name: options.sessionCookie.name,
            options: options.sessionCookie.options
        }

        // Vite only: remove /node_modules/ from excluded dynamic import vars
        // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#exclude
        if (nuxt.options.vite) {
            nuxt.options.vite.build.dynamicImportVarsOptions = { exclude: [] }
        }
    }
})

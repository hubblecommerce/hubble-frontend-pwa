import path, { join, extname, resolve, basename } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, installModule } from '@nuxt/kit'
import fse from 'fs-extra'
import { defu } from 'defu'
import { CookieOptions } from '#app'
import { globby } from 'globby'
import { watch } from 'chokidar'
import { Config } from 'tailwindcss'
import daisyui from 'daisyui'

// Set configs of configured platform
async function setDefaultRuntimeConfigs (nuxt) {
    try {
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

// Set configs of installed platform plugins
async function setPlatformPluginRuntimeConfigs (nuxt, pluginsConfigPath) {
    const pluginsConfigExists = await fse.pathExists(pluginsConfigPath)

    if (pluginsConfigExists) {
        const pluginConfigs = await fse.readJson(pluginsConfigPath)
        nuxt.options.runtimeConfig.public = defu(nuxt.options.runtimeConfig.public, pluginConfigs)
    }
}

const listAllDirs = dir => globby(`${dir}/*`, { onlyDirectories: true })
const getLastSectionOfPath = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
const asyncCopyDirs = async (sourceDirs, targetDir, options = {}) => {
    await Promise.all(
        sourceDirs.map(async (sourceDir) => {
            await fse.copy(sourceDir, join(targetDir, basename(sourceDir)), options)
        })
    )
}

export interface SessionCookie {
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
        dirBlacklist: ['node_modules', '.hubble', '.nuxt', '.output', '.idea', 'platform-plugins'],
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

        // Install pinia for store management
        await installModule('@pinia/nuxt', { disableVuex: true })

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
        await fse.copy(resolve(join(platformDir, 'composables')), resolve(join(targetDir, 'composables')))

        const platformPluginsDirs = await listAllDirs(platformPluginsDir)
        for (const pluginDir of platformPluginsDirs) {
            const subDirs = await globby(`${pluginDir}/*`, { onlyDirectories: true })
            // Platform plugins are not allowed to override hubble module files, to keep the inheritance order
            // strict and readable. Use plugin-slot for injections.
            await asyncCopyDirs(subDirs, targetDir, { overwrite: false, errorOnExist: true })
        }

        await asyncCopyDirs(validRootDirs, targetDir)

        // Set srcDir of nuxt base layer
        for (const layer of nuxt.options._layers) {
            if (layer.configFile === 'nuxt.config') {
                layer.config.srcDir = resolve(join(layer.config.srcDir, options.targetDirName))
            }
        }

        const baseAliases = {
            '~~': nuxt.options.rootDir,
            '@@': nuxt.options.rootDir,

            '~': targetDir,
            '@': targetDir,

            assets: path.join(targetDir, 'assets'),
            public: path.join(targetDir, 'public')
        }
        nuxt.options.alias = { ...nuxt.options.alias, ...baseAliases }

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

        // Set runtime configs
        await setDefaultRuntimeConfigs(nuxt)
        await setPlatformPluginRuntimeConfigs(nuxt, platformPluginsConfigPath)

        // Set configs from module options
        nuxt.options.runtimeConfig.public.sessionCookie = {
            name: options.sessionCookie.name,
            options: options.sessionCookie.options
        }

        // Vite only: exclude module from optimizeDeps to prevent vite from optimize #app and #import inside
        // of module
        if (nuxt.options.vite) {
            nuxt.options.vite.optimizeDeps.exclude.push('@hubblecommerce/hubble')
        }

        // Add custom error page
        nuxt.hook('app:resolve', (app) => {
            app.errorComponent = resolve(join(targetDir, 'components/misc/MiscError.vue'))
        })

        /*
         * Theming
         */
        // @ts-ignore
        nuxt.hook('tailwindcss:config', (twConfig: Config) => {
            let configOverrides: Config = {
                content: [],
                plugins: [
                    daisyui
                ]
            }
            configOverrides = defu(twConfig, configOverrides)

            const contentOverrides = [
                join(targetDir, 'components/**/*.{vue,js}'),
                join(targetDir, 'layouts/**/*.vue'),
                join(targetDir, 'pages/**/*.vue'),
                join(targetDir, 'composables/**/*.{js,ts}'),
                join(targetDir, 'plugins/**/*.{js,ts}'),
                join(targetDir, 'App.{js,ts,vue}'),
                join(targetDir, 'app.{js,ts,vue}')
            ]
            configOverrides.content = contentOverrides

            // Need to set via Object.assign because we cannot update the reference of the object
            Object.assign(twConfig, configOverrides)
        })

        await installModule('@nuxtjs/tailwindcss', {
            configPath: join(nuxt.options.rootDir, 'tailwind.config.ts')
        })

        await installModule('@nuxtjs/color-mode', {
            preference: 'system', // default theme
            dataValue: 'theme', // activate data-theme in <html> tag
            classSuffix: ''
        })

        nuxt.options.build.transpile.push('@heroicons/vue')

        // Dev only: register new file-watcher based on file inheritance
        if (nuxt.options.dev) {
            const excludedDirectories = [...options.dirBlacklist.map(__blacklistedDir => `${nuxt.options.rootDir}/${__blacklistedDir}/**`)]
            const toTargetPath = oldPath => resolve(oldPath.replace(nuxt.options.rootDir, targetDir))

            watch(nuxt.options.rootDir, { ignoreInitial: true, ignored: excludedDirectories }).on('all', async (event, filePath) => {
                const newDestination = toTargetPath(filePath)

                if (newDestination === '') {
                    return false
                }

                if (event === 'add' || event === 'change') {
                    await fse.copy(filePath, newDestination)
                }

                // TODO: if deleted file was an override of platform plugin, copy platform plugin file
                if (event === 'unlink') {
                    const modulePath = filePath.replace(nuxt.options.rootDir, baseDir)

                    fse.pathExists(modulePath, async (err, exists) => {
                        if (exists) {
                            // copy from module
                            await fse.copy(modulePath, newDestination)
                        } else if (!exists) {
                            // path does not exist in module just remove from srcDir
                            await fse.remove(newDestination)
                        } else if (err) {
                            // eslint-disable-next-line no-console
                            console.log('err occurred: ', err)
                        }
                    })
                }
            })

            watch(baseDir, { ignoreInitial: true, ignored: excludedDirectories }).on('all', (event, filePath) => {
                const newDestination = resolve(filePath.replace(baseDir, targetDir))

                if (newDestination === '') {
                    return false
                }

                const rootPath = filePath.replace(baseDir, nuxt.options.rootDir)

                fse.pathExists(rootPath, async (err, exists) => {
                    if (!exists) {
                        if (event === 'add' || event === 'change') {
                            fse.copy(filePath, newDestination)
                        }

                        if (event === 'unlink') {
                            await fse.remove(newDestination)
                        }
                    } else if (err) {
                        // eslint-disable-next-line no-console
                        console.log('err occurred: ', err)
                    }
                })
            })
        }
    }
})

import { resolve, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule } from '@nuxt/kit'
import { globby } from 'globby'
import fse from 'fs-extra'
import { defu } from 'defu'
import chokidar from 'chokidar'

const listAllDirs = dir => globby(`${dir}/*`, { onlyDirectories: true })
const getLastSectionOfPath = path => path.substring(path.lastIndexOf('/') + 1)

async function getRootSubDirs (rootDir: string, dirBlacklist: string[]) {
    const rootDirs = await listAllDirs(rootDir)
    const validRootDirs = []
    rootDirs.forEach((dir) => {
        if (!dirBlacklist.includes(getLastSectionOfPath(dir))) {
            validRootDirs.push(dir)
        }
    })

    return validRootDirs
}

const asyncCopyDirs = async (sourceDirs, targetDir, options = {}) => {
    await Promise.all(
        sourceDirs.map(async (sourceDir) => {
            await fse.copy(sourceDir, join(targetDir, basename(sourceDir)), options)
        })
    )
}

async function setDefaultRuntimeConfigs (nuxt) {
    try {
        // Get configs of configured platform
        const {
            defaultPublicRuntimeConfig,
            defaultPrivateRuntimeConfig
        } = await import(`./runtime/platforms/${process.env.PLATFORM}/config`)

        // Merge default configs with configs set in nuxt.config.js
        nuxt.options.runtimeConfig.public = defu(nuxt.options.publicRuntimeConfig.public, defaultPublicRuntimeConfig)
        nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, defaultPrivateRuntimeConfig)
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error on setting runtime configs, please make sure you set the correct platform in your .env')
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
    hooks: {
        'components:dirs' (dirs) {
            dirs.push({
                path: fileURLToPath(new URL('./runtime/src/components', import.meta.url))
            })
        }
    },
    async setup (options, nuxt) {
        if (process.env.PLATFORM == null || process.env.PLATFORM === '') {
            // eslint-disable-next-line no-console
            console.error('Please provide a valid .env file')
            return
        }

        /*
         * Set constants
         */
        const rootDir = nuxt.options.rootDir
        const moduleBaseDir = fileURLToPath(new URL('./runtime', import.meta.url))
        const moduleSrcDir = join(moduleBaseDir, '/src')
        const platformComposablesDir = join(moduleBaseDir, `platforms/${process.env.PLATFORM}/composables`)
        const platformApiClientDir = join(moduleBaseDir, `platforms/${process.env.PLATFORM}/api-client`)
        const targetDir = join(rootDir, options.targetDirName)
        const pluginsDir = join(rootDir, options.pluginsDirName)
        const pluginsConfigPath = join(pluginsDir, options.pluginsConfigFileName)
        const rootSubDirs = await getRootSubDirs(rootDir, options.rootSubDirBlacklist)
        const pluginDirs = await listAllDirs(pluginsDir)

        /*
         * File inheritance mechanism
         */
        // 1. Set target dir as nuxt src dir
        nuxt.options.srcDir = options.targetDirName

        // 2. Clear target dir
        await fse.emptyDir(targetDir)

        // 3. Copy dirs from module / platform to nuxt source dir
        await fse.copy(moduleSrcDir, targetDir)
        await fse.copy(platformComposablesDir, join(targetDir, '/composables'))
        await fse.copy(platformApiClientDir, join(targetDir, '/api-client'))

        // 4. Copy Plugins from each module to target dir
        for (const pluginDir of pluginDirs) {
            const subDirs = await globby(`${pluginDir}/*`, { onlyDirectories: true })
            await asyncCopyDirs(subDirs, targetDir, {
                overwrite: false,
                errorOnExist: true
            })
        }

        // 5. Copy dirs from root dir to nuxt source dir
        await asyncCopyDirs(rootSubDirs, targetDir)

        // 6. Set aliases, to make them work in target dir
        const baseAliases = {
            '~~': rootDir,
            '@@': rootDir,

            '~': targetDir,
            '@': targetDir,

            assets: join(targetDir, 'assets'),
            static: join(targetDir, 'static')
        }

        nuxt.options.alias = { ...nuxt.options.alias, ...baseAliases }

        /*
         * Set default configs
         */
        await setDefaultRuntimeConfigs(nuxt)
        await setPluginRuntimeConfigs(nuxt, pluginsConfigPath)

        /*
         * Dev Mode
         */
        if (nuxt.options.dev || nuxt.options._start) {
            /*
             * File watcher
             */
            const excludedDirectories = [...options.rootSubDirBlacklist.map(__blacklistedDir => `${rootDir}/${__blacklistedDir}/**`)]
            const toTargetPath = oldPath => resolve(oldPath.replace(rootDir, targetDir))

            // eslint-disable-next-line import/no-named-as-default-member
            chokidar.watch(`${rootDir}`, {
                ignoreInitial: true,
                ignored: excludedDirectories
            }).on('all', async (event, filePath) => {
                let newDestination = ''

                // Build file destination for local modules mode (Contribution Setup)
                if (filePath.includes('/modules/')) {
                    const moduleSrcDir = filePath.match(/@hubblecommerce\/hubble\/src\//)
                    const variablePlatformPath = new RegExp(`/@hubblecommerce/hubble/platforms/${process.env.PLATFORM}`)
                    const modulePlatformsDir = filePath.match(variablePlatformPath)

                    if (moduleSrcDir != null) {
                        const relativePath = filePath.substr(moduleSrcDir[0].length + moduleSrcDir.index)
                        newDestination = join(targetDir, relativePath)
                    }

                    if (modulePlatformsDir != null) {
                        const relativePath = filePath.substr(modulePlatformsDir[0].length + modulePlatformsDir.index)
                        newDestination = join(targetDir, relativePath)
                    }
                } else {
                    newDestination = toTargetPath(filePath)
                }

                if (newDestination === '') {
                    return
                }

                if (event === 'add' || event === 'change') {
                    for (const pluginDir of pluginDirs) {
                        const subDirs = await globby(`${pluginDir}/*`, { onlyDirectories: true })
                        await asyncCopyDirs(subDirs, targetDir)
                    }

                    await fse.copy(filePath, newDestination)
                }

                if (event === 'unlink') {
                    const modulePath = filePath.replace(rootDir, moduleSrcDir)

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
        }
    }
})

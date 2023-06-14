/* eslint-disable */
import path from 'path'
import unzipper from 'unzipper'
import fse from 'fs-extra'
import { config } from 'dotenv'
import lmify from 'lmify'
import { $fetch } from 'ofetch'
import { fetch } from 'node-fetch-native'

const playgroundPath = path.resolve(path.join(process.env.INIT_CWD, 'playground'))
const playgroundExists = await fse.pathExists(playgroundPath)

if (playgroundExists) {
    config({ path: `${playgroundPath}/.env` })
} else {
    config()
}

const { install, setPackageManager } = lmify
const projectDir = playgroundExists ? playgroundPath : process.env.INIT_CWD
const pluginsDirName = 'platform-plugins'
const pluginsDir = path.join(projectDir, `/${pluginsDirName}`)
const pluginConfigFile = 'pluginConfig.json'
const apiBasePath = process.env.API_BASE_URL.replace('/store-api', '')
const authRoute = '/api/oauth/token'
const authErrorMsg = 'Authorization failed, please check if your .env file provides the data API_CLIENT_ID ' +
    'and API_CLIENT_SECRET with values from your Shopware created integration ' +
    'https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system'
const clientId = process.env.API_CLIENT_ID
const clientSecret = process.env.API_CLIENT_SECRET
const dumpBundlesRoute = '/api/_action/pwa/dump-bundles'
const assetsZipPath = [pluginsDir, 'assets.zip'].join('/')
const mappingFileName = 'pluginMapping.json'
const configWhiteListFileName = 'pluginConfigWhitelist.json'

function downloadFile (fileUrl, outputLocationPath) {
    const writer = fse.createWriteStream(outputLocationPath)

    return fetch(path.join(apiBasePath, fileUrl), {
        method: 'GET'
    }).then((response) => {
        return new Promise((resolve, reject) => {
            response.body.pipe(writer)

            let error = null
            writer.on('error', (err) => {
                error = err
                writer.close()
                reject(err)
            })
            writer.on('close', () => {
                if (!error) {
                    resolve(true)
                }
                // no need to call the reject here, as it will have been called in the 'error' stream;
            })
        })
    })
}

function unzipFile (inputLocationPath, outputLocationPath) {
    return new Promise((resolve, reject) => {
        let error = null
        fse.createReadStream(inputLocationPath).pipe(unzipper.Extract({ path: outputLocationPath }))
            .on('close', () => {
                if (!error) {
                    resolve(true)
                }
            })
            .on('error', (err) => {
                error = err
                reject(err)
            })
    })
}

function camelCase (input) {
    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase()
    })
}

function capitalizeFirstLetter (string) {
    return string.replace(/^\w/, c => c.toUpperCase())
}

async function ensurePluginsDir () {
    try {
        await fse.ensureDir(pluginsDir)
    } catch (e) {
        return e
    }
}

async function authorize () {
    try {
        const response = await $fetch.raw(apiBasePath + authRoute, {
            method: 'POST',
            body: {
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret
            }
        })

        return [response._data, null]
    } catch (e) {
        return [null, e]
    }
}

async function dumpBundles (authResponse) {
    try {
        const response = await $fetch.raw(apiBasePath + dumpBundlesRoute, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authResponse.access_token}` }
        })

        return [response._data.buildArtifact, response._data.bundleConfig, null]
    } catch (e) {
         
        console.error(e)
    }
}

async function removeConfigFile () {
    try {
        await fse.remove(path.join(pluginsDirName, `/${pluginConfigFile}`))
        return [true, null]
    } catch (e) {
        return [null, e]
    }
}

async function fetchPluginConfig (path) {
    try {
        const response = await $fetch.raw(apiBasePath + path)
        return [response._data, null]
    } catch (e) {
        return [null, e]
    }
}

async function createPluginConfig (pluginConfigs) {
    try {
        const obj = {}

        let whiteList = null
        try {
            whiteList = await fse.readJson([pluginsDir, configWhiteListFileName].join('/'))
        } catch (e) {}

        Object.keys(pluginConfigs).forEach((pluginName) => {
            if (Object.keys(pluginConfigs[pluginName].configuration).length > 0) {
                Object.keys(pluginConfigs[pluginName].configuration).forEach((config) => {
                    Object.keys(pluginConfigs[pluginName].configuration[config]).forEach((configName) => {
                        const configKey = camelCase(pluginName) + capitalizeFirstLetter(configName)

                        if (whiteList != null) {
                            if (whiteList.includes(configKey)) {
                                const parsedObject = {
                                    [configKey]: pluginConfigs[pluginName].configuration[config][configName]
                                }

                                Object.assign(obj, parsedObject)
                            }
                        } else if (!configKey.toLowerCase().includes('secret') &&
                            !configKey.toLowerCase().includes('private') &&
                            !configKey.toLowerCase().includes('password')) {
                            const parsedObject = {
                                [configKey]: pluginConfigs[pluginName].configuration[config][configName]
                            }

                            Object.assign(obj, parsedObject)
                        }
                    })
                })
            }
        })

        await fse.writeJson(path.join(pluginsDir, pluginConfigFile), obj)

        return [pluginConfigFile, null]
    } catch (e) {
        return [null, e]
    }
}

async function downloadAssets (fileUrl) {
    try {
        await fse.ensureDir(pluginsDir)
        await fse.remove(assetsZipPath)
        const response = await downloadFile(fileUrl, assetsZipPath)
        return [response, null]
    } catch (e) {
        return [null, e]
    }
}

async function removePluginDirs () {
    try {
        const pluginDirs = await getDirs(pluginsDir)

        for (const pluginDir of pluginDirs) {
            await fse.remove(pluginDir)
        }

        return [true, null]
    } catch (e) {
        return [null, e]
    }
}

async function unzipAssets () {
    try {
        const response = await unzipFile(assetsZipPath, pluginsDir)
        await fse.remove(assetsZipPath)
        return [response, null]
    } catch (e) {
        return [null, e]
    }
}

async function getDirs (dir) {
    const pluginDirs = []
    const dirents = await fse.readdir(dir, { withFileTypes: true })

    for (const dirent of dirents) {
        if (dirent.isDirectory()) {
            pluginDirs.push([pluginsDir, dirent.name].join('/'))
        }
    }

    return pluginDirs
}

async function collectDependencies () {
    try {
        const dependencies = []
        const pluginDirs = await getDirs(pluginsDir)

        for (const pluginDir of pluginDirs) {
            const packageJsonPath = [pluginDir, 'package.json'].join('/')
            const packageJsonExists = await fse.pathExists(packageJsonPath)

            if (packageJsonExists) {
                const packageJson = await fse.readJson(packageJsonPath)

                for (const dep in packageJson.dependencies) {
                    dependencies.push(dep + '@' + packageJson.dependencies[dep])
                }
            }
        }

        return [dependencies, null]
    } catch (e) {
        return [null, e]
    }
}

async function installDependencies (deps) {
    try {
        setPackageManager('npm')

        for (const dep of deps) {
            await install(dep)
        }

        return [true, null]
    } catch (e) {
        return [null, e]
    }
}

async function collectPluginMapping () {
    try {
        const mapping = []
        const pluginDirs = await getDirs(pluginsDir)

        for (const pluginDir of pluginDirs) {
            const pluginMappingJson = await fse.readJson([pluginDir, mappingFileName].join('/'))

            if (pluginMappingJson) {
                if (!Object.prototype.hasOwnProperty.call(pluginMappingJson, 'pluginSlots')) {
                    throw new Error(`${mappingFileName} of ${pluginDir} has wrong format`)
                }

                pluginMappingJson.pluginSlots.forEach((slot) => {
                    mapping.push(slot)
                })
            }
        }

        return [mapping, null]
    } catch (e) {
        return [null, e]
    }
}

async function removeMapping () {
    try {
        await fse.remove([pluginsDir, mappingFileName].join('/'))

        return [true, null]
    } catch (e) {
        return [null, e]
    }
}

async function setPluginMapping (pluginMapping) {
    try {
        await fse.writeJson([pluginsDir, mappingFileName].join('/'), { pluginSlots: pluginMapping })

        return [true, null]
    } catch (e) {
        return [null, e]
    }
}

export {
    projectDir,
    downloadFile,
    unzipFile,
    camelCase,
    ensurePluginsDir,
    authorize,
    authErrorMsg,
    dumpBundles,
    removeConfigFile,
    fetchPluginConfig,
    createPluginConfig,
    downloadAssets,
    removePluginDirs,
    unzipAssets,
    getDirs,
    collectDependencies,
    installDependencies,
    collectPluginMapping,
    removeMapping,
    setPluginMapping
}

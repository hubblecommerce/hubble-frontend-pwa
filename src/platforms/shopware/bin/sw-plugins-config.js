#!/usr/bin/env node
import * as swPlugins from './sw-plugins-functions.js'

const main = async function () {
    const error = await swPlugins.ensurePluginsDir()
    if (error) {
        throw new Error(error)
    }

    const [authResponse, authError] = await swPlugins.authorize()
    if (authError) {
        throw new Error(swPlugins.authErrorMsg)
    }

    // eslint-disable-next-line no-unused-vars
    const [buildArtifact, bundleConfig, buildError] = await swPlugins.dumpBundles(authResponse)
    if (buildError) {
        throw new Error(buildError)
    }

    // eslint-disable-next-line no-unused-vars
    const [removeResponse, removeError] = await swPlugins.removeConfigFile()
    if (removeError) {
        throw new Error(removeError)
    }

    const [pluginConfigFile, createConfigError] = await swPlugins.createPluginConfig(bundleConfig)
    if (createConfigError) {
        throw new Error(createConfigError)
    }

    // eslint-disable-next-line no-console
    console.log(`Successfully built config file ${pluginConfigFile}`)
}

export default main

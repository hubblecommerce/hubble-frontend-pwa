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

    // Generate plugin config file
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

    // Generate plugin mapping (moved from sw-plugins-assets.js)
    const [pluginMapping, collectPluginMappingError] = await swPlugins.collectPluginMapping()
    if (collectPluginMappingError) {
        throw new Error(collectPluginMappingError)
    }

    // eslint-disable-next-line no-unused-vars
    const [removeMappingResponse, removeMappingError] = await swPlugins.removeMapping()
    if (removeMappingError) {
        throw new Error(removeMappingError)
    }

    // eslint-disable-next-line no-unused-vars
    const [setPluginMappingResponse, setPluginMappingError] = await swPlugins.setPluginMapping(pluginMapping)
    if (setPluginMappingError) {
        throw new Error(setPluginMappingError)
    }

    // eslint-disable-next-line no-console
    console.log('Successfully generated plugin slot mapping')
}

export default main

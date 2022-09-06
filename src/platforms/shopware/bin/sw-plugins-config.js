#!/usr/bin/env node
import * as swPlugins from './sw-plugins-functions'

const main = async function () {
    const error = await swPlugins.ensurePluginsDir()
    if (error) {
        throw new Error(error)
    }

    const [authResponse, authError] = await swPlugins.authorize()
    if (authError) {
        throw new Error(swPlugins.authErrorMsg)
    }

    const [buildArtifact, buildError] = await swPlugins.dumpBundles(authResponse)
    if (buildError) {
        throw new Error(buildError)
    }

    const [pluginConfigs, fetchPluginConfigError] = await swPlugins.fetchPluginConfig(buildArtifact.config)
    if (fetchPluginConfigError) {
        throw new Error(fetchPluginConfigError)
    }

    const [removeResponse, removeError] = await swPlugins.removeConfigFile()
    if (removeError) {
        throw new Error(removeError)
    }

    const [pluginConfigFile, createConfigError] = await swPlugins.createPluginConfig(pluginConfigs)
    if (createConfigError) {
        throw new Error(createConfigError)
    }

    // eslint-disable-next-line no-console
    console.log(`Successfully built config file ${pluginConfigFile}`)
}

export default main

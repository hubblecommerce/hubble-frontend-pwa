#!/usr/bin/env node
const swPlugins = require('./sw-plugins-functions');

async function init() {
    const error = await swPlugins.ensurePluginsDir();
    if(error) {
        console.error(error);
        return;
    }

    const [authResponse, authError] = await swPlugins.authorize();
    if(authError) {
        console.error(swPlugins.authErrorMsg);
        return;
    }

    const [buildArtifact, buildError] = await swPlugins.dumpBundles(authResponse);
    if(buildError) {
        console.error(buildError);
        return;
    }

    const [pluginConfigs, fetchPluginConfigError] = await swPlugins.fetchPluginConfig(buildArtifact.config);
    if(fetchPluginConfigError) {
        console.error(fetchPluginConfigError);
        return;
    }

    const [removeResponse, removeError] = await swPlugins.removeConfigFile();
    if(removeError) {
        console.error(removeError);
        return;
    }

    const [pluginConfigFile, createConfigError] = await swPlugins.createPluginConfig(pluginConfigs);
    if(createConfigError) {
        console.error(createConfigError);
        return;
    }

    console.log(`Successfully built config file ${pluginConfigFile}`);
}

init();

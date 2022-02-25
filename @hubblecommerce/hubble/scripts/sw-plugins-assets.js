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

    const [downloadResponse, downloadAssetsError] = await swPlugins.downloadAssets(buildArtifact.asset);
    if(downloadAssetsError) {
        console.error(downloadAssetsError);
        return;
    }

    const [removePluginDirsResponse, removePluginDirsError] = await swPlugins.removePluginDirs();
    if(removePluginDirsError) {
        console.error(removePluginDirsError);
        return;
    }

    const [unzipAssetsResponse, unzipAssetsError] = await swPlugins.unzipAssets();
    if(unzipAssetsError) {
        console.error(unzipAssetsError);
        return;
    }

    console.log(`Successfully downloaded assets`);

    const [dependencies, collectDependenciesError] = await swPlugins.collectDependencies();
    if(collectDependenciesError) {
        console.error(collectDependenciesError);
        return;
    }

    const [installDepsResponse, installDepsError] = await swPlugins.installDependencies(dependencies);
    if(installDepsError) {
        console.error(installDepsError);
        return;
    }

    console.log(`Successfully installed dependencies`);

    const [pluginMapping, collectPluginMappingError] = await swPlugins.collectPluginMapping();
    if(collectPluginMappingError) {
        console.error(collectPluginMappingError);
        return;
    }

    const [removeMappingResponse, removeMappingError] = await swPlugins.removeMapping();
    if(removeMappingError) {
        console.error(removeMappingError);
        return;
    }

    const [setPluginMappingResponse, setPluginMappingError] = await swPlugins.setPluginMapping(pluginMapping);
    if(setPluginMappingError) {
        console.error(setPluginMappingError);
        return;
    }

    console.log(`Successfully generated plugin slot mapping`);
}

init();

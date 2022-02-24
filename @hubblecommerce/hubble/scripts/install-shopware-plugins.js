#!/usr/bin/env node

const path = require('path');
const fse = require('fs-extra');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const helper = require('./helper');
const { install, setPackageManager } = require('lmify');

const projectDir = process.env.INIT_CWD || path.resolve('../../', __dirname);
const pluginsDirName = 'swPlugins';
const pluginsDir = path.join(projectDir, `/${pluginsDirName}`);
const pluginConfigFile = 'pluginConfig.json';

const apiBasePath = process.env.API_BASE_URL;
const authRoute = '/api/oauth/token';
const clientId = process.env.API_CLIENT_ID;
const clientSecret = process.env.API_CLIENT_SECRET;
const dumpBundlesRoute = '/api/_action/pwa/dump-bundles';

const assetsZipPath = [pluginsDir, 'assets.zip'].join('/');
const mappingFileName = 'pluginMapping.json';

async function clearPlugins() {
    try {
        await fse.emptyDir(pluginsDir);
    } catch (e) {
        return e;
    }
}

async function authorize() {
    try {
        const response = await axios.post(apiBasePath + authRoute, {
            "grant_type": "client_credentials",
            "client_id": clientId,
            "client_secret": clientSecret
        });

        return [response.data, null];
    } catch (e) {
        return [null, e];
    }
}

async function dumpBundles(authResponse) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${authResponse.access_token}` }
        };
        const response = await axios.post(apiBasePath + dumpBundlesRoute, {}, config);

        return [response.data.buildArtifact, null];
    } catch (e) {
        console.error(e);
    }
}

async function fetchPluginConfig(path) {
    try {
        const response = await axios.get(apiBasePath + path);
        return [response.data, null];
    } catch (e) {
        return [null, e];
    }
}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

async function createPluginConfig(pluginConfigs) {
    try {
        let obj = {};

        Object.keys(pluginConfigs).forEach((pluginName) => {
            if(Object.keys(pluginConfigs[pluginName].configuration).length > 0) {
                Object.keys(pluginConfigs[pluginName].configuration.config).forEach((configName) => {
                    let parsedObject = {
                        [camelCase(`${pluginName}-${configName}`)]: pluginConfigs[pluginName].configuration.config[configName]
                    };

                    Object.assign(obj, parsedObject);
                });
            }
        });

        await fse.writeJson( path.join(pluginsDirName, `/${pluginConfigFile}`), obj);

        return [pluginConfigFile, null];
    } catch (e) {
        return [null, e];
    }
}

async function downloadAssets(fileUrl) {
    try {
        await fse.ensureDir(pluginsDir);
        await fse.remove(assetsZipPath);
        const response = await helper.downloadFile(fileUrl, assetsZipPath);
        return [response, null];
    } catch (e) {
        return [null, e];
    }
}

async function unzipAssets() {
    try {
        const response = await helper.unzipFile(assetsZipPath, pluginsDir);
        return [response, null];
    } catch (e) {
        return [null, e];
    }
}

async function getDirs(dir) {
    const pluginDirs = [];
    const dirents = await fse.readdir(dir, { withFileTypes: true });

    for(const dirent of dirents) {
        if (dirent.isDirectory()) {
            pluginDirs.push([pluginsDir, dirent.name].join('/'))
        }
    }

    return pluginDirs;
}

async function collectDependencies() {
    try {
        let dependencies = [];
        const pluginDirs = await getDirs(pluginsDir);

        for(const pluginDir of pluginDirs) {
            const packageJson = await fse.readJson([pluginDir, 'package.json'].join('/'))

            if(packageJson) {
                for (const dep in packageJson.dependencies) {
                    dependencies.push(dep + "@" + packageJson.dependencies[dep]);
                }
            }
        }

        return [dependencies, null];
    } catch (e) {
        return [null, e];
    }
}

async function installDependencies(deps) {
    try {
        setPackageManager('npm');

        for(const dep of deps) {
            await install(dep);
        }

        return [true, null];
    } catch (e) {
        return [null, e];
    }
}

async function collectPluginMapping() {
    try {
        let mapping = [];
        const pluginDirs = await getDirs(pluginsDir);

        for(const pluginDir of pluginDirs) {
            const pluginMappingJson = await fse.readJson([pluginDir, mappingFileName].join('/'))

            if(pluginMappingJson) {
                if(!pluginMappingJson.hasOwnProperty('pluginSlots')) {
                    throw `${mappingFileName} of ${pluginDir} has wrong format`;
                }

                pluginMappingJson.pluginSlots.forEach((slot) => {
                    mapping.push(slot);
                });
            }
        }

        return [mapping, null];
    } catch (e) {
        return [null, e];
    }
}

async function setPluginMapping(pluginMapping) {
    try {
        await fse.writeJson([pluginsDir, mappingFileName].join('/'), { pluginSlots: pluginMapping });

        return [true, null];
    } catch (e) {
        return [null, e];
    }
}

async function init() {
    const error = await clearPlugins();
    if(error) {
        console.error(error);
        return;
    }

    const [authResponse, authError] = await authorize();
    if(authError) {
        console.error("Authorization failed, please check if your .env file provides the data API_CLIENT_ID " +
            "and API_CLIENT_SECRET with values from your Shopware created integration " +
            "https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system");
        return;
    }

    const [buildArtifact, buildError] = await dumpBundles(authResponse);
    if(buildError) {
        console.error(buildError);
        return;
    }

    const [pluginConfigs, fetchPluginConfigError] = await fetchPluginConfig(buildArtifact.config);
    if(fetchPluginConfigError) {
        console.error(fetchPluginConfigError);
        return;
    }

    const [pluginConfigFile, createConfigError] = await createPluginConfig(pluginConfigs);
    if(createConfigError) {
        console.error(createConfigError);
        return;
    }

    console.log(`Successfully built config file ${pluginConfigFile}`);

    const [downloadResponse, downloadAssetsError] = await downloadAssets(buildArtifact.asset);
    if(downloadAssetsError) {
        console.error(downloadAssetsError);
        return;
    }

    const [unzipAssetsResponse, unzipAssetsError] = await unzipAssets();
    if(unzipAssetsError) {
        console.error(unzipAssetsError);
        return;
    }

    await fse.remove(assetsZipPath);

    console.log(`Successfully downloaded assets`);

    const [dependencies, collectDependenciesError] = await collectDependencies();
    if(collectDependenciesError) {
        console.error(collectDependenciesError);
        return;
    }

    const [installDepsResponse, installDepsError] = await installDependencies(dependencies);
    if(installDepsError) {
        console.error(installDepsError);
        return;
    }

    console.log(`Successfully installed dependencies`);

    const [pluginMapping, collectPluginMappingError] = await collectPluginMapping();
    if(collectPluginMappingError) {
        console.error(collectPluginMappingError);
        return;
    }

    const [setPluginMappingResponse, setPluginMappingError] = await setPluginMapping(pluginMapping);
    if(setPluginMappingError) {
        console.error(setPluginMappingError);
        return;
    }

    console.log(`Successfully generated plugin slot mapping`);
}

init();

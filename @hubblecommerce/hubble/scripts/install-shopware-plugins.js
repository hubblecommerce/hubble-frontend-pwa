#!/usr/bin/env node

const path = require('path');
const fse = require('fs-extra');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const projectDir = process.env.INIT_CWD || path.resolve('../../', __dirname);
const pluginsDirName = 'swPlugins';
const pluginsDir = path.join(projectDir, `/${pluginsDirName}`);
const pluginConfigFile = 'pluginConfig.json';

const apiBasePath = process.env.API_BASE_URL;
const authRoute = '/api/oauth/token';
const clientId = process.env.API_CLIENT_ID;
const clientSecret = process.env.API_CLIENT_SECRET;
const dumpBundlesRoute = '/api/_action/pwa/dump-bundles';

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

async function init() {
    const error = await clearPlugins();
    if(error) {
        console.error(error);
        return;
    }

    const [authResponse, authError] = await authorize();
    if(authError) {
        console.error("Authorization failed, please check if your .env file provides the data API_CLIENT_ID and API_CLIENT_SECRET with values from your Shopware created integration https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system");
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
}

init();

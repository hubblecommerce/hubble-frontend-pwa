const axios = require('axios');
const unzipper = require('unzipper');
const path = require('path');
const fse = require('fs-extra');
const dotenv = require('dotenv');
dotenv.config();
const { install, setPackageManager } = require('lmify');

const projectDir = process.env.INIT_CWD || path.resolve('../../', __dirname);
const pluginsDirName = 'swPlugins';
const pluginsDir = path.join(projectDir, `/${pluginsDirName}`);
const pluginConfigFile = 'pluginConfig.json';

const apiBasePath = process.env.API_BASE_URL;
const authRoute = '/api/oauth/token';
const authErrorMsg = "Authorization failed, please check if your .env file provides the data API_CLIENT_ID " +
    "and API_CLIENT_SECRET with values from your Shopware created integration " +
    "https://docs.shopware.com/en/shopware-6-en/settings/system/integrationen?category=shopware-6-en/settings/system";
const clientId = process.env.API_CLIENT_ID;
const clientSecret = process.env.API_CLIENT_SECRET;
const dumpBundlesRoute = '/api/_action/pwa/dump-bundles';

const assetsZipPath = [pluginsDir, 'assets.zip'].join('/');
const mappingFileName = 'pluginMapping.json';

function downloadFile(fileUrl, outputLocationPath) {
    const writer = fse.createWriteStream(outputLocationPath);

    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(true);
                }
                // no need to call the reject here, as it will have been called in the 'error' stream;
            });
        });
    });
}

function unzipFile(inputLocationPath, outputLocationPath) {
    return new Promise((resolve, reject) => {
        let error = null;
        fse.createReadStream(inputLocationPath).pipe(unzipper.Extract({ path: outputLocationPath }))
            .on('close', () => {
                if (!error) {
                    resolve(true);
                }
            })
            .on('error', err => {
                error = err;
                reject(err);
            });
    });
}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

function capitalizeFirstLetter(string) {
    return string.replace(/^\w/, (c) => c.toUpperCase());
}

async function clearPlugins() {
    try {
        await fse.emptyDir(pluginsDir);
    } catch (e) {
        return e;
    }
}

async function ensurePluginsDir() {
    try {
        await fse.ensureDir(pluginsDir);
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

async function removeConfigFile() {
    try {
        await fse.remove(path.join(pluginsDirName, `/${pluginConfigFile}`));
        return [true, null];
    } catch (e) {
        return [null, e];
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

async function createPluginConfig(pluginConfigs) {
    try {
        let obj = {};

        Object.keys(pluginConfigs).forEach((pluginName) => {
            if(Object.keys(pluginConfigs[pluginName].configuration).length > 0) {
                Object.keys(pluginConfigs[pluginName].configuration).forEach((config) => {
                    Object.keys(pluginConfigs[pluginName].configuration[config]).forEach((configName) => {
                        // Skip secret and private keys by name to prevent to expose them to frontend
                        if (configName.toLowerCase().indexOf('secret') === -1 && configName.toLowerCase().indexOf('private') === -1) {
                            let parsedObject = {
                                [camelCase(pluginName) + capitalizeFirstLetter(configName)]: pluginConfigs[pluginName].configuration[config][configName]
                            };

                            Object.assign(obj, parsedObject);
                        }
                    });
                });
            }
        });

        await fse.writeJson(path.join(pluginsDirName, `/${pluginConfigFile}`), obj);

        return [pluginConfigFile, null];
    } catch (e) {
        return [null, e];
    }
}

async function downloadAssets(fileUrl) {
    try {
        await fse.ensureDir(pluginsDir);
        await fse.remove(assetsZipPath);
        const response = await downloadFile(fileUrl, assetsZipPath);
        return [response, null];
    } catch (e) {
        return [null, e];
    }
}

async function removePluginDirs() {
    try {
        const pluginDirs = await getDirs(pluginsDir);

        for(const pluginDir of pluginDirs) {
            await fse.remove(pluginDir);
        }

        return [true, null];
    } catch (e) {
        return [null, e];
    }
}

async function unzipAssets() {
    try {
        const response = await unzipFile(assetsZipPath, pluginsDir);
        await fse.remove(assetsZipPath);
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
            const packageJsonPath = [pluginDir, 'package.json'].join('/');
            const packageJsonExists = await fse.pathExists(packageJsonPath);

            if(packageJsonExists) {
                const packageJson = await fse.readJson(packageJsonPath);

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

async function removeMapping() {
    try {
        await fse.remove([pluginsDir, mappingFileName].join('/'));

        return [true, null];
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

exports.downloadFile = downloadFile;
exports.unzipFile = unzipFile;
exports.camelCase = camelCase;
exports.clearPlugins = clearPlugins;
exports.ensurePluginsDir = ensurePluginsDir;
exports.authorize = authorize;
exports.authErrorMsg = authErrorMsg;
exports.dumpBundles = dumpBundles;
exports.removeConfigFile = removeConfigFile;
exports.fetchPluginConfig = fetchPluginConfig;
exports.createPluginConfig = createPluginConfig;
exports.downloadAssets = downloadAssets;
exports.removePluginDirs = removePluginDirs;
exports.unzipAssets = unzipAssets;
exports.getDirs = getDirs;
exports.collectDependencies = collectDependencies;
exports.installDependencies = installDependencies;
exports.collectPluginMapping = collectPluginMapping;
exports.removeMapping = removeMapping;
exports.setPluginMapping = setPluginMapping;

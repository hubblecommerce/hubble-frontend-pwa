import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
const globby = require('globby');


const possibleApiTypes = ['sw', 'api'];

const notSelectedPossibleApiTypes = possibleApiTypes.filter((possibleApiType) => possibleApiType !== process.env.API_TYPE);

const directoriesToExclude = notSelectedPossibleApiTypes.map((__notSelectedPossibleApiType) => `!**/${__notSelectedPossibleApiType}`)

export const getAllPlugins = pluginDirectory => globby([`${pluginDirectory}/**/*.js`, ...directoriesToExclude]); // register only js files - non-js files should be ignored

export const defaultEnv = {
    config: {
        APP_BASE_URL: process.env.NODE_ENV === 'production' ? process.env.APP_BASE_URL : 'http://localhost/',
        IMG_BASE_URL: process.env.IMG_BASE_URL,
    },
    limiter_default: '10', // Only these limits are allowed in SW6: 1, 5, 9, 10, 25, 50, 75, 100, 500
    limiter: [
        {
            limit: '10',
            label: '10',
        },
        {
            limit: '25',
            label: '25',
        },
        {
            limit: '50',
            label: '50',
        },
        {
            limit: '500',
            label: 'all',
        },
    ],
    sorter: [
        {
            order: 'price',
            label: 'price_asc',
            direction: 'asc',
            selected: true,
            option_id: 0,
        },
        {
            order: 'price',
            label: 'price_desc',
            direction: 'desc',
            selected: false,
            option_id: 1,
        },
        {
            order: 'name',
            label: 'name_asc',
            direction: 'asc',
            selected: false,
            option_id: 2,
        },
        {
            order: 'name',
            label: 'name_desc',
            direction: 'desc',
            selected: false,
            option_id: 3,
        },
    ],
    meta: {
        category: {
            title: 'Category - Hubble Demo',
            titleAdd: ' - buy now at hubble Demostore',
            metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
            metaDescription: 'Official hubble demo page.',
        },
        product: {
            title: 'Product Hubble Demo',
            metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
            metaDescription: 'Official hubble demo page.',
        },
        cms: {
            title: 'CMS - Hubble Demo',
            metaKeywords: 'PWA, ecommerce, hubble, headless, nuxt, vue, responsive, progressive',
            metaDescription: 'Official hubble demo page.',
        },
    },
}

export const defaultDotEnv = {
    only: [
        'APP_BASE_URL',
        'IMG_BASE_URL',
        'API_TYPE',
        'API_SW_ACCESS_KEY',
        'API_BASE_URL',
        'API_BASE_URL',
        'API_CLIENT_ID',
        'API_CLIENT_SECRET',
        'API_ENDPOINT_AUTH',
        'API_PAYMENT_BASE_URL',
        'API_PAYMENT_CLIENT_ID',
        'API_PAYMENT_CLIENT_SECRET',
        'API_PAYMENT_ENDPOINT_AUTH',
        'PAYONE_MODE',
        'PAYONE_MID',
        'PAYONE_AID',
        'PAYONE_PORTALID',
        'AMAZON_PAY_SANDBOX',
        'AMAZON_PAY_MERCHANT_ID',
        'AMAZON_PAY_ACCESS_KEY',
        'AMAZON_PAY_CURRENCY',
        'LOGIN_WITH_AMAZON_CLIENT_ID',
        'AMAZON_PAY_MODE',
        'AMAZON_PAY_RETURN_URL',
        'AMAZON_PAY_CANCEL_RETURN_URL',
        'GOOGLE_ANALYTICS_ID',
        'GOOGLE_TAG_MANAGER_ID',
        'GOOGLE_RECAPTCHA_SITEKEY',
        'TRUSTED_SHOPS_ID',
        'ONESIGNAL_TOKEN',
        'CUSTOMER_DOMAIN',
        'THEME',
        'STORE_ID',
        'NO_CORS',
        'DEFAULT_ERROR_PAGE',
        'STREETINFO_INCLUDES_HOUSENO',
        'ALTERNATIVE_SHIPPING_ADDRESS',
    ],
    path: '~/..'
};

export const defaultModulesAndSettings = [
    {
        moduleName: '@hubblecommerce/payone'
    },
    {
        moduleName: '@hubblecommerce/amazon-pay'
    },
    {
        moduleName: '@nuxtjs/axios'
    },
    {
        moduleName: 'nuxt-mq',
        defaultModuleOptions: {
            breakpoints: {
                sm: 768,
                md: 1024,
                lg: Infinity,
            },
            defaultBreakpoint: 'md', // Default breakpoint for SSR
        }
    },
    {
        moduleName: '@nuxtjs/recaptcha',
        topLevelModuleName: 'recaptcha',
        defaultModuleOptions: {
            version: 3,
            siteKey: process.env.GOOGLE_RECAPTCHA_SITEKEY,
            language: 'de',
            hideBadge: true,
        }
    },
    {
        moduleName: 'nuxt-i18n',
        defaultModuleOptions: {
            defaultLocale: 'en',
            detectBrowserLanguage: false,
            locales: [
                {
                    code: 'de',
                    iso: 'de-DE',
                    file: 'de.js',
                },
                {
                    code: 'en',
                    iso: 'en-US',
                    file: 'en.js',
                },
            ],
            langDir: `locales/`,
            lazy: true,
            seo: false
        }
    }
]

const copyPlugins = async (context, plugins) => {
    await Promise.all(plugins.map(async (__plugin) =>  fs.copySync(__plugin, `${context.options.srcDir}/${baseDirectoryInRoot}/${__fileInBaseDirectory}`)))
}


const copyFiles = async (context, filesInBaseDirectory, baseDirectoryInRoot) => {
    await Promise.all(filesInBaseDirectory.map(async (__fileInBaseDirectory) =>  fs.copySync(`${context.options.rootDir}/${baseDirectoryInRoot}/${__fileInBaseDirectory}`, `${context.options.srcDir}/${baseDirectoryInRoot}/${__fileInBaseDirectory}`)))
}

const copyFilesModule =  async (context, filesInBaseDirectory, baseDirectoryInModule) => {
    await Promise.all(filesInBaseDirectory.map(async (__fileInBaseDirectory) => fs.copySync(`${context.options.rootDir}/modules/@hubblecommerce/hubble/core/${baseDirectoryInModule}/${__fileInBaseDirectory}`, `${context.options.srcDir}/${baseDirectoryInModule}/${__fileInBaseDirectory}`)))
}



export default class {
    static emptySrcDirContents (context) {
        return new Promise(async (resolve, reject) => {

            fs.readdir(`${context.options.srcDir}`, { withFileTypes: true }, function (err, baseFiles) {
                const __baseDirectoriesInSrc = baseFiles
                    .filter((_fileInSrc) => _fileInSrc.isDirectory())
                    .map((directory) => directory.name);

                __baseDirectoriesInSrc.forEach((_baseDirectoryInSrc) => {
                    fs.emptyDirSync(`${context.options.srcDir}/${_baseDirectoryInSrc}`);
                })
            })

            resolve();
        });
    }

    static getModuleContent (context, hasApiSpecificSubfolders) {
        return new Promise(async (resolve, reject) => {
            try {
                const filesInModule = await fs.readdir(`${context.options.rootDir}/modules/@hubblecommerce/hubble/core`, {withFileTypes: true})
                const baseDirectoriesInModule = await filesInModule
                    .filter((fileInModule) => fileInModule.isDirectory())
                    .map((directory) => directory.name)

                await Promise.all(baseDirectoriesInModule.map(async (baseDirectoryInModule) => await this.copyFilesFromModules(context, hasApiSpecificSubfolders, baseDirectoryInModule))).then(() => resolve());

            } catch (err) {
                console.log("err occurred in getModuleContent");
                reject(err);
            }

        });
    }



    static getRootContent (context, hasApiSpecificSubfolders) {
        return new Promise(async (resolve, reject) => {
            try {
                const rootFoldersToExclude = ['cypress', 'logs', 'node_modules', '.github', '.hubble', '.git', '.idea', '.nuxt', 'modules', 'plugins'];

                const filesInRoot = await fs.readdir(`${context.options.rootDir}`, { withFileTypes: true })
                const baseDirectoriesInRoot = await filesInRoot
                    .filter((fileInRoot) => fileInRoot.isDirectory())
                    .map((directory) => directory.name)
                    .filter((directory) => !_.includes(rootFoldersToExclude, directory))


                await Promise.all(baseDirectoriesInRoot.map(async (baseDirectoryInRoot) => await this.copyFilesFromRoot(context, hasApiSpecificSubfolders, baseDirectoryInRoot))).then(() => resolve());
            } catch (err) {
                console.log("err occurred in getRootContent");
                reject(err);
            }
        });
    }


    static copyPluginsFromRoot (context, pluginPath) {
        return new Promise(async (resolve, reject) => {
            let _pathSegmentsIntoArray = pluginPath.split(context.options.rootDir) ;

            await fs.copy(pluginPath, `${context.options.srcDir}${_pathSegmentsIntoArray[1]}`).then(() => resolve());
        })
    }


    static getRootPlugins (context) {
        return new Promise(async (resolve, reject) => {
            const plugins = await getAllPlugins(`${context.options.rootDir}/plugins`)

            await Promise.all(plugins.map(async (__plugin) => await this.copyPluginsFromRoot(context, __plugin))).then(() => resolve());
        })

    }


    static registerInitialPlugins (context) {
        return new Promise(async (resolve, reject) => {
                const pluginsInSrc = await getAllPlugins(`${context.options.srcDir}/plugins`)

                pluginsInSrc.forEach((__pluginInSrc) => {
                    // Check if ssr
                    let serverRendering = true;


                    if (__pluginInSrc.indexOf('no_ssr') !== -1) {
                        serverRendering = false;
                    }

                    context.addPlugin({
                        src:  __pluginInSrc,
                        ssr: serverRendering
                    })
                })

                resolve();
            })
    }


    static registerThirdPartyModules (context) {
        return new Promise(async (resolve, reject) => {
            try {
                await context.addModule('localforage-nuxt');
                await context.addModule('cookie-universal-nuxt', true);

                if (process.env.GOOGLE_TAG_MANAGER_ID !== null) {
                    await context.addModule([
                        '@nuxtjs/google-tag-manager',
                        {
                            id: process.env.GOOGLE_TAG_MANAGER_ID,
                            layer: 'dataLayer',
                            pageTracking: true,
                            pageViewEventName: 'hubbleRoute',
                        },
                    ]);
                }

                resolve();
            } catch (err) {
                console.log("an err occurred in registerThirdPartyModules: ", err);
                reject (err);
            }

        })
    }

    static copyFilesFromModules (context, hasApiSpecificSubfolders, baseDirectoryInModule) {
        return new  Promise ( async (resolve, reject) => {
            if (_.includes(hasApiSpecificSubfolders, baseDirectoryInModule)) {
                fs.copySync(`${context.options.rootDir}/modules/@hubblecommerce/hubble/core/${baseDirectoryInModule}/${process.env.API_TYPE}`, `${context.options.srcDir}/${baseDirectoryInModule}`)

                const baseDirectoryContent = await fs.readdir(`${context.options.rootDir}/modules/@hubblecommerce/hubble/core/${baseDirectoryInModule}/`, {withFileTypes: true})

                const filesInBaseDirectory = baseDirectoryContent.filter((fileInBaseDirectory) => !(fileInBaseDirectory.isDirectory())).map((file) => file.name)

                copyFilesModule(context, filesInBaseDirectory, baseDirectoryInModule).then(() => resolve())
            } else {
                // todo: or use async version
                fs.copySync(`${context.options.rootDir}/modules/@hubblecommerce/hubble/core/${baseDirectoryInModule}`, `${context.options.srcDir}/${baseDirectoryInModule}`)
                resolve();
            }
        })
    }



    static copyFilesFromRoot (context, hasApiSpecificSubfolders, baseDirectoryInRoot) {
        return new Promise ( (resolve, reject) => {

                // todo: change to async await syntax
                fs.pathExists(`${context.options.rootDir}/${baseDirectoryInRoot}/${process.env.API_TYPE}`).then((exists) => {
                    if (exists) {
                        fs.copySync(`${context.options.rootDir}/${baseDirectoryInRoot}/${process.env.API_TYPE}`, `${context.options.srcDir}/${baseDirectoryInRoot}`)

                        fs.readdir(`${context.options.rootDir}/${baseDirectoryInRoot}/`, { withFileTypes: true }).then((baseDirectoryContent) => {
                            const filesInBaseDirectory = baseDirectoryContent.filter((fileInBaseDirectory) => !(fileInBaseDirectory.isDirectory())).map((file) => file.name);

                            copyFiles(context, filesInBaseDirectory, baseDirectoryInRoot).then(() => resolve())
                        })
                    } else if (!exists) {
                        fs.readdir(`${context.options.rootDir}/${baseDirectoryInRoot}/`, { withFileTypes: true }).then(async (baseDirectoryContent) => {
                            const directoriesInBaseDirectory = baseDirectoryContent.filter((fileInBaseDirectory) => fileInBaseDirectory.isDirectory()).map((file) => file.name);

                            const hasPossibleApiTypeInPath = notSelectedPossibleApiTypes.filter((__notSelectedPossibleApiType) => _.includes(directoriesInBaseDirectory, `${__notSelectedPossibleApiType}`))

                            if (hasPossibleApiTypeInPath.length === 0) {
                                await fs.copy(`${context.options.rootDir}/${baseDirectoryInRoot}`, `${context.options.srcDir}/${baseDirectoryInRoot}`).then(() => resolve());
                            } else if (hasPossibleApiTypeInPath.length !== 0) {
                                const nonApiSpecificDirectories = directoriesInBaseDirectory.filter((__directoryInBaseDirectory) => !_.includes(notSelectedPossibleApiTypes, __directoryInBaseDirectory));

                                const filesInBaseDirectory = baseDirectoryContent.filter((fileInBaseDirectory) => !(fileInBaseDirectory.isDirectory())).map((file) => file.name);

                                await copyFiles(context, filesInBaseDirectory, baseDirectoryInRoot)

                                await Promise.all(nonApiSpecificDirectories.map(async (nonApiSpecificDirectory) => await fs.copy(`${context.options.rootDir}/${baseDirectoryInRoot}/${nonApiSpecificDirectory}`, `${context.options.srcDir}/${baseDirectoryInRoot}/${nonApiSpecificDirectory}`))).then(() => resolve())
                            }
                        })
                    }
                })
        })
    }
}








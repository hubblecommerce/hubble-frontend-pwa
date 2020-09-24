import {
    defaultDotEnv,
    defaultEnv,
    defaultModules,
    defaultServerMiddleware,
    defaultCss,
    defaultBuildBabelConfig,
    defaultBuildExtractCSSConfig,
    defaultRouterPrefetchLinksConfig } from './core/utils/config';
import defu from 'defu';
const path = require('path');
const chokidar = require('chokidar');
const fse = require('fs-extra');
const globby = require('globby');

const listAllDirs = dir => globby(`${dir}/*`, { onlyDirectories: true });
const getLastSectionOfPath = thePath => thePath.substring(thePath.lastIndexOf('/') + 1);
const asyncCopyNewDirs = async (sourceDirs, targetDir) => {
    await Promise.all(sourceDirs.map(async sourceDir => {
        await fse.copy(sourceDir, path.join(targetDir, path.basename(sourceDir)));
    }));
};
const asyncCopyApiTypeDirs = async (sourceDirs, targetDir, apiType) => {
    await Promise.all(sourceDirs.map(async sourceDir => {
        await fse.copy(path.join(targetDir, sourceDir, apiType), path.join(targetDir, sourceDir));

        const apiSpecificSubfolders = await listAllDirs(path.join(targetDir, sourceDir));
        await Promise.all(apiSpecificSubfolders.map(async (__apiSpecificSubfolder) => await fse.remove(__apiSpecificSubfolder)));
    }));
};
const getPlugins = dir => globby([`${dir}/*.js`]);

const dirBlacklist = ['cypress', 'modules', 'node_modules', 'logs', '.hubble', '.nuxt', '.idea'];
const apiTypeDirs = ['anonymous-middleware', 'middleware', 'plugins', 'store'];
const targetDirName = '.hubble/';

export default async function (moduleOptions) {
    // Set toplevel options of module
    const options = Object.assign({}, this.options.hubble, moduleOptions);

    /*
     * Create module inheritance logic
     */
    this.options.srcDir = targetDirName;

    const baseDir = path.join(this.options.rootDir, '/node_modules/@hubblecommerce/hubble/core');
    const targetDir = path.join(this.options.rootDir, targetDirName);
    const rootDir = path.join(this.options.rootDir);

    // Get filtered list of root dirs
    const rootDirs = await listAllDirs(rootDir);
    let newDirs = [];
    rootDirs.forEach(dir => {
        if(!dirBlacklist.includes(getLastSectionOfPath(dir))) {
            newDirs.push(dir);
        }
    });

    // 1. Clear target dir
    await fse.emptyDir(targetDir);

    // 2. Copy dirs from core module (base) to nuxt source dir
    await fse.copy(baseDir, targetDir);

    // 3. Copy dirs from nuxt except of blacklisted dirs to nuxt source dir
    await asyncCopyNewDirs(newDirs, targetDir);

    // Resolve api type specific dirs inside nuxt source dir
    await asyncCopyApiTypeDirs(apiTypeDirs, targetDir, options.apiType);

    // Set aliases, to make them work in target dir
    const baseAliases = {
        '~~': rootDir,
        '@@': rootDir,

        '~': targetDir,
        '@': targetDir,

        assets: path.join(targetDir, 'assets'),
        static: path.join(targetDir, 'static'),
    }
    this.options.alias = { ...this.options.aliases, ...baseAliases };

    /*
    * Set default configs for nuxt from module
    * Override default if isset in nuxt.config.js
    * Override > Merging to let the user REMOVE things if necessary
    */
    // Merge objects
    this.options.env = defu(this.options.env, defaultEnv);

    // Use default serverMiddleware if nuxt.config.js serverMiddleware node is empty
    this.options.serverMiddleware = this.options.serverMiddleware.length > 0 ? this.options.serverMiddleware : defaultServerMiddleware(targetDir);

    // Use default css paths if nuxt.config.js css node is empty
    this.options.css = this.options.css.length > 0 ? this.options.css : defaultCss;

    this.options.router.prefetchLinks = defaultRouterPrefetchLinksConfig;

    this.options.build.babel.plugins = this.options.build.babel.hasOwnProperty('plugins') ? this.options.build.babel.plugins : defaultBuildBabelConfig.plugins;
    this.options.build.babel.presets = this.options.build.babel.hasOwnProperty('presets') ? this.options.build.babel.presets : defaultBuildBabelConfig.presets;
    this.options.build.extractCSS = defaultBuildExtractCSSConfig;
    this.options.build.transpile = this.options.build.transpile.length > 0 ? this.options.build.transpile : ['@hubblecommerce/hubble', 'vee-validate/dist/rules'];

    // Remove preload links to reduce time to first meaningful paint
    // https://cmty.app/nuxt/nuxt.js/issues/c6837
    this.nuxt.hook("render:before", (ctx, options) => {
        ctx.nuxt.options.render.bundleRenderer.shouldPreload = () => {
            return false;
        }
    });

    /*
     * Register nuxt.js modules
     * TODO: https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config/
     */
    this.requireModule(['@nuxtjs/dotenv', defu(this.options.dotenv, defaultDotEnv)]);

    // Override module options
    defaultModules.forEach((defaultModule) => {
        const name = defaultModule.name;
        const topLevelName = defaultModule.topLevelName;
        let options = defaultModule.hasOwnProperty('options') ? defaultModule.options : null;

        // Override options of module node in nuxt.config.js
        this.options.modules.forEach(module => {
            if(Array.isArray(module) && module[0] === name) {
                const moduleOptions = module[module.length - 1];

                if(typeof moduleOptions === 'object' ) {
                    options = moduleOptions;
                }
            }
        });

        // Override toplevel options of module in nuxt.config.js
        if(this.options.hasOwnProperty(topLevelName)) {
            options = this.options[topLevelName];
        }

        // Register module
        if(options === null) {
            this.requireModule([name]);
        } else {
            this.requireModule([name, options]);
        }
    });

    if(options.gtmId !== null) {
        this.addModule(['@nuxtjs/google-tag-manager', {
            id: options.gtmId,
            layer: 'dataLayer',
            pageTracking: true,
            pageViewEventName: 'hubbleRoute'
        }]);
    }

    /*
     * Register plugins from module
     */
    const modulePlugins = await getPlugins(path.resolve(targetDir, 'plugins'));
    modulePlugins.forEach((modulePlugin) => {
        // Check if ssr
        let serverRendering = true;

        if (modulePlugin.indexOf('no_ssr') !== -1) {
            serverRendering = false;
        }

        this.options.plugins.push({
            src: modulePlugin,
            ssr: serverRendering
        });
    });

    const toTargetPath = (oldPath) => path.resolve(oldPath.replace(rootDir, targetDir));

    const excludedDirectories = [...dirBlacklist.map((__blacklistedDir) => `${rootDir}/${__blacklistedDir}/**`)];

    chokidar.watch(`${rootDir}`, { ignoreInitial: true, ignored: excludedDirectories })
        .on('all', async (event, filePath) => {
            let newDestination = toTargetPath(filePath);

            const hasApiSpecificSubfolders = apiTypeDirs.filter((__apiTypeDir) => filePath.includes(__apiTypeDir));
            if (hasApiSpecificSubfolders.length !== 0) {
                if (filePath.includes(`/${process.env.API_TYPE}/`)) {
                    newDestination = toTargetPath(filePath.replace(`/${process.env.API_TYPE}/`, '/'));
                } else {
                    return;
                }
            }

            if (event === 'add' || event === 'change') {
                await fse.copy(filePath, newDestination);
            }

            if (event === 'unlink') {
                const modulePath = filePath.replace(rootDir, baseDir);

                fse.pathExists(modulePath, async (err, exists) => {
                    if (exists) {
                        // copy from module
                        await fse.copy(modulePath, newDestination);
                    } else if (!exists) {
                        // path does not exist in module just remove from srcDir
                        await fse.remove(newDestination);
                    } else if (err) {
                        console.log("err occurred: ", err);
                    }
                });
            }
        });
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

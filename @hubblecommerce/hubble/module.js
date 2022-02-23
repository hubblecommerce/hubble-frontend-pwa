const path = require('path');
const chokidar = require('chokidar');
const fse = require('fs-extra');
const globby = require('globby');
import defu from 'defu';

import {defaultPublicRuntimeConfig, defaultPrivateRuntimeConfig, defaultModules} from './core/utils/config';

const listAllDirs = (dir) => globby(`${dir}/*`, { onlyDirectories: true });
const getLastSectionOfPath = (thePath) => thePath.substring(thePath.lastIndexOf('/') + 1);
const asyncCopyNewDirs = async (sourceDirs, targetDir) => {
    await Promise.all(
        sourceDirs.map(async (sourceDir) => {
            await fse.copy(sourceDir, path.join(targetDir, path.basename(sourceDir)));
        })
    );
};
const getPlugins = (dir) => globby([`${dir}/*.js`]);

const dirBlacklist = ['node_modules', '.hubble', '.nuxt', '.idea'];
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
    rootDirs.forEach((dir) => {
        if (!dirBlacklist.includes(getLastSectionOfPath(dir))) {
            newDirs.push(dir);
        }
    });

    // 1. Clear target dir
    await fse.emptyDir(targetDir);

    // 2. Copy dirs from core module (base) to nuxt source dir
    await fse.copy(baseDir, targetDir);

    // 3. Copy dirs from nuxt except of blacklisted dirs to nuxt source dir
    await asyncCopyNewDirs(newDirs, targetDir);

    // Set aliases, to make them work in target dir
    const baseAliases = {
        '~~': rootDir,
        '@@': rootDir,

        '~': targetDir,
        '@': targetDir,

        'assets': path.join(targetDir, 'assets'),
        'static': path.join(targetDir, 'static'),
    };
    this.options.alias = { ...this.options.aliases, ...baseAliases };

    if (this.options.build.transpile.length === 0) {
        this.options.build.transpile = ['@hubblecommerce/hubble'];
    }

    // Merge default configs with configs set in nuxt.config.js
    this.options.publicRuntimeConfig = defu(this.options.publicRuntimeConfig, defaultPublicRuntimeConfig);
    this.options.privateRuntimeConfig = defu(this.options.privateRuntimeConfig, defaultPrivateRuntimeConfig);

    // Handle shopware plugin configurations
    const swPluginsDir = 'swPlugins';
    const swPluginsConfigFile = 'pluginConfig.json';
    const swPluginsConfigPath = [rootDir,swPluginsDir,swPluginsConfigFile].join('/');
    const swPluginsConfigExists = await fse.pathExists(swPluginsConfigPath);

    if(swPluginsConfigExists) {
        const swPluginConfigs = await fse.readJson(swPluginsConfigPath);
        this.options.publicRuntimeConfig = defu(this.options.publicRuntimeConfig, swPluginConfigs);
    }

    // https://nuxtjs.org/docs/2.x/directory-structure/components
    this.nuxt.hook('components:dirs', (dirs) => {
        dirs.push({
            path: path.resolve('.hubble/components/'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/cart'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/category'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/checkout'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/customer'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/detail'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/form'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/layout'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/navigation'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/search'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/swComponents'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/transitions'),
        });
        dirs.push({
            path: path.resolve('.hubble/components/utils'),
        });
    });

    // Override module options
    defaultModules.forEach((defaultModule) => {
        const name = defaultModule.name;
        const topLevelName = defaultModule.topLevelName;
        let options = defaultModule.hasOwnProperty('options') ? defaultModule.options : null;

        // Override options of module node in nuxt.config.js
        this.options.modules.forEach((module) => {
            if (Array.isArray(module) && module[0] === name) {
                const moduleOptions = module[module.length - 1];

                if (typeof moduleOptions === 'object') {
                    options = moduleOptions;
                }
            }
        });

        // Override toplevel options of module in nuxt.config.js
        if (this.options.hasOwnProperty(topLevelName)) {
            options = this.options[topLevelName];
        }

        // Register module
        if (options === null) {
            this.requireModule([name]);
        } else {
            this.requireModule([name, options]);
        }
    });

    /*
     * Register plugins from module
     */
    const modulePlugins = await getPlugins(path.resolve(targetDir, 'plugins'));
    modulePlugins.forEach((modulePlugin) => {
        this.options.plugins.push({
            src: modulePlugin,
        });
    });

    /*
     * File watcher for dev purposes
     */
    if (this.options.dev || this.options._start) {
        const toTargetPath = (oldPath) => path.resolve(oldPath.replace(rootDir, targetDir));

        const excludedDirectories = [...dirBlacklist.map((__blacklistedDir) => `${rootDir}/${__blacklistedDir}/**`)];

        chokidar.watch(`${rootDir}`, { ignoreInitial: true, ignored: excludedDirectories }).on('all', async (event, filePath) => {
            let newDestination = '';

            // Build file destination for local modules mode (Contribution Setup)
            if (filePath.includes('/modules/')) {
                let moduleCoreDir = filePath.match(/@hubblecommerce\/hubble\/core\//);

                if (moduleCoreDir != null) {
                    let relativePath = filePath.substr(moduleCoreDir[0].length + moduleCoreDir.index);

                    newDestination = path.join(targetDir, relativePath);
                }
            } else {
                newDestination = toTargetPath(filePath);
            }

            if (newDestination === '') {
                return;
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
                        console.log('err occurred: ', err);
                    }
                });
            }
        });
    }
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

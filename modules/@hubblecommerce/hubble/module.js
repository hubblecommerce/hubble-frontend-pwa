import { getAllPlugins } from "./core/utils/helper";

const path = require('path')
const chokidar = require('chokidar');
const fse = require('fs-extra');
const globby = require('globby');

const listAllDirs = dir => globby(`${dir}/*`, { onlyDirectories: true });
const getLastSectionOfPath = thePath => thePath.substring(thePath.lastIndexOf('/') + 1);
const asyncCopyNewDirs = async (sourceDirs, targetDir) => {
    await Promise.all(sourceDirs.map(async sourceDir => {
        await fse.copy(sourceDir, path.join(targetDir, path.basename(sourceDir)));
    }))
}
const asyncCopyApiTypeDirs = async (sourceDirs, targetDir, apiType) => {
    await Promise.all(sourceDirs.map(async sourceDir => {
        await fse.copy(path.join(targetDir, sourceDir, apiType), path.join(targetDir, sourceDir));
    }))
}

const dirBlacklist = ['cypress', 'modules', 'node_modules'];
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
     * Register nuxt.js modules
     */
    this.addModule('localforage-nuxt');
    this.addModule('cookie-universal-nuxt', true);

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
    const modulePlugins = await getAllPlugins(path.resolve(baseDir, 'plugins'))
    modulePlugins.forEach((modulePlugin) => {
        // Check if ssr
        let serverRendering = true;

        if (modulePlugin.indexOf('no_ssr') !== -1) {
            serverRendering = false;
        }

        this.options.plugins.push({
            src: modulePlugin,
            ssr: serverRendering
        })
    })

    //const toTargetPath = (oldPath) => {
    //    let newPath = oldPath
    //        // In case path contains "base" or "target" dirs before the Nuxt dir
    //        .replace(this.options.rootDir, '')
    //        .replace('/base/', '/target/').replace('/new/', '/target/')
    //    return path.join(this.options.rootDir, newPath)
    //}
    //
    //chokidar.watch([baseDir, newDir]).on('all', async (event, filePath) => {
    //    if (event === 'add' || event === 'change') {
    //        fse.copy(filePath, toTargetPath(filePath))
    //    }
    //    if (event === 'unlink') {
    //        fse.remove(toTargetPath(filePath))
    //    }
    //})
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

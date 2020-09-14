import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import Helper from "./core/utils/helper";

const chokidar = require('chokidar');


const setupProject = async (context) => {
    const hasApiSpecificSubfolders = ['store', 'middleware', 'anonymous-middleware', 'plugins'];
    await Helper.getModuleContent(context, hasApiSpecificSubfolders)
    await Helper.getRootContent(context, hasApiSpecificSubfolders)
    await Helper.getRootPlugins(context)
    await Helper.registerInitialPlugins(context)
    await Helper.registerThirdPartyModules(context)
}

export default async function nuxtHubble(moduleOptions) {

    const context = this;

    await fs.copySync(`${context.options.rootDir}/.env`, `${context.options.srcDir}/.env`);

    const __pathRootDirectory = context.options.rootDir;
    const __pathSrcDirectory = context.options.srcDir;

    const possibleApiTypes = ['sw', 'api'];
    const notSelectedPossibleApiTypes = possibleApiTypes.filter((possibleApiType) => possibleApiType !== process.env.API_TYPE);




    // for chokidar watchers
    context.nuxt.hook('build:done', (nuxt) => {
        const pathOfRootDir = context.options.rootDir;
        const pathOfSrcDir = context.options.srcDir;


        // todo: read out dynamically
        const folders = [`${context.options.rootDir}/layouts`, `${context.options.rootDir}/middleware`, `${context.options.rootDir}/locales`, `${context.options.rootDir}/pages`, `${context.options.rootDir}/store`, `${context.options.rootDir}/assets`, `${context.options.rootDir}/api`, `${context.options.rootDir}/utils`, `${context.options.rootDir}/anonymous-middleware`, `${context.options.rootDir}/plugins`];


        let chokidarWatcher = chokidar.watch(`${context.options.rootDir}/components`, { ignoreInitial: true });
        chokidarWatcher.add(folders);


        chokidarWatcher
            .on('add', path => {
                let _pathSegmentsIntoArray = path.split(pathOfRootDir);

                const hasPossibleApiTypeInPath = possibleApiTypes.filter((__possibleApiType) => _.includes(_pathSegmentsIntoArray[1], `/${__possibleApiType}`))

                if (hasPossibleApiTypeInPath.length !== 0) {
                    if (_.includes(_pathSegmentsIntoArray[1], `/${process.env.API_TYPE}`)) {
                        let startIndexToSliceFrom = _pathSegmentsIntoArray[1].indexOf(`/${process.env.API_TYPE}`)
                        let endIndexToFinishSlice = startIndexToSliceFrom + 3;

                        let pathBeginning = _pathSegmentsIntoArray[1].slice(0, startIndexToSliceFrom);
                        let pathEnding = _pathSegmentsIntoArray[1].slice(endIndexToFinishSlice);


                        let __newPath = `${pathBeginning}${pathEnding}`;


                        fs.copySync(path, `${pathOfSrcDir}${__newPath}`);
                    }
                } else if (hasPossibleApiTypeInPath.length === 0){
                    fs.copySync(path, `${pathOfSrcDir}${_pathSegmentsIntoArray[1]}`);
                }
            })
            .on('addDir', path => {
                let _pathSegmentsIntoArray = path.split(pathOfRootDir) ;

                // todo: swComponents directory
                const hasPossibleApiTypeInPath = possibleApiTypes.filter((__possibleApiType) => _.includes(_pathSegmentsIntoArray[1], `/${__possibleApiType}`))


                if (hasPossibleApiTypeInPath.length === 0) {
                    fs.copySync(path, `${pathOfSrcDir}${_pathSegmentsIntoArray[1]}`);
                }
            })
            .on('unlinkDir', path => {
                let _pathSegmentsIntoArray = path.split(pathOfRootDir);
                let _folderToDeleteFromSrcDir = _pathSegmentsIntoArray[1]; // can be single file or path
                fs.removeSync(`${pathOfSrcDir}${_folderToDeleteFromSrcDir}`);

                // add from module if file exists at that path
                fs.pathExists(`${pathOfRootDir}/modules/@hubblecommerce/hubble/core${_folderToDeleteFromSrcDir}`, (err, exists) => {
                    if (exists) fs.copySync(`${pathOfRootDir}/modules/@hubblecommerce/hubble/core${_folderToDeleteFromSrcDir}`, `${pathOfSrcDir}${_folderToDeleteFromSrcDir}`);
                    else console.log("does not exist or err occurred checking for path existence of ${_fileToDeleteFromSrcDir} in module: ", `${_folderToDeleteFromSrcDir}`);
                })
            })
            .on('unlink', path => {
                let _pathSegmentsIntoArray = path.split(pathOfRootDir);
                let _fileToDeleteFromSrcDir = _pathSegmentsIntoArray[1]; // can be single file or path
                fs.removeSync(`${pathOfSrcDir}${_fileToDeleteFromSrcDir}`);

                // add from module if file exists at that path
                fs.pathExists(`${pathOfRootDir}/modules/@hubblecommerce/hubble/core${_fileToDeleteFromSrcDir}`, (err, exists) => {
                    if (exists) fs.copySync(`${pathOfRootDir}/modules/@hubblecommerce/hubble/core${_fileToDeleteFromSrcDir}`, `${pathOfSrcDir}${_fileToDeleteFromSrcDir}`);
                    else console.log("does not exist or err occurred checking for path existence of ${_fileToDeleteFromSrcDir} in module: ", `${_fileToDeleteFromSrcDir}`);
                })
            })
            .on('change', path => {
                let _pathSegmentsIntoArray = path.split(pathOfRootDir);

                const hasPossibleApiTypeInPath = possibleApiTypes.filter((__possibleApiType) => _.includes(_pathSegmentsIntoArray[1], `/${__possibleApiType}`))

                if (hasPossibleApiTypeInPath.length !== 0) {
                    if (_.includes(_pathSegmentsIntoArray[1], `/${process.env.API_TYPE}`)) {
                        let startIndexToSliceFrom = _pathSegmentsIntoArray[1].indexOf(`/${process.env.API_TYPE}`)
                        let endIndexToFinishSlice = startIndexToSliceFrom + 3;

                        let pathBeginning = _pathSegmentsIntoArray[1].slice(0, startIndexToSliceFrom);
                        let pathEnding = _pathSegmentsIntoArray[1].slice(endIndexToFinishSlice);


                        let __newPath = `${pathBeginning}${pathEnding}`;


                        fs.copySync(path, `${pathOfSrcDir}${__newPath}`);
                    }
                } else if (hasPossibleApiTypeInPath.length === 0){
                    fs.copySync(path, `${pathOfSrcDir}${_pathSegmentsIntoArray[1]}`);
                }
            })
    })


    context.options.store = true;


    const styles = ['~/assets/css/main.css', '~/assets/css/vue-tiny-slider.css', `~/assets/scss/${process.env.THEME}/all.scss`];


    context.options.css.push(...styles);


    await Helper.emptySrcDirContents(context).then(() => setupProject(context));




    // Add middleware to nuxt.config.js
    // this.options.router.middleware.push('hubbleDelay');


    // Add hubble Theme
    if (options.useTheme !== false) {
            this.options.css.push(path.resolve(__dirname, 'core/assets/scss/theme/all.scss'));
     }
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

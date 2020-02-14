import path from 'path'
import fs from 'fs'

export default class {

    static getFilesFromDir(targetDir) {
        // Get all filenames from directory
        let directoryPath = path.join(__dirname, '/..'+targetDir);

        // passing directoryPath and callback function and return as a promise
        return new Promise((resolve, reject) => {
            fs.readdir(directoryPath, function (err, files) {
                //handling error
                if (err) {
                    reject('Unable to scan directory: ' + err);
                }

                // Filer for . to extract directories
                let filesOnly = files.filter((file) => {
                    return file.indexOf(".") !== -1;
                });

                resolve(filesOnly);
            });
        });
    }

    static registerPlugins(context, files, type, blacklist)  {
        return new Promise((resolve, reject) => {
            files.forEach((filename) => {
                // Check if ssr
                let serverRendering = true;

                if(filename.indexOf('no_ssr') !== -1) {
                    serverRendering = false;
                }

                if(blacklist != null) {
                    if(!blacklist.includes(filename)) {
                        context.addPlugin({src: path.resolve(__dirname, '../'+type+'/'+filename), ssr: serverRendering});
                    }
                } else {
                    context.addPlugin({src: path.resolve(__dirname, '../'+type+'/'+filename), ssr: serverRendering});
                }
            });
            resolve();
        });
    }

}

import { resolve, join } from 'path';
import { readdirSync } from 'fs';

export default function nuxtHubble(moduleOptions) {
    // get all options for the module
    const options = {
        ...moduleOptions,
        ...this.options.hubble.payone,
    };

    // expose the namespace / set a default
    if (!options.namespace) {
        options.namespace = 'hubble-payone';
    }
    const { namespace } = options;

    // add hosted iframe callback as plugin
    this.addPlugin({
        src: resolve(__dirname, 'plugins/lib/hosted-iframe.js'),
        fileName: join(namespace, 'plugins/lib/hosted-iframe.js'),
        ssr: false,
        options,
    });

    // add payone response callback
    this.addPlugin({
        src: resolve(__dirname, 'plugins/lib/payone-response.js'),
        fileName: join(namespace, 'plugins/lib/payone-response.js'),
        ssr: false,
        options,
    });

    // add all of the initial plugins
    const pluginsToSync = ['components/index.js', 'plugins/index.js'];

    for (const pathString of pluginsToSync) {
        this.addPlugin({
            src: resolve(__dirname, pathString),
            fileName: join(namespace, pathString),
            options,
        });
    }

    // sync all of the files and folders to relevant places in the nuxt build dir (.nuxt/)
    const foldersToSync = ['plugins/lib', 'components/lib'];
    for (const pathString of foldersToSync) {
        const path = resolve(__dirname, pathString);
        for (const file of readdirSync(path)) {
            this.addTemplate({
                src: resolve(path, file),
                fileName: join(namespace, pathString, file),
                options,
            });
        }
    }

    // add api calls as server middleware
    const serverMiddlewares = ['api/calcHash', 'api/calcHashHostedIFrame'];

    for (const middleWare of serverMiddlewares) {
        const path = resolve(__dirname, middleWare);
        this.options.serverMiddleware.push(path);
    }
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

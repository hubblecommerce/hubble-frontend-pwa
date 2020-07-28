import { resolve, join } from 'path';
import { readdirSync } from 'fs';

export default function nuxtHubble(moduleOptions) {
    // get all options for the module
    const options = {
        ...moduleOptions,
        ...this.options.hubble.amazonPay,
    };

    // expose the namespace / set a default
    if (!options.namespace) {
        options.namespace = 'hubble-amazon-pay';
    }
    const { namespace } = options;

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
    const serverMiddlewares = [
        'api/amazon-calc-signature-auth-and-capture',
        'api/amazon-get-order-reference-details',
        'api/amazon-set-order-reference-details',
        'api/amazon-confirm-order-reference',
        'api/amazon-auth-and-capture',
    ];

    for (const middleWare of serverMiddlewares) {
        const path = resolve(__dirname, middleWare);
        this.options.serverMiddleware.push(path);
    }
}

// avoid registering the same module twice
module.exports.meta = require('./package.json');

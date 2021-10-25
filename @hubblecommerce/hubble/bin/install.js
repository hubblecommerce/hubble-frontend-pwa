#!/usr/bin/env node

const {execSync} = require('child_process');
const fs = require('fs').promises;
const readline = require('readline');
const process = require('process');

const runCommand = async command => {
    try {
        execSync(`${command}`);
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }

    return true;
};

const updateFile = async (filename, replacements) => {
    try {
        let data = await fs.readFile(filename, 'utf-8');

        // replace if doesn't already exists
        if(data.indexOf(replacements[0].replacer) === -1) {
            data = data.replace(replacements[0].needle, replacements[0].replacer);
        }

        await fs.writeFile(filename, data, 'utf-8');
    } catch (e) {
        console.log(e);
    }
};

(async () => {
    /*
     *
     * Install nuxt.js via npx create-nuxt-app and predefined answers
     * https://github.com/nuxt/create-nuxt-app/issues/444
     *
     */

    const appName = process.argv[2];
    if(!appName) {
        console.log('Please provide an app name like: npx @hubblecommerce/hubble <project-name>');
        process.exit(-1);
    }

    const createProjectDir = `mkdir ${appName}`;
    const projectDirCreated = await runCommand(createProjectDir);
    if(!projectDirCreated) process.exit(-1);

    // Change the directory
    try {
        process.chdir(appName);
    } catch (err) {
        console.error("error occurred while "
            + "changing directory: " + err);
    }

    console.log('Installing nuxt.js');

    const installNuxtCommand = `npx create-nuxt-app --answers '{"name":"my-app","language":"js","pm":"npm","ui":"none","target":"server","features":[],"linter":[],"test":"none","mode":"universal","devTools":[]}'`;
    const nuxtInstalled = await runCommand(installNuxtCommand);
    if(!nuxtInstalled) process.exit(-1);

    /*
     *
     * Install hubble via npm
     * runs its own postinstall script to move files from module to root dir etc.
     * see scripts/post-install.js for details
     *
     */

    console.log('Installing hubble');

    const installHubbleCommand = 'npm i @hubblecommerce/hubble --save-dev';
    const hubbleInstalled = runCommand(installHubbleCommand);
    if(!hubbleInstalled) process.exit(-1);

    /*
     *
     * Set hubble as module in nuxt.config.js
     *
     */

    const configureNuxtJs = async function() {
        const file = 'nuxt.config.js';
        const newValue = 'buildModules: [\n' +
            '    [\'@hubblecommerce/hubble\']';

        await updateFile(file, [{
            needle: 'buildModules: [',
            replacer: newValue
        }], function (err) {
            console.error(err);
            process.exit(-1);
        });
    };

    await configureNuxtJs();

    /*
     *
     * Remove files set by nuxt-create-app we don't need
     *
     */

    const removeFileIfNotExists = async function(file) {
        try {
            const data = await fs.readFile(file, 'binary');
            fs.unlink(file);

            console.log(`Removed file ${file}`);
        } catch (e) {
            console.log(`File ${file} already removed. Skipping`);
        }
    };

    const removeNuxtDefaultFiles = async function() {
        const paths = [
            'pages/index.vue',
            'layouts/default.vue'
        ];

        for (const file of paths) {
            await removeFileIfNotExists(file);
        }
    };

    await removeNuxtDefaultFiles();

    /*
     *
     * Ask user for API credentials
     * write credentials to .env file
     *
     */

    const setEnvVariables = async function() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        let apiBaseUrl = null;
        let apiAccessKey = null;

        rl.question("Please enter your API url: ", function(url) {
            rl.question("Please enter your API access key: ", function(key) {
                apiBaseUrl = url;
                apiAccessKey = key;
                rl.close();
            });
        });

        rl.on("close", async function() {
            const envFile = '.env';
            const apiUrlVal = 'API_BASE_URL            = \'\'';
            const apiUrlNewVal = `API_BASE_URL            = \'${apiBaseUrl}\'`;
            const apiKeyVal = 'API_SW_ACCESS_KEY       = \'\'';
            const apiKeyNewVal = `API_SW_ACCESS_KEY       = \'${apiAccessKey}\'`;

            await updateFile(envFile, [{
                needle: apiUrlVal,
                replacer: apiUrlNewVal
            }], function (err) {
                console.error(err);
                process.exit(-1);
            });

            await updateFile(envFile, [{
                needle: apiKeyVal,
                replacer: apiKeyNewVal
            }], function (err) {
                console.error(err);
                process.exit(-1);
            });
        });

        for await (const line of rl) {
            return true;
        }
    };

    await setEnvVariables();

    console.log("hubble PWA was installed successfully. \n You can start your app via: \n npm run dev");
})();

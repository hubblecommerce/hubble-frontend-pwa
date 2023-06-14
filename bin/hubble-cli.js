#!/usr/bin/env node

(async () => {
    const args = process.argv.slice(2)

    try {
        if (args[0] === 'dev:sw') {
            const module = await import(`../dist/platforms/shopware/bin/${args[1]}.js`)
            module.default(args)
        } else {
            const module = await import(`./${args[0]}.js`)
            module.default(args)
        }
    } catch (e) {
        console.log(e)
        if (e.code === 'MODULE_NOT_FOUND') {
            // eslint-disable-next-line no-console
            console.log(`Invalid argument: ${args[0]}`)
            // eslint-disable-next-line no-console
            console.log('Please provide one of the scripts inside @hubblecommerce/hubble/bin')
        } else {
            // eslint-disable-next-line no-console
            console.log(e.code)
        }
    }
})()

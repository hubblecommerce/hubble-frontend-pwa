#!/usr/bin/env node

const args = process.argv.slice(2)

try {
    import(`@hubblecommerce/hubble/bin/${args[0]}.js`)
} catch (e) {
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

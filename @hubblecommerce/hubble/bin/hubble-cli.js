#!/usr/bin/env node

const args = process.argv.slice(2);

try {
    require(`@hubblecommerce/hubble/scripts/${args[0]}.js`);
} catch (e) {
    if(e.code === 'MODULE_NOT_FOUND') {
        console.log(`Invalid argument: ${args[0]}`);
        console.log('Please provide one of the scripts inside @hubblecommerce/hubble/scripts');
    } else {
        console.log(e.code);
    }
}

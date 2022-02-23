#!/usr/bin/env node

const args = process.argv.slice(2);

try {
    require(`@hubblecommerce/hubble/scripts/${args[0]}.js`);
} catch (e) {
    console.log(`Invalid argument: ${args[0]}`);
    console.log('Please provide one of the scripts inside @hubblecommerce/hubble/script');
}

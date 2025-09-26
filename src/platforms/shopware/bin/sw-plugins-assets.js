#!/usr/bin/env node

const main = async function () {
     
    console.error('❌ DEPRECATED: Automatic plugin asset installation has been removed')
     
    console.error('')
     
    console.error('📖 MANUAL SETUP REQUIRED:')
     
    console.error('   1. Create plugin layers manually in layers/plugin-name/')
     
    console.error('   2. Add plugin components, pages, etc. to the layer directory')
     
    console.error('   3. Create nuxt.config.ts in each plugin layer if needed')
     
    console.error('   4. Use "npm run sw:config-plugins" for plugin configuration')
     
    console.error('')
     
    console.error('📚 Reason: SwagShopwarePwa plugin is deprecated and asset download')
     
    console.error('   functionality was rarely used. Manual setup provides better control.')

    process.exit(1)
}

export default main

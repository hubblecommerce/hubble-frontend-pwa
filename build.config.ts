import { defineBuildConfig } from 'unbuild'
import copy from 'rollup-plugin-copy'

export default defineBuildConfig({
    hooks: {
        'rollup:options': (ctx, options) => {
            // @ts-ignore
            options.plugins.push(
                copy({
                    targets: [
                        {
                            src: ['./src/layer/'],
                            dest: './dist'
                        }
                    ]
                })
            )
        }
    },
    rollup: {
        cjsBridge: true
    },
    entries: [
        // Module
        './src/module',
        // Shopware
        {
            input: './src/platforms/shopware/api-client/',
            outDir: './dist/platforms/shopware/api-client',
            declaration: true
        },
        {
            input: './src/platforms/shopware/bin/',
            outDir: './dist/platforms/shopware/bin',
            declaration: false,
            ext: 'js'
        }
    ],
    externals: [
        'chokidar',
        'fs-extra',
        'defu'
    ]
})

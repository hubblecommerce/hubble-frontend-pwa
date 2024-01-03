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
                            src: ['./src/theme/', './src/commons/'],
                            dest: './dist'
                        },
                        {
                            src: ['./src/platforms/shopware/composables/', './src/platforms/shopware/utils/'],
                            dest: './dist/platforms/shopware'
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
        },
        {
            builder: 'mkdist',
            input: './src/platforms/shopware/config/',
            outDir: './dist/platforms/shopware/config'
        }
    ],
    externals: [
        'chokidar',
        'fs-extra',
        'defu'
    ]
})

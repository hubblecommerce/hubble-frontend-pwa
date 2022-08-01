import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    declaration: false,
    rollup: { cjsBridge: true },
    entries: [
        './src/module',
        { input: 'src/runtime/commons/', outDir: 'dist/runtime/commons', declaration: true },
        { input: 'src/runtime/platforms/shopware/api-client/generated/', outDir: 'dist/runtime/platforms/shopware/api-client/generated', declaration: true },
        { input: 'src/runtime/src/public/', outDir: 'dist/runtime/src/public', ext: 'js' }
    ]
})

import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    declaration: false,
    rollup: { cjsBridge: true },
    entries: [
        './src/module',
        { input: 'src/runtime/', outDir: 'dist/runtime' },
        { input: 'src/runtime/src/public/', outDir: 'dist/runtime/src/public', ext: 'js' }
    ]
})

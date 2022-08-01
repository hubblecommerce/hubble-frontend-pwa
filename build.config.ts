import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    declaration: false,
    rollup: { cjsBridge: true },
    entries: [
        './src/module',
        { input: 'src/commons/', outDir: 'dist/commons', declaration: true },
        { input: 'src/platforms/', outDir: 'dist/platforms' },
        { input: 'src/src/', outDir: 'dist/src' }
    ]
})

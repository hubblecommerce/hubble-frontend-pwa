import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import daisyui from 'daisyui'

const runtimeDir = fileURLToPath(new URL('./', import.meta.url))

module.exports = {
    plugins: [
        daisyui
    ],
    content: [
        join(runtimeDir, 'components/**/*.{vue,js}'),
        join(runtimeDir, 'layouts/**/*.vue'),
        join(runtimeDir, 'pages/**/*.vue'),
        join(runtimeDir, 'composables/**/*.{js,ts}'),
        join(runtimeDir, 'plugins/**/*.{js,ts}'),
        join(runtimeDir, 'App.{js,ts,vue}'),
        join(runtimeDir, 'app.{js,ts,vue}')
    ]
}

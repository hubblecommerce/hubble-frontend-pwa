// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
    features: {
        tooling: true,
        stylistic: false,
    },
    dirs: {
        src: [
            './src',
            './playground',
        ],
    }
}).append({
    ignores: [
        'dist',
        'node_modules',
        '__tests__',
        'src/platforms/shopware/api-client/generated'
    ],
}).override('nuxt/rules', {
    rules: {
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'never'
        ],
        'indent': [
            'error',
            4
        ],
        'vue/html-indent': [
            'error',
            4
        ],
        'no-multi-spaces': [
            'error'
        ],
        '@typescript-eslint/no-unused-vars': [
            'off'
        ],
        'vue/multi-word-component-names': [
            'off'
        ],
        'no-trailing-spaces': [
            'off'
        ],
        '@typescript-eslint/ban-ts-comment': [
            'off'
        ],
        'vue/no-multiple-template-root': [
            'off'
        ],
        'no-useless-return': [
            'off'
        ],
        '@typescript-eslint/no-explicit-any': [
            'off'
        ],
        'vue/padding-line-between-blocks': [
            'off'
        ],
        '@typescript-eslint/no-import-type-side-effects': [
            'off'
        ],
        'no-console': [
            'error',
            {
                'allow': ['warn', 'error']
            }
        ],
        '@typescript-eslint/no-invalid-void-type': [
            'off'
        ]
    }
})

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  // @nuxtjs not used, because it extends eslint/standard
  // prettier disabled for now
  extends: [
    'eslint:recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    //'prettier',
    //'prettier/vue',
    //'plugin:prettier/recommended',
  ],
  // required to lint *.vue files
  plugins: [
    'prettier',
    'vue'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',
    "vue/multiline-html-element-content-newline": 'off',
    "vue/singleline-html-element-content-newline" : 'off',
    "vue/no-v-html" : 'off',
  },
  globals: {
    '_': true
  }
}

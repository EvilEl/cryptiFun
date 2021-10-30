module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  "parser": "vue-eslint-parser",
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier',
    'eslint:recommended',
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'eqeqeq': 1,
    'curly': 1,
    'quotes': 1,
    "no-unused-vars": "warn",
    "no-undef": "warn",
    'prefer-const': 1,
  }
}

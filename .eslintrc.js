module.exports = {
  root: true,
  extends: 'eslint:recommended',
  env: {
    browser: true,
    commonjs: true,
    node: true,
  },
  rules: {
    semi: ['error', 'always']
  },
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeature: {
      experimentalObjectRestSpread: true
    },
    sourceType: 'module'
  }
}
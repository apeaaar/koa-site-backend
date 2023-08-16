module.exports = {
  env: {
    commonjs: true,
    es2021: true
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': [0, 'unix'],
    quotes: ['error', 'single']
  }
}

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['@typescript-eslint'],
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-var': 2, // require let or const instead of var
    'prefer-arrow-callback': 2, // suggest using arrow functions as callbacks
    'prefer-const': 2, // suggest using const declaration for variables that are never modified after declared
    'prefer-rest-params': 2, // suggest using the rest parameters instead of arguments
    'prefer-spread': 2, // suggest using the spread operator instead of .apply().
    'prefer-template': 2, // suggest using template literals instead of strings concatenation
  },
};

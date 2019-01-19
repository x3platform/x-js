// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // 全局定义配置
  'globals': {
    'esri': false
  },
  // add your custom rules here
  'rules': {
     // 分号结尾
    "semi": ["error", "always"],
    // 函数前空格
    'space-before-function-paren': 0,
    // 括号样式
    'brace-style': 0,
    // 未使用的变量
    'no-unused-vars': 1,
    // 空白的注释
    'spaced-comment': 0,
    // === 代替 ==
    'eqeqeq': 0,
   // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

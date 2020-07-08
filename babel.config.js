
// 项目发布阶段需要用到的 babel 插件
const production = []
if (process.env.NODE_ENV === 'production') {
  production.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 只在产品发布阶段使用的去除打印插件
    ...production,
    // 路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}

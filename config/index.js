// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var config = {
  build: {  // 上线打包
    env: require('./prod.env'),
    port: 3000,
    // baseServerUrl: 'c.fwone.com/PT', // 上线地址
    baseServerUrl: '/PT', // 线上测试
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'statics/pc',
    assetsPublicPath: '/PT/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  pre: {  // 测试打包
    env: require('./pre.env'),
    port: 3000,
    baseServerUrl: '/PT', // 测试地址
    index: path.resolve(__dirname, '../dist-pre/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist-pre'),
    assetsSubDirectory: 'statics/pc',
    assetsPublicPath: '/PT/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {  // 开发环境
    env: require('./dev.env'),
    port: 8083,
    baseServerUrl: '/PT',
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
var interfaceArr = [
  '/*/sys/**/*',
  '/*/person/**/*',
  '/*/mobileMsg/**/*'
]
for (let i = 0; i < interfaceArr.length; i++) {
  config.dev.proxyTable[interfaceArr[i]] = {
    target: 'http://localhost:8087',
    secure: false,
    changeOrigin: true
  }
}
module.exports = config

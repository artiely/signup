var config = require('../../config')
let serverUrl
if (process.env.NODE_ENV === 'production') {
  serverUrl = config.build.baseServerUrl
  console.log('%c 如果你看到这条 log , 说明当前是生产环境', 'font-size:14px;color:#f00;background:#000')
} else if (process.env.NODE_ENV === 'development') {
  serverUrl = config.dev.baseServerUrl
  console.log('%c 如果你看到这条 log , 说明当前是开发环境', 'font-size:14px;color:#f00;background:#000')
} else {
  serverUrl = config.pre.baseServerUrl
  console.log('%c 如果你看到这条 log , 说明当前是测试环境', 'font-size:14px;color:#f00;background:#000')
}
// 服务器地址
export const SERVER_BASE_URL = serverUrl
// 请求成功状态吗
export const ERR_OK = 0
// 未登录的状态吗
export const UNLOGIN = 1000

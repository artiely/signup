import fetch from './fetch'

/**
 * 验证邮箱是否存在
 * @param params
 */
const CHECK_EMAIL = params => {
  return fetch({
    url: '/sys/user/checkRegistEmail',
    method: 'get',
    params: params
  })
}
/**
 * 注册
 * @param params
 */
const REGISTER = params => {
  return fetch({
    url: '/sys/user/saveEmailAndPsw',
    method: 'post',
    data: params
  })
}

/**
 * 验证token是否过期
 * @param params
 */
const CHECK_TOKEN = params => {
  return fetch({
    url: '/sys/user/checkRegistTime',
    method: 'post',
    data: params
  })
}

/**
 * 信息登记
 * @param params
 */
const POST_USER_INFO = params => {
  return fetch({
    url: '/person/saveBasicInfo',
    method: 'post',
    data: params
  })
}

/**
 * 获取公司/个人注册信息
 * @param params
 */
const GET_REGISTER_INFO = params => {
  return fetch({
    url: '/person/getRegistInfo',
    method: 'post',
    data: params
  })
}

/**
 * 获取公司/个人修改保存
 * @param params
 */
const UPDATE_REGISTER_INFO = params => {
  return fetch({
    url: '/person/updateRegistInfo',
    method: 'post',
    data: params
  })
}

/**
 * 保存注册个人信息
 * @param params
 */
const SAVE_USER_INFO = params => {
  return fetch({
    url: '/person/saveBasicInfo',
    method: 'post',
    data: params
  })
}

/**
 * 短信验证码
 * @param params
 */
const GET_MSG_CODE = params => {
  return fetch({
    url: '/mobileMsg/sendMobileMsg',
    method: 'get',
    params: params
  })
}

/**
 * 判断手机是否已注册
 * @param params
 * @constructor
 */
const CHECK_PHONE = params => {
  return fetch({
    url: '/sys/user/checkRegistTel',
    method: 'get',
    params: params
  })
}

/**
 * 检查注册信息是否完整
 * @param params
 * @constructor
 */
const CHECK_ACCOUNT = params => {
  return fetch({
    url: '/sys/user/checkAccountAudit',
    method: 'get',
    params: params
  })
}

/**
 * 手机注册
 * @param params
 * @constructor
 */
const REGISTER_BY_MOBILE = params => {
  return fetch({
    url: '/person/RegistByMobile',
    method: 'post',
    data: params
  })
}

/**
 * 判断是否手机注册（手机注册在填写资料时就不用再绑定手机，而邮箱需要绑定手机）
 * @param params
 * @constructor
 */
const CHECK_BIND_MOBILE = params => {
  return fetch({
    url: '/sys/user/checkBindMobile',
    method: 'get',
    params: params
  })
}

/**
 * 邀请码加入公司
 * @param params
 * @constructor
 */
const CODE_JOIN_COMPANY = params => {
  return fetch({
    url: '/person/inviteCodeJoinCompany',
    method: 'post',
    data: params
  })
}

/**
 * 验证公司名称是否被注册
 * @param params
 * @constructor
 */
const CHECK_COMPANY_NAME = params => {
  return fetch({
    url: '/company/checkRegistComapnyInfo',
    method: 'get',
    params: params
  })
}

/**
 * 验证公司营业执照号是否被注册
 * @param params
 * @constructor
 */
const CHECK_BUSINESS_LICENSE = params => {
  return fetch({
    url: '/company/checkRegistBusinessLicense',
    method: 'get',
    params: params
  })
}

/**
 * 天眼检索公司名和营业执照号码
 * @param params
 * @constructor
 */
const GET_COMPANY_LICENSE = params => {
  return fetch({
    url: '/company/getCompanyNameOrBussinessLicence',
    method: 'get',
    params: params
  })
}

const apiList = {
  CHECK_EMAIL,
  REGISTER,
  CHECK_TOKEN,
  POST_USER_INFO,
  GET_REGISTER_INFO,
  UPDATE_REGISTER_INFO,
  SAVE_USER_INFO,
  GET_MSG_CODE,
  CHECK_PHONE,
  CHECK_ACCOUNT,
  REGISTER_BY_MOBILE,
  CHECK_BIND_MOBILE,
  CODE_JOIN_COMPANY,
  CHECK_COMPANY_NAME,
  CHECK_BUSINESS_LICENSE,
  GET_COMPANY_LICENSE
}

export default apiList

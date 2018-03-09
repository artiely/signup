<template>
  <div id="app" class="type" :style="{background:'url('+bgUrl+')'}">
    <Row class="bg" :style="{background:'url('+bgUrl+')'}">
      <Col :xs="16" offset="4">
      <Card style="margin: 100px auto;max-width: 600px;padding-top: 20px">
        <div v-if="token">
          <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="130">
            <!--<small class="help" v-if="source">一个邮箱只能注册一种类型账号</small>-->
            <Tabs v-model.trim="formCustom.typeId" :animated="false">
              <!--个人-->
              <TabPane :label="$t('message.Personage')" name="1" :disabled="isEdit">
                <div v-if="formCustom.typeId==1">
                  <Form-item :label="$t('message.Name')" prop="userName">
                    <Input v-model.trim="formCustom.userName" :placeholder="$t('message.Please_input')"></Input>
                  </Form-item>
                  <!--不是手机号注册的才需要绑定手机号-->
                  <div v-if="!isMobile">
                    <Form-item :label="$t('message.Phone_number')" prop="phone">
                      <Input v-model.trim="formCustom.phone" :placeholder="$t('message.Please_input')"></Input>
                    </Form-item>
                    <Form-item :label="$t('message.Auth_code')" prop="code">
                      <Input v-model.trim="formCustom.code" :placeholder="$t('message.Please_input')">
                      <span slot="append" class="code-btn" @click="getMsgCode"
                            style="cursor: pointer;display: inline-block"
                            v-if="count==60">{{$t('message.UseItem')}}</span>
                      <span slot="append" class="code-btn count"
                            v-if="count!=60">{{count}}s {{$t('message.Resend')}}</span>
                      </Input>
                    </Form-item>
                  </div>
                </div>
              </TabPane>
              <!--企业-->
              <TabPane :label="$t('message.Company')" name="2" :disabled="isEdit">
                <div v-if="formCustom.typeId==2">
                  <small class="help">{{$t('message.Company_name_help')}}</small>
                  <Form-item :label="$t('message.Company_name')" prop="company">
                    <Dropdown style="width:99%" @on-click="setInput">
                      <Input v-model.trim="formCustom.company" :placeholder="$t('message.Please_input')"></Input>
                      <DropdownMenu slot="list">
                        <DropdownItem v-show="companyList.length==0">暂无匹配结果...</DropdownItem>
                        <DropdownItem v-for="(item,i) in companyList" :name="item.sitem" :key="i">{{item.companyname}}</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </Form-item>
                  <Form-item :label="$t('message.Mark')" prop="mark">
                    <Input v-model.trim="formCustom.mark" :placeholder="$t('message.Please_input')"></Input>
                  </Form-item>
                  <small class="help">{{$t('message.Company_id_num_help')}}</small>
                  <Form-item :label="$t('message.Company_id_num')" prop="companyIdNum">
                    <Input v-model.trim="formCustom.companyIdNum" :placeholder="$t('message.Please_input')"></Input>
                  </Form-item>
                  <Form-item :label="$t('message.AdminName')" prop="userName">
                    <Input v-model.trim="formCustom.userName" :placeholder="$t('message.Please_input')"></Input>
                  </Form-item>
                  <div v-if="!isMobile">
                    <Form-item :label="$t('message.Admin_phone_num')" prop="phone">
                      <Input v-model.trim="formCustom.phone" :placeholder="$t('message.Please_input')"></Input>
                    </Form-item>
                    <Form-item :label="$t('message.Auth_code')" prop="code">
                      <Input v-model.trim="formCustom.code" :placeholder="$t('message.Please_input')">
                      <span slot="append" class="code-btn" @click="getMsgCode"
                            style="cursor: pointer;display: inline-block"
                            v-if="count==60">{{$t('message.UseItem')}}</span>
                      <span slot="append" class="code-btn count"
                            v-if="count!=60">{{count}}s {{$t('message.Resend')}}</span>
                      </Input>
                    </Form-item>
                  </div>
                </div>
              </TabPane>
            </Tabs>
            <Form-item>
              <Button type="primary" @click.native="handleSubmit('formCustom')" long :loading="loading">
                {{$t('message.Submit')}}
              </Button>
            </Form-item>
          </Form>
        </div>
        <div v-if="!token">
          <h3 style="color:#ed3f14;text-align: center"><p> {{$t('message.Links_expire')}}<a href="register.html"> {{$t('message.Resend_message')}}</a></p></h3>
        </div>
        <small style="display: block;text-align: center">Copyright ©2001-2017 群思科技有限公司 <br>
          All rights reserved
        </small>
      </Card>
      </Col>
    </Row>

  </div>
</template>
<script>
  import Cookies from 'js-cookie'
  import {GetQueryString} from '@/utils'
  import bgUrl from '@/assets/img/bg_login.jpg'

  export default {
    name: 'type',
    data () {
      return {
        timer3: null,
        token: true,
        loading: false,
        bgUrl: bgUrl,
        isEmail: false, // 来源 为email时是true
        editData: {},
        companyList: [],
        isMobile: false,
        isEdit: false,
        count: 60,
        formCustom: {
          typeId: '1', // 2 企业 1 个人
          company: '',
          mark: '',
          companyIdNum: '', // 营业执照号
          userName: '',
//          idCard: '',
//          sex: '1',
          phone: '',
          code: ''
        },
        getInfo: {},
        ruleUser: {
          userName: [
            {required: true, message: this.$t('message.Required_fields')}
          ],
          phone: [
            {required: true, message: this.$t('message.Required_fields')},
            {
              message: this.$t('message.Incorrect_format'),
              len: 11,
              trigger: 'blur',
              pattern: /^[1][3,4,5,7,8][0-9]{9}$/
            }
          ]
        }
      }
    },
    watch: {
      'formCustom.company': {
        handler (val) {
          clearTimeout(this.timer3)
          this.timer3 = setTimeout(() => {
            this.$api.GET_COMPANY_LICENSE({key: val}).then(res => {
              console.log(res)
              if (res.code === 0) {
                console.log(res.list)
                this.companyList = res.list.map(v => {
                  v.sitem = JSON.stringify(v)
                  return v
                })
              }
            })
          }, 600)
        }
      }
    },
    computed: {
      ruleCustom () { // 计算验证规则
        const validateCompanyId = (rule, value, callback) => {
          if (value === '') {
            callback()
          }
          if (value.toString().length !== 15 && value.toString().length !== 18) {
            callback(new Error(this.$t('message.Incorrect_format')))
          } else {
            callback()
          }
        }
        var timer = null
        const checkCompanyName = (rule, value, callback) => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            if (this.formCustom.company.length > 0) {
              this.$api.CHECK_COMPANY_NAME({companyName: this.formCustom.company, companyID: this.editData.companyID}).then(res => {
                if (res.code === 0) {
                  if (res.state === 0) {
                    callback()
                  } else if (res.state === 1) {
                    callback(new Error(res.info))
                  }
                }
              })
            }
          }, 700)
        }
        var timer2 = null
        const checkBusinessLicense = (rule, value, callback) => {
          clearTimeout(timer2)
          timer2 = setTimeout(() => {
            if (this.formCustom.companyIdNum.length > 0) {
              this.$api.CHECK_BUSINESS_LICENSE({businessLicenseNumber: this.formCustom.companyIdNum, companyID: this.editData.companyID}).then(res => {
                if (res.code === 0) {
                  if (res.state === 0) {
                    callback()
                  } else if (res.state === 1) {
                    callback(new Error(res.info))
                  }
                }
              })
            }
          }, 700)
        }
        if (this.formCustom.typeId === '2') { // 企业规则
          return {
            company: [
              {required: true, message: this.$t('message.Required_fields')},
              {validator: checkCompanyName}
            ],
            mark: [
              {required: true, message: this.$t('message.Required_fields')},
              {message: this.$t('message.Letter_only'), pattern: /^[a-z]+$/i}
            ],
            companyIdNum: [
              {required: true, message: this.$t('message.Required_fields'), trigger: 'blur'},
              {validator: validateCompanyId},
              {validator: checkBusinessLicense}
            ],
            /* idCard: [
               {required: true, message: this.$t('message.Required_fields'), trigger: 'blur'},
               {
                 message: this.$t('message.Incorrect_format'),
                 trigger: 'blur',
                 pattern: /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}\w{1}$/
               }
             ], */
            userName: [
              {required: true, message: this.$t('message.Required_fields')}
            ],
            phone: [
              {required: true, message: this.$t('message.Required_fields')},
              {
                message: this.$t('message.Incorrect_format'),
                len: 11,
                trigger: 'blur',
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/
              }
            ],
            code: [
              {required: true, message: this.$t('message.Required_fields')}
            ]
          }
        } else { // 个人规则
          return {
            userName: [
              {required: true, message: this.$t('message.Required_fields')}
            ],
            phone: [
              {required: true, message: this.$t('message.Required_fields')},
              {
                message: this.$t('message.Incorrect_format'),
                len: 11,
                trigger: 'blur',
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/
              }
            ],
            code: [
              {required: true, message: this.$t('message.Required_fields')}
            ]
          }
        }
      }
    },
    methods: {
      setInput (v) {
        if (!v) return
        let val = JSON.parse(v)
        this.formCustom.company = val.companyname
        this.formCustom.companyIdNum = val.businessLicenseNumber
      },
      handleSubmit (name) {
        this.loading = true
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log('---验证通过----')
            // 如果有source=email 就是从邮件来的 就是提交 否则是修改 state=4位登陆后信息不全的时候
            console.log('data', this.formCustom, this.isEmail, this.isMobile, GetQueryString('state'), GetQueryString('state') === '4')
            if (this.isEmail || this.isMobile || GetQueryString('state') === '4') {
              if (this.formCustom.typeId === '1') { // 个人
                this._saveUserInfo()
              } else { // 企业
                this._saveCompanyInfo()
              }
            } else if (GetQueryString('edit') === '1') { // 是修改
              this._updateCompanyOrUserInfo()
            }
          } else {
            this.loading = false
            this.$Message.error(this.$t('message.Validation_fails'))
          }
        })
      },
      /**
       * 判断是否邮箱
       * 是邮箱就验证token
       * 是否编辑
       * 否则验证是否手机
       * */
      checkToken () {
        let data = {
          token: GetQueryString('token') || '',
          e: GetQueryString('e') || '',
          p: GetQueryString('p') || ''
        }
        // 如果有source=email 就是从邮件来的 就必须验证token
        if (GetQueryString('source') && GetQueryString('source') === 'email') {
          this.isEmail = true
          this.$api.CHECK_TOKEN(data).then(res => {
            if (res.code === 0) {
              if (res.state === '1') {
                this.token = true
              } else {
                this.token = false
              }
            }
          })
        } else if (GetQueryString('edit') && GetQueryString('edit') === '1') {
          this.isEdit = true
          this.isEmail = false
          this._getRegisterInfo()
        } else {
          this.isEmail = false
          this.checkMobile()
        }
      },
      /**
       * 验证是否手机
       * 否则就是修改，获取用户信息
       * */
      checkMobile () {
        this.$api.CHECK_BIND_MOBILE().then(res => {
          if (res.code === 0) {
            if (res.exist === '1') { // 是手机号登录(注册)
              this.isMobile = true
            } else {
              this.isMobile = false
            }
          } else {
            alert(JSON.stringify(res))
          }
        })
      },
      getMsgCode () {
        if (this.formCustom.phone.length !== 11) return
        console.log('biu....')
        let data = {
          telephone: this.formCustom.phone,
          type: 0
        }
        let s = setInterval(() => {
          this.count--
          if (this.count === 0) {
            this.count = 60
            clearInterval(s)
          }
        }, 1000)
        this.$api.GET_MSG_CODE(data).then(res => {
          if (res.code === 0) {
            this.$Message.info(this.$t('message.Msg_send'))
          }
        })
      },
      /**
       * 获取用户信息
       * */
      _saveCompanyInfo () {
        // 第一次通过邮件注册信息
        let data = {
          account_type: this.formCustom.typeId,
          company_name: this.formCustom.company,
          comp_eng_short_name: this.formCustom.mark,
          business_license_number: this.formCustom.companyIdNum,
          personName: this.formCustom.userName,
//          personSex: this.formCustom.idCard.substring(16, 1) % 2 ? '1' : '0',
//          idCard: this.formCustom.idCard,
          telephone: this.formCustom.phone,
          table_name: GetQueryString('table_name') || (Cookies.getJSON('table_id') && Cookies.getJSON('table_id').table_name) || '',
          table_id: GetQueryString('table_id') || (Cookies.getJSON('table_id') && Cookies.getJSON('table_id').table_id) || '',
          email: GetQueryString('e') || '',
          code: this.formCustom.code,
          source: GetQueryString('source') || ''
        }
        if (this.formCustom.typeId === '1') {
          data.personSex = this.formCustom.sex
        }
        if (this.isMobile) {
          data.source = 'telephone'
        }
        this.$api.POST_USER_INFO(data).then(res => {
          this.loading = false
          if (res.code === 0) {
            if (res.state !== '1') {
              alert(this.$t('message.Verification_code_error'))
              return
            } else {
              this.$Message.success(this.$t('message.Success'))
              let url = window.location.href
              if (window.location.search === '') {
                url = window.location.href
              } else {
                url = url.split(window.location.search)[0]
              }
              url = url.replace('type.html', 'login.html')
              window.location.href = url
            }
          } else {
            alert(JSON.stringify(res))
          }
        }).catch(err => {
          this.loading = false
          console.error('哎哟~！', err)
        })
      },
      _updateCompanyOrUserInfo () {
        // 如果是修改 提交参数略有不同
        var eData
        if (this.formCustom.typeId === '2') { // 企业
          eData = {
            account_type: this.formCustom.typeId,
            company_name: this.formCustom.company,
            comp_eng_short_name: this.formCustom.mark,
            business_license_number: this.formCustom.companyIdNum,
            personName: this.formCustom.userName,
//            personSex: this.formCustom.idCard.substring(16, 1) % 2 ? '1' : '0',
//            idCard: this.formCustom.idCard,
            telephone: this.formCustom.phone,
            code: this.formCustom.code,
            email: this.editData.email,
            personId: this.editData.personId,
            rowChangeLogId: this.editData.rowChangeLogId,
            sysUserId: this.editData.sysUserId,
            companyID: this.editData.companyID
          }
        } else {
          eData = {
            account_type: this.formCustom.typeId,
            personName: this.formCustom.userName,
            personSex: this.formCustom.sex,
            telephone: this.formCustom.phone,
            code: this.formCustom.code,
            email: this.editData.email,
            personId: this.editData.personId,
            rowChangeLogId: this.editData.rowChangeLogId,
            sysUserId: this.editData.sysUserId,
            companyID: this.editData.companyID
          }
        }
        this.$api.UPDATE_REGISTER_INFO(Object.assign({}, eData)).then(res => {
          this.loading = false
          if (res.code === 0) {
            if (res.state !== '1') {
//              alert('验证码错误或过期')
              alert(this.$t('message.Verification_code_error'))
              return
            } else {
              this.$Message.success(this.$t('message.Success'))
              let url = window.location.href
              if (window.location.search === '') {
                url = window.location.href
              } else {
                url = url.split(window.location.search)[0]
              }
              ;
              var _bakc = GetQueryString('back')
              if (_bakc === '1') {
                url = url.replace('type.html', 'index.html')
              } else {
                url = url.replace('type.html', 'login.html')
              }
              window.location.href = url
            }
          } else {
            alert(JSON.stringify(res))
          }
        }).catch(err => {
          this.loading = false
          console.error('哎哟~！', err)
        })
      },
      _saveUserInfo () { // 通过邮件注册第一次提交个人信息
        let uData = {
          account_type: this.formCustom.typeId,
          personName: this.formCustom.userName,
          personSex: this.formCustom.sex,
          email: GetQueryString('e') || '',
          telephone: this.formCustom.phone,
          code: this.formCustom.code,
          table_name: GetQueryString('table_name') || (Cookies.getJSON('table_id') && Cookies.getJSON('table_id').table_name) || '',
          table_id: GetQueryString('table_id') || (Cookies.getJSON('table_id') && Cookies.getJSON('table_id').table_id) || '',
          source: 'email'
        }
        if (this.isMobile) {
          uData.source = 'telephone'
        }
        this.$api.SAVE_USER_INFO(uData).then(res => {
          this.loading = false
          if (res.code === 0) {
            if (res.state !== '1') { // 验证码不通过
              alert(res.info)
              return
            }
            this.$Message.success(this.$t('message.Success'))
            let url = window.location.href
            if (window.location.search === '') {
              url = window.location.href
            } else {
              url = url.split(window.location.search)[0]
            }

            url = url.replace('type.html', 'login.html')
            window.location.href = url
          } else {
            alert(JSON.stringify(res))
          }
        }).catch((err) => {
          this.loading = false
          console.log(err)
        })
      },
      _getRegisterInfo () {
        this.$api.GET_REGISTER_INFO().then(res => {
          if (res.code === 0) {
            let data = res.registeInfo[0]
            this.editData = data
            let {typeId, company, mark, companyIdNum, userName, phone} = {
              typeId: data.accountType,
              company: data.companyName,
              mark: data.compEngShortName,
              companyIdNum: data.businessLicenseNumber,
              userName: data.personName,
//              idCard: data.idCard,
//              sex: data.personSex === '男' ? '1' : '0',
              phone: data.telephone
            }
            this.formCustom = {typeId, company, mark, companyIdNum, userName, phone}
            console.log(data, this.formCustom)
          }
        })
      },
      save () {

      }
    },
    beforeCreate () {
      // 获取地址栏地址
      let uri = window.location.href
      console.log(uri)
      if (uri.indexOf('&amp;') !== -1) {
        uri = window.location.href.replace(/&amp;/g, '&')
        window.location.href = uri
      }
      if (uri.indexOf('&;') !== -1) {
        uri = window.location.href.replace(/&;/g, '&')
        window.location.href = uri
      }
      console.log(uri)
    },
    created () {
      /**
       * 看连接是否带source 判断source（来源）是否邮件
       * 是邮件判断token是否过期
       * 否则判断是否是手机注册
       */
//      var href = window.location.href
//      console.log('之前的href', href)
//      href.replace(/&amp;|&;/g, '&')
//      window.location.href = href
//      window.reload()
//      console.log('之后的href', href)
      this.checkToken()
//      if ((GetQueryString('source') && (GetQueryString('source') === 'email'))) {
//        this.isEmail = true
//
//      } else {
//        this.checkMobile()
//      }
    }
  }
</script>

<style lang="less">
  html, body {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  .code-btn {
    width: 80px;
    display: inline-block;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .help {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #9ea7b4;
  }
</style>

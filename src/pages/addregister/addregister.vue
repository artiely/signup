<template>
  <div id="app" class="register" :style="{background:'url('+bgUrl+')'}">
    <Row class="bg" :style="{background:'url('+bgUrl+')'}">
      <Col :xs="16" offset="4">
      <Card style="margin: 100px auto;max-width: 600px;padding-top: 20px">

        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="120">
          <!--<small class="help">每个邮箱只能申请一种账号，如是注册企业账号，建议使用企业邮箱；个人账号，使用个人邮箱</small>-->
          <Tabs v-model="registerType" :animated="false">

            <!--手机号注册-->
            <TabPane :label="$t('message.PhoneNumber_singUp')" name="mType">
              <div v-if="registerType=='mType'">
                <Form-item :label="$t('message.PhoneNumber')" prop="phone">
                  <Input v-model="formCustom.phone" :placeholder="$t('message.Please_input')"></Input>
                </Form-item>
                <!--<Form-item :label="$t('message.Auth_code')" prop="code">-->
                  <!--<Input v-model="formCustom.code" :placeholder="$t('message.Please_input')">-->
                  <!--<span slot="append" class="code-btn" @click="getMsgCode" style="cursor: pointer;display: inline-block"-->
                        <!--v-if="count==60">{{$t('message.UseItem')}}</span>-->
                  <!--<span slot="append" class="code-btn count" v-if="count!=60">{{count}}s {{$t('message.Resend')}}</span>-->
                  <!--</Input>-->
                <!--</Form-item>-->
                <Form-item :label="$t('message.Password')" prop="passwd">
                  <Input type="password" v-model="formCustom.passwd"></Input>
                </Form-item>
                <Form-item :label="$t('message.Check_password')" prop="passwdCheck">
                  <Input type="password" v-model="formCustom.passwdCheck"></Input>
                </Form-item>
                <Form-item>
                  <Button type="primary" @click="handleSubmit('formCustom')" long>{{$t('message.Submit')}}</Button>
                </Form-item>
              </div>
            </TabPane>
          </Tabs>
        </Form>
        <small style="display: block;text-align: center">Copyright ©2001-2017 群思科技有限公司 <br>
          All rights reserved
        </small>
      </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import { GetQueryString } from '@/utils'
  import bgUrl from '@/assets/img/bg_login.jpg'
  export default {
    name: 'register',
    data () {
      return {
        registerType: 'mType',
        bgUrl: bgUrl,
        mailList: [],
        count: 60,
        formCustom: {
          mail: '',
          passwd: '',
          passwdCheck: '',
          phone: '',
          code: ''
        }
      }
    },
    computed: {
      /**
       * 验证规则 邮箱和手机
       * @returns {*}
       */
      ruleCustom () {
        const validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error(this.$t('message.Required_fields')))
          } else {
            if (this.formCustom.passwdCheck !== '') {
              // 对第二个密码框单独验证
              this.$refs.formCustom.validateField('passwdCheck')
            }
            callback()
          }
        }
        const validatePassCheck = (rule, value, callback) => {
          if (value === '') {
            callback(new Error(this.$t('message.Required_fields')))
          } else if (value !== this.formCustom.passwd) {
            callback(new Error(this.$t('message.Entered_differ')))
          } else {
            callback()
          }
        }
        const validateMail = (rule, value, callback) => {
          this.$api.CHECK_EMAIL({email: value}).then(res => {
            if (res.code === 0) {
              if (res.state === '-1') {
                callback(new Error(this.$t('message.Already_exists')))
              } else {
                callback()
              }
            } else {
              callback(new Error(res.msg))
            }
          })
        }
        const checkPhone = (rule, value, callback) => {
          this.$api.CHECK_PHONE({telephone: value}).then(res => {
            if (res.code === 0) {
              if (res.state === '0') {
                callback(new Error(this.$t('message.Already_exists')))
              } else {
                callback()
              }
            } else {
              alert(JSON.stringify(res))
            }
          })
        }
        if (this.registerType === 'eType') {
          return {
            mail: [
              {required: true, message: this.$t('message.Required_fields')},
              {type: 'email', message: this.$t('message.Incorrect_format')},
              {validator: validateMail}
            ],
            passwd: [
              {validator: validatePass, trigger: 'blur'}
            ],
            passwdCheck: [
              {validator: validatePassCheck, trigger: 'blur'}
            ]
          }
        } else {
          return {
            phone: [
              {required: true, message: this.$t('message.Required_fields')},
              {
                message: this.$t('message.Incorrect_format'),
                len: 11,
                trigger: 'blur',
                pattern: /^[1][3,4,5,7,8][0-9]{9}$/
              },
              {validator: checkPhone, trigger: 'blur'}
            ],
            code: [{required: true, message: this.$t('message.Required_fields')}],
            passwd: [
              {validator: validatePass, trigger: 'blur'}
            ],
            passwdCheck: [
              {validator: validatePassCheck, trigger: 'blur'}
            ]
          }
        }
      }
    },
    methods: {
      autoMail (value) {
        this.mailList = !value || value.indexOf('@') >= 0 ? [] : [
          value + '@qq.com',
          value + '@sina.com',
          value + '@163.com',
          value + '@gmail.com'
        ]
      },
      getMsgCode () {
        if (this.formCustom.phone.length !== 11) return
        console.log('biu....')
        let data = {
          telephone: this.formCustom.phone,
          type: 0
        }
        var c = setInterval(() => {
          this.count--
          if (this.count === 0) {
            this.count = 60
            clearInterval(c)
          }
        }, 1000)
        this.$api.GET_MSG_CODE(data).then(res => {
          if (res.code === 0) {
            this.$Message.info(this.$t('message.Msg_send'))
          }
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.registerType === 'eType') {
              this._postEmial()
              console.log('邮箱注册数据提交')
            } else {
              this._postMobile()
              console.log('手机注册数据提交')
            }
          } else {
            this.$Message.error(this.$t('message.Validation_fails'))
          }
        })
      },
      _postMobile () {
        let data = {
          telephone: this.formCustom.phone,
          code: this.formCustom.code,
          password: this.formCustom.passwd,
          table_name: GetQueryString('table_name') || '',
          table_id: GetQueryString('table_id') || ''
        }
        this.$api.REGISTER_BY_MOBILE(data).then(res => {
          if (res.code === 0) {
            if (res.state === '1') { // 成功
//              this.$router.push('/type')
              let url = window.location.href
              window.location.href = url.replace('addregister.html', 'type.html')
            } else if (res.state === '2') { // 不正确
              alert(this.$t('message.Wrong_captcha'))
              this.error.code = '验证码错误'
            } else if (res.state === '3') { // 过期
              alert(this.$t('message.Wrong_Verification'))
              this.error.code = '验证码过期'
            }
          }
        })
      },
      _postEmial () {
        let url = window.location.href
        if (window.location.search === '') {
          url = window.location.href
        } else {
          url = url.split(window.location.search)[0]
        }
        url = url.replace('register.html', 'type.html')
        let data = {
          email: this.formCustom.mail,
          password: this.formCustom.passwd,
          url: url,
          table_name: GetQueryString('table_name') || '',
          table_id: GetQueryString('table_id') || '',
          open_id: GetQueryString('open_id') || ''
        }
        this.$api.REGISTER(data).then(res => { // 邮箱注册
          if (res.code === 0) {
            this.$Message.success(this.$t('message.Success'))
            this.$Notice.open({
//              desc: `激活信息已发送至<span style="color:#f00">${this.formCustom.mail}</span>,请注意查收并及时激活。`,
              desc: this.$t('message.Send_email_des', {msg: `<span style="color:#f00">${this.formCustom.mail}</span>`}),
              duration: 0
            })
          }
        })
      },
      save () {

      }
    },
    components: {}

  }
</script>

<style lang="less">
  .code-btn {
    width: 80px;
    display: inline-block;
  }

  html, body {
    position: absolute;
    height: 100%;
    width: 100%;
  }

  #app {
    height: 100%;
    width: 100%;
  }

  .help {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #9ea7b4;
  }
</style>

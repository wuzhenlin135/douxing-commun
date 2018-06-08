<template>
  <div class="signup-container">
    <el-form class="signup-form"  :model="signupForm" :rules="signupRules" ref="signupForm" label-position="top" label-width="80px">
      <h4 class="title">重置密码</h4>

      <el-form-item prop="username" label="手机号码">
        <el-input name="username" type="text" v-model="signupForm.username"  placeholder="请输入正确的手机号码" />
      </el-form-item>

      <el-form-item prop="code" label="验证码">
        <el-input name="code" type="text" v-model="signupForm.code"  placeholder="请输入验证码" />
        <el-button class="get-verify-code" @click.native.prevent="fetchVerifyCode">
          {{verifyCodeMsg}}
        </el-button>
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input name="password" type="password" v-model="signupForm.password"  placeholder="请输入密码" />
      </el-form-item>

      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input name="confirmPassword" type="password" v-model="signupForm.confirmPassword"  placeholder="请再次输入密码" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" style="width:100%;margin-top:10px" :loading="loading" @click.native.prevent="handleSignup">
          重置密码
        </el-button>
      </el-form-item>

      <div class="tips">
        <router-link to="login"><span style="margin-right:20px;">返回登录</span></router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isPhoneNumber } from '@/utils/validate'
import { forget } from '@/api/login'
import { sendVerifyCode } from '@/api/sms'

export default {
  name: 'forget',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isPhoneNumber(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.signupForm.password) {
        callback(new Error('两次密码不相同'))
      } else {
        callback()
      }
    }

    return {
      signupForm: {
        username: '',
        password: '',
        confirmPassword: '',
        code: '',
        sign: ''
      },
      signupRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },

      loading: false,
      verifyCodeMsg: '获取验证码',
      isOvertime: false
    }
  },

  methods: {
    fetchVerifyCode() {
      if (!isPhoneNumber(this.signupForm.username)) {
        return this.$message.error('请先输入手机号码')
      }
      if (this.isOvertime) {
        return false
      }
      const that = this
      let time = 60
      var sendTimer = setInterval(() => {
        this.isOvertime = true
        time--
        that.verifyCodeMsg = '重新发送(' + time + ')'
        if (time < 0) {
          that.isOvertime = false
          clearInterval(sendTimer)
          that.verifyCodeMsg = '获取验证码'
        }
      }, 1000)

      sendVerifyCode(this.signupForm.username, 1).then(response => {
        console.log(response)
        that.signupForm.sign = response.obj.token
      })
    },
    handleSignup() {
      this.$refs.signupForm.validate(valid => {
        if (valid) {
          this.loading = true
          forget(this.signupForm).then(response => {
            this.$router.push({ path: 'login' })
            this.$message({
              message: '重置密码成功',
              type: 'success'
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$light_blue:#539fff;

.signup-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;

  .signup-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }

  .title {
    font-size: 21px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }

  .el-form-item__label {
    color: $light_gray;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .get-verify-code {
    position: absolute;
    right: 0px;
    top: 0px;
    font-size: 14px;
    color: $light_blue;
    cursor: pointer;
    user-select: none;
  }
}
</style>

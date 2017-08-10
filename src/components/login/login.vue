<template>
  <div id="login">
    <div class="login-bg">
      <div class="logo"></div>
      <div class="sim-icon"></div>
      <div class="login-wrap">
        <div class="login-box" id="login-box">
          <h2>物联网卡管理系统</h2>
          <el-form :model="ruleForm2" ref="ruleForm2" label-width="55px" class="demo-ruleForm">
            <div class="input-wrap">
              <span class="user-icon input-icon"></span>
              <input type="text" v-model="ruleForm2.username" placeholder="用户名" class="input" @blur="validateUserName">
              <div class="input-error" id="usernameErr">{{usernameErr}}</div>
            </div>
            <div class="input-wrap">
              <span class="password-icon input-icon"></span>
              <input type="password" v-model="ruleForm2.password" placeholder="密码" class="input" @blur="validatePassword">
              <div class="input-error" id="passwordErr">{{passwordErr}}</div>
            </div>
            <div class="input-wrap">
              <span class="code-icon input-icon"></span>
              <input type="text" v-model="ruleForm2.code" placeholder="验证码" class="input code" @blur="validateCode">
              <img :src="imagecode" class="imagecode">
              <span class="refresh-icon" :class="{refresh: refreshFlag}" @click="doRefresh"></span>
              <div class="input-error" id="codeErr">{{codeErr}}</div>
            </div>
            <input type="button" class="btn" value="登  录" @click="submitForm('ruleForm2')">
          </el-form>
        </div>
        <div class="error-div">{{submitErr}}</div>
        <p>
          <span>版权所有:</span><a href="http://www.517car.com" target="_blank">用车找我（www.517car.com）</a>
        </p>
      </div>
    </div>
    <footer>
      <p>copyright@2013-2014.All Rights Reserved &nbsp; &nbsp; 深圳市和合汽车信息服务有限公司版权所有</p>
    </footer>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        ruleForm2: {
          username: '',
          password: '',
          code: ''
        },
        usernameErr: '',
        passwordErr: '',
        codeErr: '',
        submitErr: '',
        imagecode: '',
        refreshFlag: false
      }
    },
    created() {
      this.getCode()
    },
    mounted() {
    },
    methods: {
      doRefresh() {
        this.refreshFlag = true
        this.getCode()
        setTimeout(() => {
          this.refreshFlag = false
        }, 1000)
      },
      getCode() {
        let self = this
        let url = '/login/imagecode'
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob' // 特殊处理图片二进制流
        xhr.onload = function() {
          if (this.status === 200) {
            let blob = this.response
            self.imagecode = window.URL.createObjectURL(blob)
          }
        }
        xhr.send()
      },
      validateUserName() {
        if (!this.ruleForm2.username.trim()) {
          this.usernameErr = '请输入用户名'
        } else {
          this.usernameErr = ''
        }
      },
      validatePassword() {
        if (!this.ruleForm2.password.trim()) {
          this.passwordErr = '请输入密码'
        } else {
          this.passwordErr = ''
        }
      },
      validateCode() {
        if (!this.ruleForm2.code.trim()) {
          this.codeErr = '请输入验证码'
        } else {
          this.codeErr = ''
        }
      },
      submitForm(formName) {
        this.validateUserName()
        this.validatePassword()
        this.validateCode()
        if (this.usernameErr || this.passwordErr || this.codeErr) {
          return
        }
        let self = this
        let userName = this.ruleForm2.username.trim()
        this.$http.post('/login', {
          username: userName,
          password: this.ruleForm2.password.trim(),
          checkCode: this.ruleForm2.code.trim()
        }).then((response) => {
          let data = response.body
          self.submitErr = data.msg
          if (!data.success) {
            // if (data.code === 0) { // 用户名密码错误时刷新验证码
            self.getCode()
            // }
          } else {
            window.localStorage.setItem('userName', userName)
            this.$store.commit('LOGIN_FLAG', {loginFlag: true})
            this.$store.commit('ROUTE_CHANGE', {activeRoute: 'firstpage'})
            this.$router.push({name: 'firstpage'})
          }
        })
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
#login{
  min-width:1366px;
  background: -webkit-radial-gradient(#22a2e1, #1d8bd8); /* Safari 5.1 - 6.0 */
  background: -o-radial-gradient(#22a2e1, #1d8bd8); /* Opera 11.6 - 12.0 */
  background: -moz-radial-gradient(#22a2e1, #1d8bd8); /* Firefox 3.6 - 15 */
  background: radial-gradient(#22a2e1, #1d8bd8); /* 径向渐变，颜色节点均匀分布，标准的语法（必须放在最后） */
}
.login-bg{
  min-width:1366px;
  background: url(login_bg.png) no-repeat center;
  width: 1375px;
  height: 955px;
  padding-top: 1px;
  margin: 0 auto;
  position: relative;
}
.logo{
  background: url(logo.png) no-repeat center;
  width: 308px;
  height: 94px;
  margin: 162px auto 42px;
}
.sim-icon{
  background: url(sim_icon.png) no-repeat center;
  width: 142px;
  height: 176px;
  position: absolute;
  right: 430px;
  top: 160px;
}
.login-wrap{
  margin: 0 auto;
  width:355px;
  height:365px;
  padding-top: 35px;
  border-radius: 10px;
  background: #fff;
  position: relative;
  p{
    width: 100%;
    border-radius: 0 0 10px 10px;
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    span{
      color: #808080;
    }
    a{
      color: #128bca;
    }
  }
}
.login-box{
  margin: 0 37px;
  h2{
    font-size: 20px;
    color: #128bca;
    margin-bottom: 34px;
    font-weight: bold;
  }
  .input-wrap{
    position: relative;
  }
  .input{
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    color: #b2b2b2;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px 3px 33px;
    width: 100%;
    display: inline-block;
    margin-bottom: 18px;
    font-size: 14px;
  }
  .input:focus{
    border: 1px solid #98d8f6;
  }
  .code{
    width: 123px;
    margin-right: 14px;
  }
  .input-icon{
    display: inline-block;
    width: 18px;
    height: 18px;
    position: absolute;
    left: 10px;
    top: 9px;
  }
  .user-icon{
    background: url(user＿icon.png) 0 0 no-repeat;
  }
  .password-icon{
    background: url(password_icon.png) 0 0 no-repeat;
  }
  .code-icon{
    background: url(code_icon.png) 0 0 no-repeat;
  }
  .refresh-icon{
    background: url(refresh_icon.png) 0 0 no-repeat;
    display: inline-block;
    width: 22px;
    height: 22px;
    position: absolute;
    right: 10px;
    top: 6px;
    cursor: pointer;
  }
  .refresh{
    transition: all 0.5s;
    transform:rotate(360deg);
  }
  .imagecode{
    width: 97px;
    height: 36px;
    vertical-align: middle;
  }
  .input-error{
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 35px;
    left: 0;
  }
  .input-error-border{
    border: 1px solid red;
  }
  .btn{
    width: 280px;
    height: 44px;
    line-height: 44px;
    white-space: nowrap;
    cursor: pointer;
    background: #128bca;
    color: #fff;
    border-radius: 4px;
    font-weight: bold;
    margin-top: 15px;
  }
}
.error-div{
  color: #ff4949;
  font-size: 12px;
  text-align: center;
  padding-top: 20px;
}
footer{
  height: 60px;
  width: 100%;
  position: fixed;
  bottom: 0;
  p{
    line-height:60px;
    text-align: center;
    font-size: 12px;
    color: #c6c8cc;
    background: #0f64a5;
  }
}
</style>

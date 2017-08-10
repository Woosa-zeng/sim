<template lang="html">
  <div id="vheader">
    <div class="header-left fl">
      <img src="./logo.png" width="128" height="38">
      <strong id="title">物联网卡管理系统</strong>
    </div>
    <div class="header-right fr">
      <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link username">
        {{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">用户个人信息</el-dropdown-item>
          <el-dropdown-item command="b">修改密码</el-dropdown-item>
          <el-dropdown-item command="c">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="mask" :class="{hide: isActive}"></div>
      <div class="addInfoBox showInfo" :class="{hide: showInfo}">
        <div class="close" @click="closeMask">x</div>
        <el-form :model="userInfoForm" ref="userInfoForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="登录名" prop="loginName">
            <el-input disabled v-model="userInfoForm.username"></el-input>
          </el-form-item>
          <el-form-item label="管理员姓名" prop="managerName">
            <el-input disabled v-model="userInfoForm.realname"></el-input>
          </el-form-item>
          <el-form-item label="公司全称">
            <el-input disabled v-model="userInfoForm.fullName"></el-input>
          </el-form-item>
          <el-form-item label="公司简称">
            <el-input disabled v-model="userInfoForm.shortName"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input disabled v-model="userInfoForm.enable"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="addInfoBox changePasswordFlag" :class="{hide: changePasswordFlag}">
        <div class="close" @click="closeMask">x</div>
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="oldPass">
            <el-input v-model="ruleForm2.oldPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
          </el-form-item >
          <el-form-item style="text-align:center">
            <el-button type="primary" @click="changePassword('ruleForm2')">提交</el-button>
            <el-button @click="resetForm('ruleForm2')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="addInfoBox loginOutFlag" :class="{hide: loginOutFlag}">
        <div class="close" @click="closeMask">x</div>
        <el-form label-width="100px" class="demo-ruleForm">
          <div class="loginOutTip">确定要退出吗？</div>
          <el-form-item style="text-align:right">
            <el-button @click="closeMask">取消</el-button>
            <el-button type="primary" @click="loginOut">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    data() {
      let oldPassword = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码长度不能低于5位'))
        }
        callback()
      }
      let validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码长度不能低于5位'))
        }
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码长度不能低于5位'))
        }
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userName: window.localStorage.getItem('userName'),
        dialogFormVisible: false,
        formLabelWidth: '120px',
        isActive: true,
        showInfo: true,
        changePasswordFlag: true,
        loginOutFlag: true,
        userInfoForm: {},
        ruleForm2: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          oldPass: [
            { validator: oldPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      closeMask() {
        this.isActive = true
        this.showInfo = true
        this.changePasswordFlag = true
        this.loginOutFlag = true
      },
      showUserInfo() {
        this.$http.post('/users/queryUser').then((res) => {
          res = res.body
          this.userInfoForm = res.obj
          this.userInfoForm.enable = res.obj.enable ? '有效' : '无效'
        }, (res) => {
          this.$message.error(res)
        })
      },
      changePassword(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/users/updateUserPassword', {
              oldPassword: this.ruleForm2.oldPass,
              newPassword: this.ruleForm2.pass
            }).then((res) => {
              res = res.body
              if (res.status === 'error') {
                this.$message.error(res.msg)
              }
              if (res.status === 'ok') {
                this.$message({
                  type: 'success',
                  message: `密码修改成功! 5秒后退出,请重新登录~`
                })
                setTimeout(() => {
                  this.$router.push({name: 'login'})
                }, 5000)
              }
            }, (res) => {
              this.$message.error(res)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      loginOut() {
        this.$http.post('/loginOut').then((res) => {
          res = res.body
          if (res.status === 'ok') {
            this.$router.push({name: 'login'})
          }
        }, (res) => {
          this.$message.error(res)
        })
      },
      handleCommand(command) {
        this.isActive = false
        console.log(this.isActive)
        switch (command) {
          case 'a':
            this.showInfo = false
            this.showUserInfo()
            break
          case 'b':
            this.changePasswordFlag = false
            break
          case 'c':
            this.loginOutFlag = false
            break
        }
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #vheader{
    position: fixed;
    width: 100%;
    z-index: 10;
    box-sizing: border-box;
    height: 80px;
    background:#1a8cc7;
    background:-moz-linear-gradient(top, #1a8cc7, #2ba1de);
    background:-o-linear-gradient(top, #1a8cc7, #2ba1de);
    background:-webkit-gradient(linear, 0 0, 0 bottom, from(#1a8cc7), to(#2ba1de));
    .header-left{
      margin-left: 20px;
      img{
        position: relative;
        top: 12px;
        padding-right: 10px;
      }
      #title{
        line-height:80px;
        font-size: 24px;
        font-weight: 600;
        color: #fff;
      }
    }
    .header-right{
      margin-right: 28px;
      position: relative;
      top: 24px;
      .username{
        display: inline-block;
        height: 50px;
        color: #fff;
        cursor: pointer;
        &:before{
           position: relative;
           top: 5px;
           content: '';
           display: inline-block;
           width: 22px;
           height: 22px;
           background: url('./user_icon.png')no-repeat;
         }
      }
    }
  }
  .close{
    text-align: right;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    margin-left: 296px;
    margin-top: -40px;
    display: inline-block;
  }
  .hide{
    display: none;
  }
  .addInfoBox{
    position: fixed;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    z-index: 200;
    background: #fff;
    padding: 20px 20px 0;
    border-radius: 8px;
    &:after{
       content:'';
       display: inline-block;
     }
  }
  .showInfo{
    width: 318px;
    height: 322px;
  }
  .changePasswordFlag{
    width: 318px;
    height: 255px;
  }
  .loginOutFlag{
    .loginOutTip{
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
</style>

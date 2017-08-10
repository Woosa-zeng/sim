<template lang="html">
  <div id="sendingInstruction">
    <table>
      <colgroup>
        <col width="110">
        <col width="240">
      </colgroup>
      <tbody>
        <tr>
          <td>
            <div class="col">SIM卡号</div>
          </td>
          <td>
            <div class="col">{{simObj.model.msisdn}}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="msg-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="指令文本" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="submitForm('ruleForm')">立即发送</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    props: {
      simObj: {
        type: Object
      }
    },
    data() {
      return {
        ruleForm: {
          desc: ''
        },
        rules: {
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
            { min: 3, max: 5, message: '不能输入空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        console.log(`desc===${this.ruleForm.desc}`)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/msg/sendMsg', {
              iccid: this.simObj.model.iccid,
              msisdn: this.simObj.model.msisdn,
              content: this.ruleForm.desc
            }).then((res) => {
              res = res.body
              if (res.status === 'ok') {
                this.resetForm('ruleForm')
                this.$message({
                  type: 'success',
                  message: '指令发送成功！'
                })
              } else {
                this.$message.error(res.msg)
              }
            }, res => {
              this.$message.error('error: ' + res)
            })
          } else {
            this.$message.error('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #sendingInstruction{
    table{
      td{
        height:28px;
        line-height: 28px;
        font-size: 14px;
        border: 1px solid #dfe6ec;
      .col{
        margin-left: 10px;
      }
    }
    td:nth-child(odd){
        background: #f5f8fc;
      }
    }
    .msg-box{
      margin-top: 10px;
    }
    #massage{
      border-color:#dfe6ec;
    }
    .send{
      margin-top: 10px;
    }
  }
</style>

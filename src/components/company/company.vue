<template lang="html">
  <div id="company">
    <div id="companyTree">
    	<p class="list-title">
    		<span>公司列表</span>
    		<el-button class="but" type="primary" @click="addCompany">+ 创建分公司</el-button>
    	</p>
      <div class="search-box">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
      </div>
      <div class="tree-box" id="treeBox">
        <el-tree
          class="filter-tree"
          :data="companyData"
          :props="defaultProps"
          default-expand-all
          :filter-node-method="filterNode"
          ref="tree2" @node-click="handleNodeClick">
        </el-tree>
      </div>
    </div>
    <div id="companyDetail">
    	<h3>公司详情</h3>
      <div class="table-box">
        <table>
          <tr>
            <td class="name-td">登录名</td><td>{{companyDetail.username}}</td>
          </tr>
          <tr>
            <td class="name-td">管理员姓名</td><td>{{companyDetail.realname}}</td>
          </tr>
          <tr>
            <td class="name-td">公司全称</td><td>{{companyDetail.fullName}}</td>
          </tr>
          <tr>
            <td class="name-td">公司简称</td><td>{{companyDetail.shortName}}</td>
          </tr>
          <tr>
            <td class="name-td">更新时间</td><td>{{companyDetail.lastUpdateTime_s}}</td>
          </tr>
          <tr>
            <td class="name-td">状态</td><td>{{companyDetail.flag == 1 ? '有效' : '无效'}}</td>
          </tr>
        </table>
      </div>
      <p>
        <el-button type="danger" @click="deleteCompany">删&nbsp;除</el-button>
        <el-button class="but" type="primary" @click="editCompany">修改信息</el-button>
      </p>
    </div>
    <div class="mask" :class="{hide: isActive}"></div>
    <div class="addInfoBox" :class="{hide: isActive}">
      <div class="close" @click="closeMask">x</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="ruleForm.loginName" :disabled="disableFlag"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="managerPassword">
          <el-input v-model="ruleForm.managerPassword" :disabled="disableFlag"></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="managerName">
          <el-input v-model="ruleForm.managerName" :disabled="disableFlag"></el-input>
        </el-form-item>
        <el-form-item label="分公司全称" prop="companyFullName">
        <el-input v-model="ruleForm.companyFullName"></el-input>
      </el-form-item>
        <el-form-item label="分公司简称" prop="companyShortName">
        <el-input v-model="ruleForm.companyShortName"></el-input>
      </el-form-item>
        <el-form-item label="是否有效" prop="flag">
          <el-select v-model="ruleForm.flag" placeholder="请选择是否有效">
            <el-option label="无效" value="0"></el-option>
            <el-option label="有效" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button v-if="disableFlag" type="primary" @click="submitFormChange('ruleForm')">立即修改</el-button>
          <el-button v-else type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        disableFlag: false, // 修改公司信息时不可更改项
        isActive: true,  // 修改公司信息或者添加子公司弹出层
        companyDetail: {}, // 当前公司详情
        filterText: '', // 搜索条件过滤
        companyData: [], // 公司数据树
        defaultProps: { // 公司数据树属性
          children: 'children',
          label: 'shortName'
        },
        currentCompanyProps: { // 当前选择公司属性
          name: '',
          companyId: '',
          simIds: ''
        },
        defaltCompanyId: '',
        clickCompanyId: '',
        ruleForm: { // 表单数据
          loginName: '',
          managerName: '',
          managerPassword: '',
          companyFullName: '',
          companyShortName: '',
          flag: ''
        },
        rules: { // 表单规则
          loginName: [
            { required: true, message: '请输入登录名', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          managerName: [
            { disabled: 'true' },
            { required: true, message: '请输入管理员姓名', trigger: 'blur' },
            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          managerPassword: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          companyFullName: [
            { required: true, message: '请输入公司全称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          companyShortName: [
            { required: true, message: '请输入公司简称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          flag: [
            { required: true, message: '请选择是否有效', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.loadNode()
    },
    mounted() {
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val)
      }
    },
    computed: {
    },
    methods: {
      reRenderCompanyInfoBox(id) {
        this.getOneCompanyInfo(id)
      },
      closeMask() {
        this.isActive = true
      },
      filterNode(value, data) {
        if (!value) return true
        return data.shortName.indexOf(value) !== -1
      },
      handleNodeClick(data) {
        this.currentCompanyProps.name = data.shortName
        this.currentCompanyProps.companyId = data.id
        this.getOneCompanyInfo(this.currentCompanyProps.companyId)
      },
      getOneCompanyInfo(currentCompanyId) {
        // debugger
        this.$http.post('/simcompany/queryById', {
          id: currentCompanyId || this.defaltCompanyId
        }).then((res) => {
          this.companyDetail = res.body
        })
      },
      loadNode() {
        this.$http.get('/simcompany/querySimCompanyTree').then((res) => {
          this.companyData = []
          this.companyData.push(res.body)
          if (!this.clickCompanyId) {
            this.defaltCompanyId = this.companyData[0].id
            this.reRenderCompanyInfoBox(this.defaltCompanyId)
            this.clickCompanyId = this.companyData[0].id
          }
        })
      },
		  addCompany() {
      this.isActive = false
      this.disableFlag = false
      this.resetForm('ruleForm')
		  },
      editCompany() {
        this.isActive = false
        this.disableFlag = true
        this.ruleForm.loginName = this.companyDetail.username
        this.ruleForm.managerName = this.companyDetail.realname
        this.ruleForm.managerPassword = '******'
        this.ruleForm.companyFullName = this.companyDetail.fullName
        this.ruleForm.companyShortName = this.companyDetail.shortName
        this.ruleForm.flag = this.companyDetail.flag === 1 ? '有效' : '无效'
      },
      getDelete() {
        this.$http.post('/simcompany/delSimCompany', {
          id: this.currentCompanyProps.companyId || this.clickCompanyId
        }).then((res) => {
          if (res.body.status === 'ok') {
            this.loadNode()
            this.clickCompanyId = null
            this.$message({
              type: 'success',
              message: res.body.msg
            })
          } else {
            this.$message.error(res.body.msg)
          }
        }, res => {
          this.$message({
            type: 'info',
            message: res
          })
        })
      },
      deleteCompany() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getDelete()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      submitFormChange(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/simcompany/updSimCompany', {
              fullName: this.ruleForm.companyFullName,
              shortName: this.ruleForm.companyShortName,
              flag: this.ruleForm.flag,
              id: this.currentCompanyProps.companyId || this.clickCompanyId,
              adminType: 1,
              parentId: this.companyDetail.parentId
            }).then((res) => {
              res = res.body
              if (res.status === 'ok') {
                this.isActive = true
                this.loadNode()
                this.resetForm('ruleForm')
                this.getOneCompanyInfo(this.currentCompanyProps.companyId)
                this.$message({
                  type: 'success',
                  message: `更新成功`
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/simcompany/addSimCompany', {
              username: this.ruleForm.loginName,
              fullName: this.ruleForm.companyFullName,
              shortName: this.ruleForm.companyShortName,
              realname: this.ruleForm.managerName,
              password: this.ruleForm.managerPassword,
              flag: this.ruleForm.flag,
              adminType: 1,
              parentId: this.currentCompanyProps.companyId || this.defaltCompanyId
            }).then((res) => {
              res = res.body
              if (res.status === 'ok') {
                this.isActive = true
                this.resetForm('ruleForm')
                this.loadNode()
                this.$message({
                  type: 'success',
                  message: `创建成功`
                })
              } else {
                this.$message.error(res.msg)
              }
            }, res => {
              console.log('error: ' + res)
            })
          } else {
            console.log('error submit!!')
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
  #company{
    display: flex;
  }
  #companyTree{
    width: 400px;
    flex: 400px 0 0;
    height:100%;
    .list-title{
      height: 40px;
      line-height: 40px;
      padding: 10px;
      border-bottom: 1px solid #eaeefb;
      .but{
      	float: right;
      }
    }
    .search-box{
      margin: 10px;
    }
    .tree-box{
      margin: 12px;
      max-height: 640px;
      overflow-y: auto;
      .el-tree{
        border: none;
      }
    }
  }
  #companyDetail{
    flex: 1;
    margin: 10px;
    padding-top: 30px;
    text-align: center;
    h3{
      font-size: 18px;
      font-weight: bold;
    }
    .table-box table{
      margin: 10px auto;
      min-width: 600px;
      tr{
        height: 32px;
        line-height: 32px;
      }
      tr:nth-child(odd){
        background: #ebf1fa;
      }
      .name-td{
        border-right: 1px solid #e6e6e6;
      }
    }
    p{
      margin: 0 auto;
      width: 615px;
      .el-button{
        float: right;
        margin-left: 10px;
      }
    }
  }
  .addInfoBox{
    position: fixed;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    z-index: 200;
    background: #fff;
    width: 318px;
    height: 470px;
    padding: 20px;
    border-radius: 8px;
    &:after{
      content:'';
       display: inline-block;
     }
  }
</style>

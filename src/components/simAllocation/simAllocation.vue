<template lang="html">
  <div id="simAllocation">
    <div class="search">
    	<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
		  <el-form-item label="ICCID" prop="iccid">
		    <el-input v-model="formInline.iccid" placeholder="ICCID"></el-input>
		  </el-form-item>
		  <el-form-item label="SIM卡分发时间" prop="daterange">
		    <div class="block">
			    <el-date-picker
			      v-model="formInline.daterange"
			      type="daterange"
			      placeholder="选择日期范围">
			    </el-date-picker>
			</div>
		  </el-form-item>
		  <el-form-item label="gprs状态" prop="gprsStatus">
		    <el-select v-model="formInline.gprsStatus" placeholder="请选择">
			    <el-option
			      v-for="item in gprsStatusOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		  </el-form-item>
		  <el-form-item label="设备状态" prop="deviceStatus">
		    <el-select v-model="formInline.deviceStatus" placeholder="请选择">
			    <el-option
			      v-for="item in deviceStatusOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		  </el-form-item>
		  <el-form-item label="当前卡状态" prop="cardState">
		    <el-select v-model="formInline.cardState" placeholder="请选择">
			    <el-option
			      v-for="item in cardStateOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			</el-select>
		  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="onSubmit">查询</el-button>
		    <el-button @click="resetForm('formInline')">重置</el-button>
		  </el-form-item>
		</el-form>
    </div>
    <div class="list">
      <div class="list-btn">
      	<el-button type="primary" @click="doBatchAllocation" :class="{hide: activeName == 'allocated'}">批量分配</el-button>
      </div>
    	<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
		    <el-tab-pane label="未分配" name="not allocate">
		    	<el-table :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
		    	  <el-table-column fixed type="selection" width="45"></el-table-column>
		    	  <el-table-column v-for="item in tableTitle" :key="item.id" v-if="item.fixed" fixed :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
		    	  <el-table-column v-for="item in tableTitle" :key="item.id" v-if="!item.fixed" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
		    	  <el-table-column fixed="right" label="操作" width="65">
		    	  	<template scope="scope">
				        <el-button type="text" size="small" @click.native.prevent="doAllocation(scope.$index, tableData)">分配</el-button>
				    </template>
		    	  </el-table-column>
			    </el-table>
		    </el-tab-pane>
		    <el-tab-pane label="已分配" name="allocated">
		    	<el-table :data="tableData" style="width: 100%">
		    	  <el-table-column v-for="item in tableTitle" :key="item.id" v-if="item.fixed" fixed :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
		    	  <el-table-column v-for="item in tableTitle" :key="item.id" v-if="!item.fixed" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
		    	  <el-table-column fixed="right" label="操作" width="80">
		    	  	<template scope="scope">
				        <el-button type="text" size="small" @click.native.prevent="doAllocationAgain(scope.$index, tableData)">重新分配</el-button>
				    </template>
		    	  </el-table-column>
			    </el-table>
		    </el-tab-pane>
		</el-tabs>
		<div id="paging">
			<el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page.currentPage"
          :page-size="page.pageSize"
          layout="total, prev, pager, next"
          :total="page.total">
        </el-pagination>
		</div>
    </div>
    <div class="mask" :class="{hide: isActive}"></div>
    <div class="addInfoBox" :class="{hide: isActive}">
      <div class="close" @click="closeMask">x</div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
	    	<div class="tree-box1" id="treeBox">
	        <el-input
					  placeholder="输入关键字进行过滤"
					  v-model="filterText">
					</el-input>

					<el-tree
					  class="filter-tree"
					  :data="data2"
					  :props="defaultProps"
					  default-expand-all
					  :filter-node-method="filterNode"
					  ref="tree2" @node-click="handleNodeClick">
					</el-tree>
	      </div>
	      <div class="search-box">
		      <el-form-item label="已选公司" prop="name" label-width="70px">
				    <el-input v-model="ruleForm.name"></el-input>
				  </el-form-item>
				  <el-form-item style="text-align:center">
				    <el-button type="primary" @click="submitAllocation">提交</el-button>
				  </el-form-item>
			  </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
		 	tableTitle: [
				// {prop: 'id', label: 'id'},
				{prop: 'msisdn', label: 'MSISDN号', width: 140, fixed: true},
				{prop: 'iccid', label: 'ICCID', width: 200, fixed: true},
				{prop: 'distributeTime', label: 'SIM卡分发时间', width: 150, fixed: true},
				{prop: 'gprsStatus', label: 'gprs状态', width: 95, fixed: true},
				{prop: 'deviceStatus', label: '设备状态', width: 95, fixed: true},
				{prop: 'cardState', label: '当前卡状态', width: 110, fixed: true},
				{prop: 'serviceStartDate', label: '服务开始时间', width: 150},
				{prop: 'serviceEndDate', label: '服务结束时间', width: 150},
				{prop: 'activationTime', label: '激活时间', width: 150},
				{prop: 'flowCycle', label: '套餐周期（月）', width: 135},
				// {prop: 'totalFlow', label: '流量消耗（M）', width: 135},
				{prop: 'totalFlow', label: '总流量（M）', width: 135},
				{prop: 'usedFlow', label: '已使用流量（M）', width: 150},
				{prop: 'createTime', label: '数据创建时间', width: 150},
				{prop: 'lastUpdateTime', label: '数据最后更新时间', width: 150}
		 	],
    	tableData: [{
      id: '1',
      msisdn: '1',
      iccid: '1',
      serviceStartDate: '1',
      serviceEndDate: '11',
      distributeTime: '',
      activationTime: '1',
      flowCycle: '1',
      totalFlow: '1',
      usedFlow: '1',
      gprsStatus: '1',
      deviceStatus: '1',
      cardState: '1',
      createTime: '1',
      lastUpdateTime: '1'
    }],
      gprsStatusOptions: [{
        value: '00',
        label: '离线'
      }, {
        value: '01',
        label: '在线'
      }, {
        value: '02',
        label: '未知'
      }
      ],
      deviceStatusOptions: [{
        value: '0',
        label: '关机'
      }, {
        value: '1',
        label: '开机'
      }, {
        value: '2',
        label: '未知'
      }
      ],
      cardStateOptions: [{
        value: '00',
        label: '正常'
      }, {
        value: '01',
        label: '未知'
      }, {
        value: '02',
        label: '停机'
      }, {
        value: '07',
        label: '待激活'
      }
      ],
      formInline: {
        iccid: '',
        daterange: '',
        beginDistributeTime: '', // SIM卡分发开始时间
        endDistributeTime: '', // SIM卡分发结束时间
        gprsStatus: '', // gprs状态 00：离线，01:在线，02:未知
        deviceStatus: '', // 设备状态 0：关机 1：开机  2：未知
        cardState: '' // 当前卡状态（00：正常 01 未知 02 停机 07 待激活）
      },
      activeName: 'not allocate',
      page: {
      	currentPage: 1,
      	total: 20,
      	pageSize: 10
      },
      ruleForm: {
      	name: '',
      	companyId: '',
        simIds: ''
      },
      isActive: true,
      companyName: '',
      multipleSelection: [],
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'shortName'
      }
    }
  },
  created() {
    this.loadList({pageNum: this.page.currentPage, pageSize: this.page.pageSize, bindState: 0})
    this.getCompanyTree()
  },
  methods: {
  	setParams(currentPage) {
  		console.log(this.formInline.daterange)
  		if (this.formInline.daterange && this.formInline.daterange[0]) {
  			this.formInline.beginDistributeTime = this.formInline.daterange[0].toLocaleDateString()
  			this.formInline.endDistributeTime = this.formInline.daterange[1].toLocaleDateString()
  		} else {
  			this.formInline.beginDistributeTime = ''
  			this.formInline.endDistributeTime = ''
  		}
  		console.log(this.formInline.beginDistributeTime)
  		console.log(this.formInline.endDistributeTime)
  		let params = {
		    iccid: this.formInline.iccid,
		    beginDistributeTime: this.formInline.beginDistributeTime,
		    endDistributeTime: this.formInline.endDistributeTime,
		    gprsStatus: this.formInline.gprsStatus,
		    deviceStatus: this.formInline.deviceStatus,
		    cardState: this.formInline.cardState,
		    pageNum: currentPage || this.page.currentPage,
		    pageSize: this.page.pageSize
		  }
		  	if (this.activeName === 'not allocate') {
		    	params.bindState = 0
		  }
		  	if (this.activeName === 'allocated') {
		  	params.bindState = 1
		  }
		  return params
  },
    loadList(params) {
		  	this.$http.post('/simBaseInfo/queryall', params).then((res) => {
		  	  let response = res.body
		    if (response.success) {
		      	let data = response.obj
		      	console.log(data)
		      	this.page.currentPage = data.pageNum === 0 ? 1 : data.pageNum
		      	this.page.pageSize = data.pageSize
		      	this.page.total = data.total
		      	this.tableData = data.list
		    } else {
		      if (response.code === -100) { // 登录超时，跳转到登录页面
		        window.localStorage.removeItem('userName')
		        this.$store.commit('ROUTE_CHANGE', {activeRoute: 'login'})
		        this.$router.push({name: 'login'})
		      } else {
		        self.$notify.error({
		          title: '错误',
		          message: response.msg
		        })
		      }
		    }
		  })
    },
    onSubmit() {
      this.loadList(this.setParams(1))
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.formInline.daterange = ''
    },
    handleClick(tab, event) {
    	this.$refs['formInline'].resetFields()
    	this.formInline.daterange = ''
      this.loadList(this.setParams(1))
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
    	this.loadList(this.setParams(val))
    },
    closeMask() {
      this.isActive = true
    },
    handleNodeClick(data) {
      this.ruleForm.name = data.shortName
      this.ruleForm.companyId = data.id
    },
    submitAllocation() {
    	this.$confirm('是否确认提交分配?', '提示', {
		    confirmButtonText: '确定',
		    cancelButtonText: '取消',
		    type: 'warning'
		  }).then(() => {
		  	this.$http.post('/simBaseInfo/allocationSimCar', {ids: this.ruleForm.simIds, companyId: this.ruleForm.companyId}).then((res) => {
	        if (res.body.success) {
	        	this.$message({
				      type: 'success',
				      message: '分配成功!'
				    })
				    this.loadList(this.setParams())
				    this.isActive = true
	        }
	      }, res => {
	        console.log('error: ' + res)
	      })
		  }).catch(() => {
		    this.$message({
		      type: 'info',
		      message: '已取消提交'
		    })
		  })
    },
    doAllocation(index, rows) {
    	this.ruleForm.simIds = rows[index].id
    	this.isActive = false
    },
    doAllocationAgain(index, rows) {
    	this.ruleForm.simIds = rows[index].id
    	this.ruleForm.companyId = rows[index].companyId
    	this.ruleForm.name = rows[index].shortName
    	this.isActive = false
    },
    handleSelectionChange(val) {
    	this.multipleSelection = val
    	let arr = []
  		val.forEach(function(value, index, array) {
  			arr.push(value.id)
  		})
  		this.ruleForm.simIds = arr.join(',')
  		console.log(this.ruleForm.simIds)
    },
    doBatchAllocation() {
    	if (!this.multipleSelection || this.multipleSelection.length === 0) {
    		this.$message({
    			message: '请选择需要分配的sim卡',
    			type: 'warning'
    		})
    		return
    	}
    	this.isActive = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.shortName.indexOf(value) !== -1
    },
    getCompanyTree() {
    	this.$http.get('/simcompany/querySimCompanyTree').then((res) => {
    		this.data2 = []
    		this.data2.push(res.body)
    		console.log(this.data2)
    })
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
	#simAllocation{
		padding: 10px;
		.list{
			position: relative;
			.list-btn{
				position: absolute;
				right: 0;
				top: 0;
				z-index: 200;
			}
			.el-table, .el-table th{
				text-align: center;
			}
		}
		#paging{
	    text-align: right;
	    margin: 20px;
	  }
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
	  width: 318px;
	  height: 470px;
	  padding: 20px;
	  border-radius: 8px;
	  &:after{
	    content:'';
	     display: inline-block;
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
  .tree-box1{
  	max-height: 330px;
  	overflow-y: auto;
  	margin: 10px 0;
    .el-tree{
	    border: none;
	  }
  }
</style>

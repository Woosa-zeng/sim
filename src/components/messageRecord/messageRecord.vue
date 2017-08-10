<template lang="html">
 <div id="messageRecord">
   <el-table
     :data="tableData"
     border
     style="width: 100%">
     <el-table-column
       label="信息状态"
       width="180">
       <template scope="scope">
         <div v-if="scope.row.sendStatus" class="green">发送成功</div>
         <div v-else class="red">发送失败</div>
       </template>
     </el-table-column>
     <el-table-column
       label="发送时间"
       width="220">
       <template scope="scope">
         <el-icon name="time"></el-icon>
         <span style="margin-left: 10px">{{ scope.row.createOn }}</span>
       </template>
     </el-table-column>
     <el-table-column label="发送内容">
       <template scope="scope">
         <div>{{ scope.row.content }}</div>
       </template>
     </el-table-column>
   </el-table>
   <div id="paging">
     <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page.sync="currentPage"
       :page-size="pageSize"
       layout="total, prev, pager, next"
       :total="totalPages">
     </el-pagination>
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
        currentPage: 1,
        pageSize: 5,
        totalPages: null,
        tableData: []
      }
    },
    watch: {
      simObj() {
        this.getMsgData()
      }
    },
    methods: {
      getMsgData() {
        this.$http.post('/msg/queryByPage', {
          pageNum: 1,
          pageSize: this.pageSize,
          msisdn: this.simObj.model.msisdn
        }).then((res) => {
          res = res.body
          this.tableData = res.obj.list
          this.totalPages = res.obj.total
        }, res => {
          this.$message.error('error: ' + res)
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.$http.post('/msg/queryByPage', {
          iccid: this.simObj.model.msisdn,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }).then((res) => {
          res = res.body
          this.tableData = res.obj.list
        }, (res) => {
          this.$message.error(res)
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
#messageRecord{
  .blue{
    color:#20A0FF;
  }
  .green{
    color: #13CE66;
  }
  .red{
    color: #FF4949;
  }
  #paging{
    margin-top: 10px;
  }
  table{
    tr:nth-child(odd){
      background: #f5f8fc;
    }
    th{
      background: #f2f5fa;
    }
    td,th{
      height:28px;
      line-height: 28px;
      font-size: 14px;
      text-align: center;
      border: 1px solid #dfe6ec;
    }
  }
}
</style>

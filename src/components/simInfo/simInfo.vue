<template lang="html">
  <div id="simInfo">
    <div class="base-info">
      <h2 class="bbn">基本信息</h2>
      <table>
        <colgroup>
          <col width="180">
          <col width="35%">
          <col width="180">
          <col width="35%">
        </colgroup>
        <tbody>
        <tr>
          <td>
            <div class="col">SIM卡号</div>
          </td>
          <td>
            <div class="col">{{simObj.model.msisdn}}</div>
          </td>
          <td>
            <div class="col">ICCID</div>
          </td>
          <td>
            <div class="col">{{simObj.model.iccid}}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="col">总流量(单位M)</div>
          </td>
          <td colspan="3">
            <div class="col">{{simObj.model.usedFlow}}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="state-info mt20">
      <h2 class="bbn">状态信息</h2>
      <table>
        <colgroup>
          <col width="180">
          <col width="35%">
          <col width="180">
          <col width="35%">
        </colgroup>
        <tbody>
          <tr>
          <td>
            <div class="col">SIM卡状态</div>
          </td>
          <td>
            <div class="col">{{simObj.model.cardState}}</div>
          </td>
          <td>
            <div class="col">短信总数</div>
          </td>
          <td>
            <div class="col">{{simObj.message.msgCount}}</div>
          </td>
        </tr>
          <tr>
            <td>
              <div class="col">已使用流量</div>
            </td>
            <td>
              <div class="col">{{simObj.model.usedFlow}}</div>
            </td>
            <td>
              <div class="col">短信发送率</div>
            </td>
            <td>
              <div class="col">{{simObj.message.msgRate}}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="col">服务开始时间</div>
            </td>
            <td>
              <div class="col">{{simObj.model.serviceStartDate}}</div>
            </td>
            <td>
              <div class="col">服务结束时间</div>
            </td>
            <td>
              <div class="col">{{simObj.model.serviceEndDate}}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="col">注册时间</div>
            </td>
            <td>
              <div class="col">{{simObj.model.registTime}}</div>
            </td>
            <td>
              <div class="col">SIM卡分发时间</div>
            </td>
            <td>
              <div class="col">{{simObj.model.distributeTime}}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="col">SIM卡激活时间</div>
            </td>
            <td>
              <div class="col">{{simObj.model.activationTime}}</div>
            </td>
            <td>
              <div class="col">最后更新时间</div>
            </td>
            <td>
              <div class="col">{{simObj.model.lastUpdateTime}}</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="col">
                <a @click="changeEqStatus">设备状态</a>
              </div>
            </td>
            <td>
              <div class="col" :class="deviceColor">{{simObj.model.deviceStatus}}</div>
            </td>
            <td>
              <div class="col">
                <a @click="changeGPRSStatus">GPRS状态</a>
              </div>
            </td>
            <td>
              <div class="col" :class="gprsColor">{{simObj.model.gprsStatus}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="note-info mt20">
      <h2>备注信息</h2>
      <p>{{simObj.model.remark}}</p>
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
    watch: {
      simObj() {
        this.setDeviceColor(this.simObj.model.deviceStatus)
        this.setGPRSColor(this.simObj.model.gprsStatus)
      }
    },
    data() {
      return {
        deviceColor: '',
        gprsColor: ''
      }
    },
    methods: {
      setDeviceColor(status) {
        switch (status) {
          case '关机':
            this.deviceColor = 'red'
            break
          case '开机':
            this.deviceColor = 'green'
            break
          case '未知':
            this.deviceColor = 'gray'
            break
        }
      },
      setGPRSColor(status) {
        switch (status) {
          case '暂停':
            this.gprsColor = 'blue'
            break
          case '正常':
            this.gprsColor = 'green'
            break
          case '未知':
            this.gprsColor = 'gray'
            break
        }
      },
      changeEqStatus() {
        this.$http.post('/simBaseInfo/deviceStatusInfo', {
          iccid: this.simObj.model.iccid
        }).then((res) => {
          this.simObj.model.deviceStatus = res.body.obj
          this.setDeviceColor(res.body.obj)
        })
      },
      changeGPRSStatus() {
        this.$http.post('/simBaseInfo/gprsStatusInfo', {
          iccid: this.simObj.model.iccid
        }).then((res) => {
          this.simObj.model.gprsStatus = res.body.obj
          this.setGPRSColor(res.body.obj)
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #simInfo{
    color: #1f2d3d;
    .mt20{
      margin-top: 20px;
    }
    .gray,.green,.red{
      display: inline-block;
      width: 58px;
      height:22px;
      line-height:22px;
      border-radius: 3px;
      text-align: center;
      color: #fff;
    }
    .gray{
      background: #aaa;
    }
    .green{
      background: #33cc33;
    }
    .red{
      background: #ff3333;
    }
    .note-info p{
      padding: 18px;
      line-height: 22px;
      font-size: 14px;
      border: 1px solid #dfe6ec;
    }
    h2{
      height:28px;
      padding-left: 10px;
      line-height:28px;
      font-size: 14px;
      font-weight: bold;
      color: #1f2d3d;
      border: 1px solid #dfe6ec;
      border-bottom: none;
    }
    table{
      td{
        height:28px;
        line-height: 28px;
        font-size: 14px;
        border: 1px solid #dfe6ec;
        .col{
          margin-left: 10px;
        }
        a{
          color: #20a0ff;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      td:nth-child(odd){
        background: #f5f8fc;
      }
    }
  }
</style>

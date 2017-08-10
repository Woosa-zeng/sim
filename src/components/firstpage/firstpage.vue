<template lang="html">
  <div id="firstpage">
    <ul id="chart-wrap">
      <li class="chart-items">
        <div class="charts" id="stateChart" :style="{width: '400px', height: '400px'}"></div>
      </li>
      <li class="chart-items">
        <div class="charts" id="alertChart" :style="{width: '400px', height: '400px'}"></div>
      </li>
      <li class="chart-items">
        <div class="charts" id="excessChart" :style="{width: '400px', height: '400px'}"></div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
    mounted() {
      this.setStateChart()
      this.setAlertChart()
      this.setExcessChart()
    },
    methods: {
      httpGet(url, callback) {
        let self = this
        self.$http.get(url).then((response) => {
          response = response.body
          if (response.success) {
            callback(response.obj)
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
      createPieChart(pieChart) {
        let stateChart = this.$echarts.init(document.getElementById(pieChart.id))
        stateChart.setOption({
          title: {
            text: pieChart.title,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} <br/> {d}%'
          },
          legend: {
            orient: 'horizontal',
            bottom: 'bottom',
            data: pieChart.legendData
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: pieChart.seriesData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },
      setStateChart() {
        let self = this
        self.httpGet('/simStatusReport', (data) => {
          let stateChart = {
            id: 'stateChart',
            title: 'sim卡状态',
            legendData: ['启用', '未知', '停机', '销号', '待激活', '已激活'],
            seriesData: [{value: data.countEnable, name: '启用'},
            {value: data.countUnknown, name: '未知'},
            {value: data.countDisable, name: '停机'},
            {value: data.countCancel, name: '销号'},
            {value: data.countSilence, name: '待激活'},
            {value: data.activityCount, name: '已激活'}]
          }
          self.createPieChart(stateChart)
        })
      },
      setAlertChart() {
        let self = this
        self.httpGet('/simWaringReport', (data) => {
          let alertChart = {
            id: 'alertChart',
            title: 'sim卡流量',
            legendData: ['警告', '超量', '正常'],
            seriesData: [{value: data.countWarn, name: '警告'},
            {value: data.countExceed, name: '超量'},
            {value: data.countunWarn, name: '正常'}]
          }
          self.createPieChart(alertChart)
        })
      },
      setExcessChart() {
        let self = this
        self.httpGet('/simMessageRecord', (data) => {
          let excessChart = {
            id: 'excessChart',
            title: 'sim卡短信',
            legendData: ['短信发送数', '短信总数', '短信超出数'],
            seriesData: [{value: data.messageCount, name: '短信发送数'},
            {value: data.messageTotal, name: '短信总数'},
            {value: data.messageExceed, name: '短信超出数'}]
          }
          self.createPieChart(excessChart)
        })
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #firstpage{
    margin-top: 20px;
  }
  #chart-wrap{
    display: flex;
  .chart-items{
    flex: 1;
  .charts{
    margin: 0 auto;
  }
  }
  }
</style>

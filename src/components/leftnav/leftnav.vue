<template lang="html">
  <div id="leftNav">
    <ul>
      <li><p @click="doAction(0)"
             :class="{'isActive': isActive[0]}">
        <span class="leftico1 leftico"></span>首页</p>
      </li>
      <li><p @click="doAction(1)"
             :class="{'isActive': isActive[1]}">
        <span class="leftico2 leftico"></span>全部</p>
      </li>
      <li><p @click="doAction(2)"
             :class="{'isActive': isActive[2]}">
        <span class="leftico3 leftico"></span>沉默</p>
      </li>
      <li><p @click="doAction(3)"
            :class="{'isActive': isActive[3]}">
        <span class="leftico4 leftico"></span>启用</p>
      </li>
      <li><p @click="doAction(4)"
          :class="{'isActive': isActive[4]}">
        <span class="leftico5 leftico"></span>阈值预警</p>
      </li>
      <li><p @click="doAction(5)"
             :class="{'isActive': isActive[5]}">
        <span class="leftico6 leftico"></span>超量告警</p>
      </li>
      <!--<li><p @click="doAction(6)"-->
             <!--:class="{'isActive': isActive[6]}">-->
        <!--<span class="leftico7 leftico"></span>次月停机</p>-->
      <!--</li>-->
      <li><p @click="doAction(7)"
             :class="{'isActive': isActive[7]}">
        <span class="leftico8 leftico"></span>停机</p>
      </li>
      <li><p @click="doAction(8)"
             :class="{'isActive': isActive[8]}">
        <span class="leftico9 leftico"></span>公司管理</p>
      </li>
      <li><p @click="doAction(9)"
             :class="{'isActive': isActive[9]}">
        <span class="leftico9 leftico"></span>SIM卡分配</p>
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        isActive: [true, false, false]
      }
    },
    mounted() {
      this.setActiveNav()
    },
    computed: {
      activeRoute() {
        return this.$store.state.activeRoute
      }
    },
    methods: {
      doAction(index) {
        this.go(index)
        this.$store.commit('ROUTE_CHANGE', {activeRoute: this.$route.name})
        this.setActiveNav()
      },
      go(index) {
        switch (index) {
          case 0:
            this.$router.push({name: 'firstpage'})
            break
          case 1:
            this.$router.push({name: 'allsim'})
            break
          case 2:
            this.$router.push({name: 'silence'})
            break
          case 3:
            this.$router.push({name: 'enable'}) // 首页
            break
          case 4:
            this.$router.push({name: 'thresholdWarning'})
            break
          case 5:
            this.$router.push({name: 'excessAlarm'})
            break
          case 7:
            this.$router.push({name: 'stop'})
            break
          case 8:
            this.$router.push({name: 'company'})
            break
          case 9:
            this.$router.push({name: 'simAllocation'})
            break
        }
      },
      setActiveNav: function() {
        console.log(this.activeRoute)
        /* 根据路由显示当前导航按钮 */
        let mapRoute = {
          'firstpage': 0,
          'allsim': 1,
          'silence': 2,
          'enable': 3,
          'thresholdWarning': 4,
          'excessAlarm': 5,
          'stop': 7,
          'company': 8,
          'simAllocation': 9
        }
        this.isActive = [false, false, false, false, false, false, false, false]
        this.isActive[mapRoute[this.activeRoute]] = true
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
#leftNav{
  position: fixed;
  margin-top: 80px;
  width: 120px;
  height: 100%;
  background: #eef1f6;
  li{
    box-sizing: border-box;
    height: 40px;
    p{
      line-height:40px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      .leftico{
        width:16px;
        height:16px;
        margin:0 6px 0 16px;
      }
      .leftico(@n, @i: 1) when (@i =< @n) {
        @url:'./no_active_@{i}.png?__sprite?__inline';
        &.leftico@{i} {
          background:url(@url) left center no-repeat;
          background-size: contain;
          padding-left:16px;
        }
        .leftico(@n, (@i + 1));
      }
      span{
      .leftico(9);
      }
    }
    p.isActive{
      background: #c5dbe5;
      .leftico(@n, @i: 1) when (@i =< @n) {
        @url:'./active_@{i}.png?__sprite?__inline';
      &.leftico@{i} {
        background:url(@url) left center no-repeat;
        background-size: contain;
        padding-left:16px;
      }
        .leftico(@n, (@i + 1));
      }
      span{
      .leftico(9);
      }
    }
  }
}
</style>

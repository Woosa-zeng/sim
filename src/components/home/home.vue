<template lang="html">
  <div id="homepage">
    <vheader></vheader>
    <leftnav></leftnav>
    <div id="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import firstpage from '../firstpage/firstpage'
  import leftnav from '../leftnav/leftnav'
  import vheader from '../header/header'
  export default{
    components: {
      firstpage,
      leftnav,
      vheader
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  #content{
    margin-left:120px;
    padding-top: 80px;
  }
</style>

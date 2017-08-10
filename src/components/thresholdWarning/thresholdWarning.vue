<template lang="html">
  <div id="thresholdWarning">
    <contentc :parentObj="simTypeObj"></contentc>
  </div>
</template>
<script type="text/ecmascript-6">
  import contentc from '../content/content'
  export default{
    data() {
      return {
        simTypeObj: {
          simType: 'warn',
          pageNum: 1
        }
      }
    },
    methods: {
    },
    components: {
      contentc
    }
  }
</script>
<style lang="less" rel="stylesheet/less">

</style>

<template lang="html">
  <div id="allSIM">
    <contentc :parentObj="simTypeObj"></contentc>
  </div>
</template>
<script>
  import contentc from '../content/content'
  export default{
    data() {
      return {
        simTypeObj: {
          simType: '',
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

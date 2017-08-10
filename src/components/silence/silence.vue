<template lang="html">
  <div id="silence">
    <contentc :parentObj="simTypeObj"></contentc>
  </div>
</template>
<script type="text/ecmascript-6">
  import contentc from '../content/content'
  export default{
    data() {
      return {
        simTypeObj: {
          simType: 'silence',
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

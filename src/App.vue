<template>
  <div id="app">
    <!--<router-link to="/hello">Go to Foo</router-link>-->
    <router-view></router-view>
  </div>
</template>

<script>
  import home from './components/home/home'
  // const $server = 'http://sim.zuchezaixian.net'
  export default {
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      toLogin() {
        this.$http.post('/login', {
          username: 'admin',
          password: 'admin'
        }).then((response) => {

        })
      }
    },
    components: {
      home
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
#app {
  font-family: "PingFang SC",Arial,sans-serif;
}
</style>

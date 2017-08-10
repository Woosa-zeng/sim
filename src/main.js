// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import resource from 'vue-resource'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import store from './store/store'
import 'element-ui/lib/theme-default/index.css'

Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.use(resource)

Vue.http.options.emulateJSON = true
Vue.http.options.emulateHTTP = true
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  resource,
  store,
  template: '<App/>',
  components: { App }
})

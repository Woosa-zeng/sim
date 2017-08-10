import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/home'
import Login from '@/components/login/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'firstpage',
          name: 'firstpage',
          component: require('../components/firstpage/firstpage.vue')
        },
        {
          path: 'allsim',
          name: 'allsim',
          component: require('../components/allSim/allSim.vue')
        },
        {
          path: 'silence',
          name: 'silence',
          component: require('../components/silence/silence.vue')
        },
        {
          path: 'enable',
          name: 'enable',
          component: require('../components/enable/enable.vue')
        },
        {
          path: 'thresholdWarning',
          name: 'thresholdWarning',
          component: require('../components/thresholdWarning/thresholdWarning.vue')
        },
        {
          path: 'excessAlarm',
          name: 'excessAlarm',
          component: require('../components/excessAlarm/excessAlarm.vue')
        },
        {
          path: 'stop',
          name: 'stop',
          component: require('../components/stop/stop.vue')
        },
        {
          path: 'company',
          name: 'company',
          component: require('../components/company/company.vue')
        },
        {
          path: 'simAllocation',
          name: 'simAllocation',
          component: require('../components/simAllocation/simAllocation.vue')
        }
      ]
    }
  ]
})

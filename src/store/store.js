import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    loginFlag: false,
    // activeRoute: 'firstpage'
    activeRoute: window.localStorage.getItem('activeRoute') || 'firstpage'
  },
  mutations: {
    [types.ROUTE_CHANGE](state, payload) {
      state.activeRoute = payload.activeRoute
      window.localStorage.setItem('activeRoute', payload.activeRoute)
    },
    [types.LOGIN_FLAG](state, payload) {
      state.loginFlag = payload.loginFlag
    }
  }
})

export default store

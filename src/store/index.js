import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {}
  },
  getters: {
  },
  mutations: {
    updataToken (state, newToken) {
      state.token = newToken
    },
    updataUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
    async  initUserInfo (store) {
      const { data } = await getUserInfoAPI()
      if (data.code === 0) {
        store.commit('updataUserInfo', data.data)
      }
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState()
  ]
})

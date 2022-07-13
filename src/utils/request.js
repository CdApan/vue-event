import Theaxios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const axios = Theaxios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net',
  timeout: 10000
})
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response.status === 401) {
    store.commit('updataToken', '')
    store.commit('updataUserInfo', {})
    Message.error('用户身份已过期')
    router.replace('/login')
  }
  return Promise.reject(error)
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => axios({
  url,
  method,
  params,
  data,
  headers
})

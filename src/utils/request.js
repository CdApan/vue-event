import Theaxios from 'axios'

const axios = Theaxios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net',
  timeout: 10000
})

export default ({ url, method = 'GET', params = {}, data = {}, headers = {} }) => axios({
  url,
  method,
  params,
  data,
  headers
})

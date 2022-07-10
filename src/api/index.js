import axios from '@/utils/request'

// 注册接口
export const registerAPI = (Obj) => axios({
  url: '/api/reg',
  method: 'POST',
  data: Obj
})

// 登录接口
export const loginAPI = ({ username, password }) => axios({
  url: '/api/login',
  method: 'POST',
  data: {
    username,
    password
  }
})

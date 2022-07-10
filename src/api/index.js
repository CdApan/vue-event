import axios from '@/utils/request'

// 登录接口
export const registerAPI = () => axios({
  url: '/api/reg',
  method: 'POST',
  data: {
    username: 'lidongxu',
    password: '111111',
    repassword: '111111'
  }
})

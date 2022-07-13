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

// 获取用户信息
export const getUserInfoAPI = () => axios({
  url: '/my/userinfo'
})

// 获取侧边栏数据

export const getMenuListFn = () => axios({
  url: '/my/menus'
})

// 提交修改资料

export const updataUserInfoAPI = ({ id, username, nickname, email, user_pic }) => axios({
  url: '/my/userinfo',
  method: 'PUT',
  data: {
    id,
    username,
    nickname,
    email,
    user_pic
  }
})

// 更新用户头像

export const userAvatarAPI = (avatar) => axios({
  url: '/my/update/avatar',
  method: 'PATCH',
  data: {
    avatar
  }
})

// 修改密码

export const updataPwdAPI = (obj) => axios({
  url: '/my/updatepwd',
  method: 'PATCH',
  data: obj
})

// 获取文章分类

export const getArtCateListAPI = () => axios({
  url: '/my/cate/list'
})

// 添加文章分类

export const addArtCateListAPI = (obj) => axios({
  url: '/my/cate/add',
  method: 'POST',
  data: obj
})

// 修改文章分类

export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => axios({
  url: '/my/cate/info',
  method: 'PUT',
  data: {
    id,
    cate_name,
    cate_alias
  }
})

// 删除修改文章

export const dellArtCateAPI = (id) => axios({
  url: '/my/cate/del',
  method: 'DELETE',
  params: {
    id
  }
})

// 新增文章

export const uploadArticleAPI = (fd) => axios({
  url: '/my/article/add',
  method: 'POST',
  data: fd
})

// 获取文章列表

export const getartListAPI = ({ pagenum, pagesize, cate_id, state }) => axios({
  url: '/my/article/list',
  params: {
    pagenum,
    pagesize,
    cate_id,
    state
  }
})

// 获取文章详情

export const getxqAPI = (id) => axios({
  url: '/my/article/info',
  params: {
    id
  }
})

// 删除文章
export const removeAPI = (id) => axios({
  url: '/my/article/info',
  method: 'DELETE',
  params: {
    id
  }
})

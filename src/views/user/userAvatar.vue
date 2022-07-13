 <template>
     <el-card class="box-card">
       <div slot="header" class="clearfix">
         <span>更换头像</span>
       </div>
       <div>
         <!-- 图片，用来展示用户选择的头像 -->
         <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
         <img v-else class="the_img" :src="avatar" alt="" />

         <!-- 按钮区域 -->
         <div class="btn-box">
           <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
           <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
           <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="updataAvatar">上传头像</el-button>
         </div>
       </div>
     </el-card>
   </template>

<script>
import { userAvatarAPI } from '@/api'

export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg () {
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
      const files = e.target.files
      if (files.lengtn === 0) {
        // 窗口打开但未选择图片
      } else {
        const fs = new FileReader()
        fs.readAsDataURL(files[0])
        fs.onload = e => {
          this.avatar = e.target.result
        }
      }
    },
    async updataAvatar () {
      const { data } = await userAvatarAPI(this.avatar)
      if (data.code !== 0) return this.$message.error(data.message)
      this.$message.success(data.message)
      this.$store.dispatch('initUserInfo')
      this.avatar = ''
    }
  }
}
</script>

   <style lang="less" scoped>
   .btn-box {
     margin-top: 10px;
   }
   .preview {
     object-fit: cover;
   }
   .the_img{
       width: 350px;
       height: 350px;
   }
   </style>

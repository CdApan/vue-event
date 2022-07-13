<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option v-for="obj in fenleiList" :label="obj.cate_name" :key="obj.id" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="shaixuanFn">筛选</el-button>
            <el-button type="info" size="small" @click="zongzhiFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="shouwDialog"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
   <el-table :data="wenzhangList" style="width: 100%;" border stripe>
     <el-table-column label="文章标题" prop="title">
<template v-slot="scope">
<el-link type="primary" @click="xq(scope.row.id)">{{ scope.row.title }}</el-link>
</template>
     </el-table-column>
     <el-table-column label="分类" prop="cate_name"></el-table-column>
     <el-table-column label="发表时间" prop="pub_date">
<template v-slot="scope">
  <span>{{ $formatDate(scope.row.pub_date) }}</span>
</template>

     </el-table-column>
     <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
     <template v-slot="{ row }">
       <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
     </template>
   </el-table-column>
   </el-table>
      <!-- 分页区域 -->
        <el-pagination
     @size-change="handleSizeChangeFn"
     @current-change="handleCurrentChangeFn"
     :current-page.sync="q.pagenum"
     :page-sizes="[2, 3, 5, 10]"
     :page-size.sync="q.pagesize"
     layout="total, sizes, prev, pager, next, jumper"
     :total="total"
   ></el-pagination>
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="closeFn"
    >
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option v-for="obj in fenleiList" :label="obj.cate_name" :key="obj.id" :value="obj.id"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor @blur="wenzhangFn" class="ql-editor" v-model="pubForm.content"></quill-editor>
        </el-form-item>
         <el-form-item label="文章封面" prop="cover_img">
     <!-- 用来显示封面的图片 -->
     <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
     <br />
     <!-- 文件选择框，默认被隐藏 -->
     <input type="file" @change="coverFn" style="display: none;" accept="image/*" ref="iptFileRef" />
     <!-- 选择封面的按钮 -->
     <el-button type="text" @click="xuanzetupianFn">+ 选择封面</el-button>
   </el-form-item>
    <el-form-item>
       <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
       <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
   </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
     <h1 class="title">{{ artDetail.title }}</h1>

     <div class="info">
       <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
       <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
       <span>所属分类：{{ artDetail.cate_name }}</span>
       <span>状态：{{ artDetail.state }}</span>
     </div>

     <!-- 分割线 -->
     <el-divider></el-divider>

     <!-- 文章的封面 -->
     <img v-if="artDetail.cover_img" :src=" 'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img" alt="" />

     <!-- 文章的详情 -->
     <div v-html="artDetail.content" class="detail-box"></div>
   </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getartListAPI, getxqAPI, removeAPI } from '@/api'
import imgurl from '../../assets/images/cover.jpg'

export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      total: 0,
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏
      detailVisible: false,
      artDetail: {},
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '',
        cover_img: '',
        state: ''
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '文章标题的长度为1-30个字符',
            trigger: 'blur'
          }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        content: [{ required: true, message: '请输入文章内容', trigger: 'change' }],
        cover_img: [{ required: true, message: '请选择封面', trigger: 'blur' }]
      },
      fenleiList: [],
      wenzhangList: []
    }
  },
  async created () {
    const res = await getArtCateListAPI()
    this.fenleiList = res.data.data
    this.getList()
  },
  methods: {
    shouwDialog () {
      this.pubDialogVisible = true
    },
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm(
        '此操作将导致文章信息丢失, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    xuanzetupianFn () {
      this.$refs.iptFileRef.click()
    },
    coverFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', imgurl)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    pubArticleFn (str) {
      this.pubForm.state = str
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data } = await uploadArticleAPI(fd)
          if (data.code !== 0) return this.$message.error(data.message)
          this.$message.success(data.message)
          this.pubDialogVisible = false
          this.getList()
        } else {
          return false
        }
      })
    },
    wenzhangFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    closeFn () {
      this.$refs.pubFormRef.resetFields()
      this.$refs.imgRef.setAttribute('src', imgurl)
    },
    async getList () {
      const { data } = await getartListAPI(this.q)
      this.wenzhangList = data.data
      this.total = data.total
    },
    handleSizeChangeFn (sizes) {
      this.getList()
    },
    handleCurrentChangeFn (nowPage) {
      this.getList()
    },
    shaixuanFn () {
      this.getList()
    },
    zongzhiFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''
      this.getList()
    },
    async xq (id) {
      const res = await getxqAPI(id)
      this.detailVisible = true
      this.artDetail = res.data.data
    },
    async removeFn (id) {
      const { data } = await removeAPI(id)
      if (data.code !== 0) return this.$message.error(data.message)
      this.$message.success(data.message)
      if (this.wenzhangList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }

      this.getList()
    }
  }
}
</script>

   <style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
  ::v-deep .ql-editor {
     min-height: 300px;
   }
      .cover-img {
     width: 400px;
     height: 280px;
     object-fit: cover;
   }
    .el-pagination {
     margin-top: 15px;
   }
      .title {
     font-size: 24px;
     text-align: center;
     font-weight: normal;
     color: #000;
     margin: 0 0 10px 0;
   }

   .info {
     font-size: 12px;
     span {
       margin-right: 20px;
     }
   }

   // 修改 dialog 内部元素的样式，需要添加样式穿透
   ::v-deep .detail-box {
     img {
       width: 500px;
     }
   }
</style>

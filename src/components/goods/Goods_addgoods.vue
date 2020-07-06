<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 面板 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab栏 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforLeave" @tab-click="TabClick">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name" placeholder="请输入商品名称"></el-input>
              </el-form-item>

              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" placeholder="请输入商品价格" type="number"></el-input>
              </el-form-item>

              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addForm.goods_weight" placeholder="请输入商品重量" type="number"></el-input>
              </el-form-item>

              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addForm.goods_number" placeholder="请输入商品数量" type="number"></el-input>
              </el-form-item>

              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader
                  v-model="addForm.goods_cat"
                  :options="goodsList"
                  expand-trigger="hover"
                  :props="cascaderProps"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="item in manyTbaData" :key="item.attr_id">
                <!-- 复选框 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox border :label="item1" v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTbaData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品图片" name="3">
                <!-- 上传图片控件 -->
                <el-upload
                class="upload-demo"
                :action="uploadImgUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="addForm.pics"
                list-type="picture"
                :headers="uploadHeaders"
                :on-success="uploadSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>

              <!-- 添加商品按钮 -->
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  data () {
    return {
      // 激活的下标
      activeIndex: '0',
      // 添加商品表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 所选择的商品分类
        goods_cat: [],
        // 上传的图片文件列表
        pics: [],
        // 商品介绍
        goods_introduce: '',
        // 商品的参数包含 `动态参数` 和 `静态属性`
        attrs: []
      },
      // 添加商品信息表单验证
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表数据
      goodsList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态商品参数列表
      manyTbaData: [],
      // 静态商品属性列表
      onlyTbaData: [],

      // 上传图片的接口地址
      uploadImgUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 配置图片上传的请求头携带token
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品分类列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败！')
      this.goodsList = res.data
      // console.log(this.goodsList)
    },

    // 级联选择器输入框发生改变
    handleChange () {
      console.log(this.addForm.goods_cat)
    },

    // Tab栏切换之前执行
    beforLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length <= 0) {
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // Tab栏点击事件
    async TabClick () {
      // 点击的是商品参数 则是动态参数 many
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.classId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error('获取动态商品参数失败！')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(' ') : []
        })
        this.manyTbaData = res.data

      // 点击的是商品属性
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.classId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error('获取静态商品属性失败！')
        this.onlyTbaData = res.data
        console.log(this.onlyTbaData)
      }
    },

    // 点击文件列表中已上传的文件时的钩子 图片预览
    handlePreview (file) {
      console.log(file)
    },
    // 图片文件列表移除文件时的钩子
    handleRemove (file) {
      // 获取要删除图片的临时路径
      const filePath = file.pic
      // 根据图片路径返回数组索引
      const index = this.addForm.pics.findIndex(item => {
        item.pic = filePath
      })
      // 根据索引删除对应的数组
      this.addForm.pics.splice(index, 1)
    },

    // 图片上传成功执行
    uploadSuccess (response) {
      const picInfo = { pic: response.data.tmp_path, url: response.data.url }
      this.addForm.pics.push(picInfo)
    },

    // 点击按钮添加商品信息到后台
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善表单信息！')

        // 执行添加的业务逻辑
        // 使用第三方插件lodash 的cloneDeep方法深拷贝this.addForm
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTbaData.forEach(item => {
          const paramsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          form.attrs.push(paramsInfo)
        })
        // 处理静态属性
        this.onlyTbaData.forEach(item => {
          const paramsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          form.attrs.push(paramsInfo)
        })
        // console.log(form)
        // 调用接口  执行添加
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品信息失败！')

        this.$message.success('添加商品信息成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 分类id
    classId () {
      return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
    }
  }
}
</script>

<style lang="less" scoped>
    .el-steps {
      margin: 20px 0;
    }
    .el-checkbox {
      margin: 0 10px 0 0 !important;
    }
    .btnAdd {
      margin-top: 20px;
    }
</style>

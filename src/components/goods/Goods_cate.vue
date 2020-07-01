<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 面板 -->
    <el-card>
      <div class="addBtn">
        <el-button type="primary" @click="isAddShow">添加分类</el-button>
      </div>

      <!-- 表格数据 -->
      <TreeTable
        :data="goodsList"
        :columns="columns"
        show-index
        index-text="#"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="likes" slot-scope="scope">
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"
            style="fontSize:18px;color:#67C23A"
          ></i>
          <i
            v-else
            class="el-icon-error"
            style="fontSize:18px;color:#F56C6C"
          ></i>
        </template>
        <!-- 分类级别 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="tpl">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </TreeTable>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addGoodsDialogVisible"
        width="35%"
        @close="addCateClose"
      >
        <el-form :model="addCateruleForm" :rules="addCateruleFormRules" ref="addCateruleFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateruleForm.cat_name"></el-input>
          </el-form-item>
          <!-- change-on-select 可以选择一级分类 -->
           <el-form-item label="父级分类：">
             <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                expand-trigger="hover"
                :props="cascaderProps"
                @change="parentCateChange"
                clearable
                change-on-select
                >
              </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品信息列表
      goodsList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总数据
      total: 0,
      // 表格各列的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'likes'
        },
        {
          label: '分类级别',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'tpl'
        }
      ],
      // 控制添加分类对话框显示与隐藏
      addGoodsDialogVisible: false,
      // 父级分类数据列表
      parentCateList: [],
      // 添加分类表单数据对象
      addCateruleForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加分类表单验证
      addCateruleFormRules: {
        cat_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级id数组
      selectedKeys: []
    }
  },
  created () {
    this.getGoodsCateList()
  },
  methods: {
    // 查询商品列表
    async getGoodsCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败！')
      }
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    // 监听页大小
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsCateList()
    },
    // 监听当前页
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getGoodsCateList()
    },
    // 显示添加分类
    isAddShow () {
      this.getParentCateList()
      this.addGoodsDialogVisible = true
    },
    // 查询分类数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取分类数据列表失败！')
      this.parentCateList = res.data
    },
    // 监听级联选择器 为表单对象赋值
    parentCateChange () {
      if (this.selectedKeys.length > 0) {
        // 设置添加分类表单数据
        this.addCateruleForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateruleForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateruleForm.cat_pid = 0
        this.addCateruleForm.cat_level = 0
      }
    },
    // 添加分类
    addCate () {
      this.$refs.addCateruleFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('categories', this.addCateruleForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败！')
        this.getGoodsCateList()
        this.$message.success('添加分类成功！')
        this.addGoodsDialogVisible = false
      }
      )
    },
    // 监听添加对话框 清空表单数据
    addCateClose () {
      this.$refs.addCateruleFormRef.resetFields()
      this.selectedKeys = []
      this.addCateruleForm.cat_level = 0
      this.addCateruleForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.addBtn {
  margin-bottom: 20px;
}
.el-cascader {
  width: 100%;
}
</style>

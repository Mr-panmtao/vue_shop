<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"> </el-alert>
      <el-form>
            <!-- change-on-select 可以选择一级分类 -->
           <el-form-item label="父级分类：">
             <el-cascader
                v-model="selectedKeys"
                :options="goodsList"
                expand-trigger="hover"
                :props="cascaderProps"
                @change="parentCateChange"
                clearable
                >
              </el-cascader>
          </el-form-item>
      </el-form>
      <!-- tab栏 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="isBtnChecked" size="mini" @click="addDialogVisible = true">添加属性</el-button>
            <!-- 表格数据 -->
            <el-table :data="onlyTaleData" border stripe>
               <!-- 展开行 -->
              <el-table-column type="expand" width="100px">
                  <template slot-scope="scope">
                      <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                      <!-- 输入文本框 -->
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <!-- 添加按钮 -->
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditInfo(scope.row)"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteInfo(scope.row)"></el-button>
                  </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" :disabled="isBtnChecked" size="mini" @click="addDialogVisible = true">添加参数</el-button>
             <!-- 表格数据 -->
            <el-table :data="onlyTaleData" border="">
              <!-- 展开行 -->
              <el-table-column type="expand" width="100px">
                  <template slot-scope="scope">
                      <el-tag closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                      <!-- 输入文本框 -->
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <!-- 添加按钮 -->
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditInfo(scope.row)"></el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteInfo(scope.row)"></el-button>
                  </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title=" '添加'+ addTitle "
      :visible.sync="addDialogVisible"
      width="35%"
      @close="addClose">
      <!-- 表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 编辑参数对话框 -->
    <el-dialog
      :title=" '编辑'+ addTitle "
      :visible.sync="editDialogVisible"
      width="35%"
      @close="editClose">
      <!-- 表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="addTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      goodsList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的数组
      selectedKeys: [],
      // tab栏默认选中的项
      activeName: 'only',
      // 动态参数数据
      onlyTaleData: [],

      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数表单验证
      addFormRules: {
        attr_name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      },

      // 控制编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑对话框的表单数据对象
      editForm: {},
      // 编辑参数表单验证
      editFormRules: {
        attr_name: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ]
      }

    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品分类数据列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取参数列表数据失败！')
      this.goodsList = res.data
    },
    // 监听级联选择器的选中状态
    parentCateChange () {
      this.getClassList()
    },
    // tab点击触发的事件
    handleTabClick () {
      this.getClassList()
    },
    // 查询参数列表
    async getClassList () {
      const { data: res } = await this.$http.get(`categories/${this.ClassId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) this.getGoodsList()

      // 为渲染Tag标签准备数据
      if (this.selectedKeys.length > 0) {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制Tag标签文本框显示与隐藏
          item.inputVisible = false
          // Tag标签文本框输入的值
          item.inputValue = ''
        })
      }
      console.log(res.data)
      this.onlyTaleData = res.data
    },
    // 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.ClassId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')
        this.$message.success('添加参数成功！')
        this.getClassList()
        this.addDialogVisible = false
      })
    },
    // 监听添加参数对话框 清空表单
    addClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听添加参数对话框 清空表单
    editClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击编辑按钮显示对话框
    showEditInfo (paramsInfo) {
      this.editForm = paramsInfo
      this.editDialogVisible = true
    },
    // 点击确认按钮修改参数
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.ClassId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
        if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
        this.$message.success('更新参数成功！')
        this.getClassList()
        this.editDialogVisible = false
      })
    },
    // 点击按钮删除参数数据
    deleteInfo (paramsInfo) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.ClassId}/attributes/${paramsInfo.attr_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getClassList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 回车或失去焦点执行添加属性
    handleInputConfirm (item) {
      // 如果输入的全是空格则清空
      if (item.inputValue.trim().length === 0) {
        item.inputValue = ''
        item.inputVisible = false
        return
      }
      // 执行添加属性
      item.attr_vals.push(item.inputValue)
      item.inputValue = ''
      item.inputVisible = false
      // 添加到后台
      this.saveAdd(item)
    },
    // 点击显示输入框
    showInput (item) {
      item.inputVisible = true
      // 获取焦点  $nextTick这个函数的作用是页面元素加载完成后执行
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 封装添加到后台的函数
    saveAdd (item) {
      this.$http.put(`categories/${this.ClassId}/attributes/${item.attr_id}`, {
        attr_name: item.attr_name,
        attr_sel: item.attr_sel,
        attr_vals: item.attr_vals.join(' ')
      })
    },
    // 删除Tag标签
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      // 添加到后台
      this.saveAdd(row)
    }
  },
  // 计算属性
  computed: {
    // 控制按钮是否是禁用状态
    isBtnChecked () {
      if (this.selectedKeys.length !== 0) {
        return false
      }
      return true
    },
    // 分类id
    ClassId () {
      return this.selectedKeys[this.selectedKeys.length - 1]
    },
    // 添加参数对话框的标题
    addTitle () {
      return this.activeName === 'only' ? '静态属性' : '动态参数'
    }
  }
}
</script>

<style lang="less" scoped>
    .el-form {
        margin: 20px 0;
    }

    .el-tag {
      margin: 15px;
    }

    .input-new-tag {
      width: 130px;
    }
</style>

<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <div>
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUserInfo=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表数据 -->
      <el-table :data="userList" style="width: 100%" border stripe :v-loading="loading">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <el-table-column prop label="操作">
          <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfo(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserInfo(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="showRight(scope.row)"></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加用户信息 -->
      <el-dialog title="添加用户" :visible.sync="addUserInfo" width="35%" @close="addUserClose" >
        <!-- 表单内容 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addRuleForm" label-width="70px" >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserInfo = false">取 消</el-button>
          <el-button type="primary" @click="addUserList">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="EditDialogVisible"
        width="35%"
        @close="editUser"
        >
        <!-- 修改用户信息表单 -->
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <span slot="footer">
          <el-button @click="EditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserList(editForm.id)">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="RightsdialogVisible"
        width="35%">
        <p>当前的用户：{{rightsInfo.username}}</p>
        <p>当前的角色：{{rightsInfo.role_name}}</p>
        <span>分配角色：</span>
        <el-select clearable v-model="selectRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer">
          <el-button @click="RightsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱格式
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号格式
    const checkmobile = (rule, value, callback) => {
      const checkMobile = /^1[34578]\d{9}$/
      if (checkMobile.test(value)) return callback()
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 携带参数数据
      queryInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 页大小
        pagesize: 2
      },
      // 用户数据
      userList: [],
      loading: true,
      // 总数量
      total: 0,
      // 控制添加用户信息显示与隐藏
      addUserInfo: false,
      // 添加表单的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户信息表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 7, message: '长度在 4 到 7 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户信息对话框显示与隐藏
      EditDialogVisible: false,
      // 修改用户的表单数据对象
      editForm: {},
      // 修改用户信息表单验证
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框显示与隐藏
      RightsdialogVisible: false,
      // 分配角色数据
      rightsInfo: {},
      // 所有角色列表数据
      roleList: [],
      // 已选中的角色id值
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户信息列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.userList = res.data.users
      this.total = res.data.total
    },

    // 每条页数数据发生改变
    handleSizeChange (newPage) {
      this.queryInfo.pagesize = newPage
      this.getUserList()
    },

    // 当前页数据发生改变
    handleCurrentChange (newPageSize) {
      this.queryInfo.pagenum = newPageSize
      this.getUserList()
    },

    // 监听状态信息 修改状态
    async updateState (newInfo) {
      const { data: res } = await this.$http.put(`users/${newInfo.id}/state/${newInfo.mg_state}`)
      if (res.meta.status !== 200) return this.$message.error('修改用户状态失败！')
      this.$message.success('修改用户状态成功！')
    },

    // 添加用信息
    addUserList () {
      this.$refs.addRuleForm.validate(async is => {
        if (!is) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        this.getUserList()
        this.addUserInfo = false
      })
    },

    // 监听添加用户对话框
    addUserClose () {
      // 清空表单
      this.$refs.addRuleForm.resetFields()
    },

    // 修改用户信息弹出对话框
    async editUserInfo (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
      this.EditDialogVisible = true
    },

    // 监听修改用户对话框
    editUser () {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },

    // 执行修改操作
    editUserList (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + id, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('更新用户信息失败！')
        this.$message.success('更新用户信息成功！')
        this.EditDialogVisible = false
        this.getUserList()
      })
    },

    // 删除用户信息
    delUserInfo (id) {
      const that = this
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        that.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 分配角色对话框显示
    async showRight (rightsInfo) {
      this.rightsInfo = rightsInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.roleList = res.data
      this.RightsdialogVisible = true
    },

    // 分配角色
    async updateRoleInfo () {
      if (!this.selectRoleId) {
        return this.$message.error('请选择角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.rightsInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.RightsdialogVisible = false
    }

  }
}
</script>

<style lang="less" scoped>
</style>

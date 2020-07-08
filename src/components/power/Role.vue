<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片面板 -->
    <el-card>
      <el-button type="primary" @click="showAddDialogVisible">添加角色</el-button>

      <!-- 表格数据 -->
      <el-table :data="RightsList" border stripe row-key="id">
        <el-table-column label="修改" type="expand" width="100px" >
            <template slot-scope="scope">
                 <el-row class="align-center" :class="['bor-bottom', in1 === 0 ? 'bor-top':'']" v-for="(item1,in1) in scope.row.children" :key="item1.id" >
                    <!-- 一级权限 -->
                   <el-col :span="6">
                       <el-tag closable @close="removeTag(scope.row,item1.id)">
                           {{item1.authName}}
                       </el-tag>
                       <i class="el-icon-caret-right"></i>
                   </el-col>
                   <!-- 二级权限 -->
                   <el-col :span="18">
                       <el-row class="align-center" :class="[in2 !== 0 ? 'bor-top':'']" v-for="(item2,in2) in item1.children" :key="item2.id">
                         <el-col :span="6">
                             <el-tag closable type="success" @close="removeTag(scope.row,item2.id)">
                                 {{item2.authName}}
                             </el-tag>
                             <i class="el-icon-caret-right"></i>
                         </el-col>
                         <!-- 三级权限 -->
                         <el-col :span="18" class="align-center">
                                <el-tag @close="removeTag(scope.row,item3.id)" closable type="warning" v-for="item3 in item2.children" :key="item3.id">
                                    {{item3.authName}}
                                </el-tag>
                         </el-col>
                       </el-row>
                   </el-col>
                 </el-row>
            </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="60px"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"  @click="showEditInfo(scope.row)"></el-button>

                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteInfo(scope.row)"></el-button>

                <el-tooltip :enterable="false" class="item" effect="dark" content="分配权限" placement="top">
                     <el-button size="mini" type="warning" icon="el-icon-setting"
                     @click="isRightsShow(scope.row)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="rightsDialogVisible"
        width="35%"
        @close="claerArr">
        <!-- 树桩控件 -->
       <el-tree
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        ref="rightsKeys"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRights">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加角色对话框 -->
       <el-dialog
        title="添加角色"
        :visible.sync="addDialogVisible"
        width="35%"
        @close="clearAddFrom">
        <el-form :model="RoleruleForm" :rules="roleRules" ref="roleRuleFormRef" label-width="100px" >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="RoleruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="RoleruleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisibleInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="35%"
        @close="clearEditFrom">
        <el-form :model="editRoleruleForm" ref="editroleRuleFormRef" label-width="100px" >
          <el-form-item label="角色名称">
            <el-input v-model="editRoleruleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleruleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisibleInfo(editRoleruleForm.roleId)">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 权限列表数据
      RightsList: [],
      // 控制分配权限对话框显示与隐藏
      rightsDialogVisible: false,
      // 树状权限列表
      treeList: [],
      // 树桩控件数据
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的权限
      checkedRights: [],
      // 即将分配权限的用户信息
      rightsInfo: {},
      // 控制添加角色对话框显示与隐藏
      addDialogVisible: false,
      // 添加角色表单数据
      RoleruleForm: {},
      // 添加角色表单验证
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制编辑角色对话框显示与隐藏
      editDialogVisible: false,
      // 编辑角色表单数据
      editRoleruleForm: {}
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    // 获取角色列表
    async getRightsList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.RightsList = res.data
    },
    // 删除角色指定权限
    removeTag (role, RightsId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${RightsId}`)
        if (res.meta.status !== 200) return this.$message.error('取消权限失败！')
        role.children = res.data
        this.$message({
          type: 'success',
          message: '取消权限成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },

    // 分配权限
    isRightsShow (node) {
      this.rightsInfo = node
      this.getTreeList()
      this.fillerRights(node, this.checkedRights)
      this.rightsDialogVisible = true
    },
    // 获取树状权限列表
    async getTreeList () {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取用户权限失败！')
      this.treeList = res.data
    },
    // 递归函数 筛选已有权限默认打钩
    fillerRights (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.fillerRights(item, arr)
      })
    },
    // 监听分配权限对话框清空默认勾选项
    claerArr () {
      this.checkedRights = []
    },
    // 分配权限
    async addRights () {
      const keys = [...this.$refs.rightsKeys.getHalfCheckedKeys(), ...this.$refs.rightsKeys.getCheckedKeys()]
      const ids = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.rightsInfo.id}/rights`, { rids: ids })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRightsList()
      this.rightsDialogVisible = false
    },
    // 添加角色显示对话框
    showAddDialogVisible () {
      this.addDialogVisible = true
    },
    // 添加角色
    addDialogVisibleInfo () {
      this.$refs.roleRuleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.RoleruleForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.getRightsList()
        this.$message.success('添加角色成功！')
        this.addDialogVisible = false
      })
    },
    // 监听添加角色表单 清空内容
    clearAddFrom () {
      this.$refs.roleRuleFormRef.resetFields()
    },
    // 编辑角色信息显示对话框
    async showEditInfo (roleInfo) {
      const { data: res } = await this.$http.get('roles/' + roleInfo.id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editRoleruleForm = res.data
      this.editDialogVisible = true
    },
    // 编辑角色
    async editDialogVisibleInfo (id) {
      const { data: res } = await this.$http.put(`roles/${id}`, this.editRoleruleForm)
      if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败！')
      this.getRightsList()
      this.$message.success('编辑角色信息成功！')
      this.editDialogVisible = false
    },
    // 监听编辑角色信息对话框 清除表单数据
    clearEditFrom () {
      this.$refs.editroleRuleFormRef.resetFields()
    },
    // 删除角色信息
    deleteInfo (roleInfo) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + roleInfo.id)
        if (res.meta.status !== 200) return this.$message.error('删除失败！')
        this.getRightsList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
   .el-tag {
       margin: 15px 7px;
   }
   .bor-top {
       border-top: 1px solid #ccc;
   }

   .bor-bottom {
       border-bottom: 1px solid #ddd;
   }

   //纵向居中
   .align-center {
       display: flex;
       align-items: center;
   }

</style>

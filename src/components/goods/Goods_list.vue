<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 面板 -->
    <el-card>
      <!-- 头部搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="goodsInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGodds">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="700px"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_number"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="editGoodsList(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="delGoodsList(scope.row)"></el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
       </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询商品列表数据对象
      goodsInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示的数据条数
        pagesize: 5
      },
      // 商品列表数据
      goodsList: [],
      // 总记录数
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 查询商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取商品列表失败！') }
      // 商品列表赋值
      this.goodsList = res.data.goods
      // 总记录数
      this.total = res.data.total
    },
    // 页容量发生变化
    handleSizeChange (newPageSize) {
      this.goodsInfo.pagesize = newPageSize
      this.getGoodsList()
    },
    // 当前页发生变化
    handleCurrentChange (newpagenum) {
      this.goodsInfo.pagenum = newpagenum
      this.getGoodsList()
    },
    // 删除商品信息
    delGoodsList (row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('goods/' + row.goods_id)
        if (res.meta.status !== 200) return this.$http.error('删除商品失败！')
        this.getGoodsList()
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
    },
    editGoodsList () {
      return this.$message.error('该功能暂未实现！')
    },
    // 去往添加商品信息的页面
    goAddGodds () {
      this.$router.push('/goods/addgoods')
    }
  }
}
</script>

<style lang="less" scoped></style>

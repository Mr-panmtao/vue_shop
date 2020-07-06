<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <div style="width: 500px;">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
          <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
        </el-input>
      </div>

      <!-- 表格数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="序号" width="60px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="500px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
            <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.order_pay === '0'">未付款</el-tag>
                <el-tag type="success" v-else>已付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
            <template slot-scope="scope">
                {{scope.row.create_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <el-button type="primary" icon="el-icon-edit" @click="editOrderList"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="delOrderList"></el-button>
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
        :total="total">
       </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 订单信息列表
      orderList: [],
      // 查询订单列表信息对象
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 总记录数
      total: 0
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表信息
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取订单信息列表失败！') }
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.queryInfo.query)
    },

    // 页大小发生变化
    handleSizeChange (newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getOrderList()
    },
    // 当前页发生变化
    handleCurrentChange (newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getOrderList()
    },
    // 编辑
    editOrderList () {
      return this.$message.error('该功能暂未实现')
    },
    // 删除
    delOrderList () {
      return this.$message.error('该功能暂未实现')
    }
  }
}
</script>

<style lang="less" scoped></style>

<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="exitlogin">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isClick ? 64+'px' : 200+'px'">
          <el-menu background-color="#304156" text-color="#fff" active-text-color="#287FFF" unique-opened
          :collapse="isClick" :collapse-transition="false" router :default-active="isChcked" >
            <!-- 开关 -->
            <div class="swith-is" @click="isSwith"><i class="el-icon-s-fold"></i></div>
            <el-submenu :index="item.id + ''" v-for="item in sidebar" :key="item.id">
                <template slot="title">
                    <i :class="iconfontobj[item.id]"></i>
                    <span>{{item.authName}}</span>
                </template>
                <el-menu-item :index="'/'+itemchildren.path" v-for="itemchildren in item.children" :key="itemchildren.id"
                @click="isChecked('/'+itemchildren.path)">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span>{{itemchildren.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 侧边栏数据
      sidebar: [],
      iconfontobj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-loading',
        101: 'el-icon-s-goods',
        102: 'el-icon-edit-outline',
        145: 'el-icon-s-platform'
      },
      // 检测是否点击
      isClick: false,
      // 决定哪个侧边栏项成为选中
      isChcked: ''
    }
  },
  created () {
    this.getsidebar()
    this.isChcked = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出
    exitlogin () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边栏数据
    async getsidebar () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.sidebar = res.data
    },
    // 开关
    isSwith () {
      this.isClick = !this.isClick
    },
    // 控制侧边栏某一项高亮
    isChecked (activePath) {
      console.log(activePath)
      sessionStorage.setItem('activePath', activePath)
      this.isChcked = activePath
    }
  }
}
</script>

<style lang="less" scoped>
// container
.home-container {
    height: 100%;
}

// 头部
.el-header {
    background-color: #363c42;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
            font-size: 20px;
            color: #fff;
        }
    }
}

// 侧边栏
.el-aside {
    background-color: #304156;
    .el-menu {
        border-right: none;
        // 开关
        .swith-is {
            width: 100%;
            height: 35px;
            background-color: #495065;
            text-align: center;
            cursor: pointer;
            font-size: 25px;
            color: gainsboro;
        }
    }
}

// 主体内容
.el-main {
    background-color: #FFFFFF;
}
</style>

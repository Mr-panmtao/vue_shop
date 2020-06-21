<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 头像 -->
      <div class="login-log">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单 -->
      <el-form ref="loginref" :model="loginform" :rules="loginrules" label-width="0px" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginform.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input type="password" v-model="loginform.password" placeholder="请输入密码" prefix-icon="el-icon-unlock"></el-input>
        </el-form-item>

        <el-form-item class="login-btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据绑定
      loginform: {
        username: '',
        password: ''
      },
      // 表单验证
      loginrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 15, message: '长度在 ６ 到 15 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 重置表单
    resetLogin: function () {
      this.$refs.loginref.resetFields()
    },
    // 登录
    login () {
      this.$refs.loginref.validate(async is => {
        // console.log(is)
        // validate 参数是回调函数 返回布尔值 验证表单
        if (!is) return
        const { data: res } = await this.$http.post('login', this.loginform)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  height: 100%;
  background-color: #2b4b6b;

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    border-radius: 5px;
    background-color: #fff;

    // 图片
    .login-log {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      padding: 10px;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      border: 1px solid #eee;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    // 表单
    .login-form {
      position: absolute;
      bottom: 10px;
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
      .login-btn {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>

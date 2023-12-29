<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { employeeLoginService } from '@/api/employee'
import { useEmployeeStore } from '@/stores'
import router from '@/router'

//绑定表单组件
const form = ref(null)

//员工登录表单数据
const formModel = ref({
  username: '',
  password: ''
})

//获取employeeStore
const employeeStore = useEmployeeStore()

//自定义表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      require: true,
      min: 5,
      max: 10,
      message: '用户名长度在 5 到 10 个字符',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,10}$/,
      message: '密码长度在 6 到 10 个字符',
      trigger: 'blur'
    }
  ]
  // repassword: [
  //   { required: true, message: '请输入密码', trigger: 'blur' },
  //   {
  //     pattern: /^\S{6,10}$/,
  //     message: '密码长度在 6 到 10 个字符',
  //     trigger: 'blur'
  //   },
  //   {
  //     validator: (rule, value, callback) => {
  //       //判断两次密码是否一致
  //       if (value !== formModel.value.password) {
  //         callback(new Error('两次输入的密码不一致'))
  //       } else {
  //         callback() // 就算成功也需要callback
  //       }
  //     }
  //   }
  // ]
}

//员工登录
const login = async () => {
  // 登录之前，先进行校验，校验成功->请求，失败->自动提示
  await form.value.validate()
  //请求登录接口
  const res = await employeeLoginService(formModel.value)
  //请求成功 -> 本地保存token
  employeeStore.setToken(res.data.data.token)
  ElMessage.success('登录成功')
  //跳转到主页
  router.push('/')
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="6" :offset="9" class="form">
      <!-- 登录表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
      >
        <el-form-item>
          <h1 style="margin: auto">超市管理系统登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

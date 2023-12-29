<script setup>
import { ref } from 'vue'
import { employeeUpdatePasswordService } from '@/api/employee'
import router from '@/router'
import { useEmployeeStore } from '@/stores'

//获取employeeStore
const employeeStore = useEmployeeStore()

//数据绑定
const passwordData = ref({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})

//绑定表单组件
const form = ref(null)

//自定义表单校验规则
const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^\S{6,10}$/,
      message: '密码长度在 6 到 10 个字符',
      trigger: 'blur'
    }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,10}$/,
      message: '密码长度在 6 到 10 个字符',
      trigger: 'blur'
    }
  ],
  rePassword: [
    { required: true, message: '确认密码', trigger: 'blur' },
    {
      pattern: /^\S{6,10}$/,
      message: '密码长度在 6 到 10 个字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        //判断两次密码是否一致
        if (value !== passwordData.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() // 就算成功也需要callback
        }
      }
    }
  ]
}

const onSubmit = async () => {
  await form.value.validate()
  //发送请求
  await employeeUpdatePasswordService(passwordData.value)
  ElMessage.success('修改成功! 请重新登录.')
  // 清除 token 和 employee信息
  employeeStore.removeToken()
  employeeStore.setEmployee({})
  //退出到登录页
  router.push('/login')
}
</script>

<template>
  <page-container title="修改密码">
    <template #extra>
      <el-button @click="onSubmit" type="primary">提交修改</el-button>
    </template>
    <br />
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form
          :model="passwordData"
          :rules="rules"
          ref="form"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="passwordData.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordData.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="rePassword">
            <el-input v-model="passwordData.rePassword"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped></style>

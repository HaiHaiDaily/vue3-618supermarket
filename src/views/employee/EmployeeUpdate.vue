<script setup>
import { useEmployeeStore } from '@/stores'
import { ref } from 'vue'
import { employeeUpdateInfoService } from '@/api/employee'
import { userUploadAvatarService } from '@/api/nofity'

const {
  employee: { id, username, name, sex, phone, idNumber, image },
  getEmployee
} = useEmployeeStore()

//绑定表单数据
const employeeInfo = ref({ id, username, name, sex, phone, idNumber, image })

//绑定表单
const formRef = ref()

//图片上传数据
const imageFile = ref(image)

//校验规则
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
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  sex: [
    { required: true, message: '请输入性别', trigger: 'blur' },
    {
      require: true,
      min: 1,
      max: 1,
      message: '男或者女',
      trigger: 'blur'
    }
  ],
  idNumber: [
    { required: true, message: '请输入身份证', trigger: 'blur' },
    {
      require: true,
      min: 18,
      max: 18,
      message: '请输入正确18位身份证',
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      require: true,
      min: 11,
      max: 11,
      message: '请输入正确11位手机号',
      trigger: 'blur'
    }
  ]
}

//提交逻辑
const onSubmit = async () => {
  // 等待校验
  const valid = await formRef.value.validate()
  if (valid) {
    // 表单提交修改
    await employeeUpdateInfoService(employeeInfo.value)
    // 通知用户端进行修改
    await getEmployee()
    // 消息提醒
    ElMessage.success('修改成功')
  }
}

//base64加载并回显图片
const onUploadFile = (file) => {
  imageFile.value = file.raw
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    //回显图片
    employeeInfo.value.image = reader.result
  }
}

//上传头像
const onUpdateAvatar = async () => {
  //封装formdate
  const formData = new FormData()
  formData.append('file', imageFile.value)
  //发送上传图片请求
  const rew = await userUploadAvatarService(formData)
  employeeInfo.value.image = rew.data.data
  // ElMessage.success('图片上传成功')
  //调用修改信息
  onSubmit()
}
</script>

<template>
  <page-container title="修改资料">
    <template #extra>
      <el-button @click="onUpdateAvatar" type="success"> 上传头像 </el-button>
      <el-button @click="onSubmit" type="primary">提交修改</el-button>
    </template>
    <br />
    <el-row>
      <el-col :span="8" :offset="2">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img
            v-if="employeeInfo.image"
            :src="employeeInfo.image"
            class="avatar"
          />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
      </el-col>

      <el-col :span="12">
        <el-form
          :model="employeeInfo"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="登录名称" prop="username">
            <el-input v-model="employeeInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model="employeeInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="employeeInfo.sex"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="employeeInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="idNumber">
            <el-input v-model="employeeInfo.idNumber"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>

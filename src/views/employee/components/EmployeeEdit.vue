<script setup>
import { ref } from 'vue'
import {
  employeeInsertService,
  employeeUpdateInfoService,
  employeeGetByIdService
} from '@/api/employee'
import { userUploadAvatarService } from '@/api/nofity'

//控制抽屉弹出
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  id: '',
  username: '',
  name: '',
  sex: '',
  phone: '',
  idNumber: '',
  image: ''
}

//表单数据绑定
const formModel = ref({ ...defaultForm.value })

//图片上传数据
const imageFile = ref('')

//子传父
const emit = defineEmits(['success'])

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

//打开抽屉
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 回显功能
    console.log('修改回显')
    //根据id获取指定员工数据
    const res = await employeeGetByIdService(row.id)
    formModel.value = res.data.data
  } else {
    // 添加功能
    console.log('添加功能')
    // 表单数据都重置
    formModel.value = { ...defaultForm }
  }
}

//base64加载并回显图片
const onUploadFile = (file) => {
  imageFile.value = file.raw
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    //回显图片
    formModel.value.image = reader.result
  }
}

// 提交逻辑
const onSubmit = async () => {
  console.log(imageFile.value)
  //如果有图片数据则先上传图片
  if (imageFile.value != '') {
    //封装formdate 上传图片
    const formData = new FormData()
    formData.append('file', imageFile.value)
    //发送上传图片请求
    const rew = await userUploadAvatarService(formData)
    formModel.value.image = rew.data.data
    //重置图片数据
    imageFile.value = ''
  }
  if (formModel.value.id) {
    //有id 则表示是修改操作
    await employeeUpdateInfoService(formModel.value)
    ElMessage.success('修改成功')
    // 成功后关闭抽屉
    visibleDrawer.value = false
    // 返回父组件 重新渲染
    emit('success', 'edit')
  } else {
    // 添加操作
    await employeeInsertService(formModel.value)
    ElMessage.success('添加成功')
    // 成功后关闭抽屉
    visibleDrawer.value = false
    // 返回父组件 重新渲染
    emit('success', 'add')
  }
}

//向外暴露open方法
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '修改员工信息' : '新增员工'"
    direction="rtl"
    size="40%"
  >
    <!-- 表单 -->
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="formModel.username"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="name">
        <el-input v-model="formModel.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-input v-model="formModel.sex"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formModel.phone"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idNumber">
        <el-input v-model="formModel.idNumber"></el-input>
      </el-form-item>
      <el-form-item prop="image">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="formModel.image" :src="formModel.image" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="178" />
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button @click="onSubmit()" type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>

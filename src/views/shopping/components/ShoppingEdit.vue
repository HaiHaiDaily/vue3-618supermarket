<script setup>
import { ref } from 'vue'
import ChannelSelect from '@/views/shopping/components/ChannelSelect.vue'
import {
  shoppingInsertService,
  shoppingGetByIdService,
  shoppingUpdateService
} from '@/api/shopping'
import { userUploadAvatarService } from '@/api/nofity'

//控制抽屉弹出
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  id: '',
  name: '',
  image: '',
  categoryId: '',
  price: '',
  number: '',
  decription: ''
}

//表单数据绑定
const formModel = ref({ ...defaultForm.value })

//图片上传数据
const imageFile = ref('')

//子传父
const emit = defineEmits(['success'])

//校验规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      require: true,
      min: 1,
      max: 10,
      message: '长度在 1 到 10 个字符',
      trigger: 'blur'
    }
  ],
  description: [
    { required: true, message: '请输入详细描述', trigger: 'blur' },
    {
      require: true,
      max: 15,
      message: '长度 最长 15 个字符',
      trigger: 'blur'
    }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    {
      require: true,
      min: 1,
      max: 10,
      message: '长度在 1 到 10 个字符',
      trigger: 'blur'
    }
  ],
  number: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    {
      require: true,
      min: 1,
      max: 10,
      message: '长度在 1 到 10 个字符',
      trigger: 'blur'
    }
  ]
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

//打开抽屉
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 回显功能
    console.log('修改回显')
    //根据id获取指定员工数据
    const res = await shoppingGetByIdService(row.id)
    formModel.value = res.data.data
  } else {
    // 添加功能
    console.log('添加功能')
    // 表单数据都重置
    formModel.value = { ...defaultForm }
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
    await shoppingUpdateService(formModel.value)
    ElMessage.success('修改成功')
    // 成功后关闭抽屉
    visibleDrawer.value = false
    // 返回父组件 重新渲染
    emit('success', 'edit')
  } else {
    // 添加操作
    await shoppingInsertService(formModel.value)
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
    :title="formModel.id ? '修改商品' : '新增商品'"
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
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="formModel.name"></el-input>
      </el-form-item>
      <el-form-item label="商品分类:">
        <ChannelSelect
          v-model="formModel.categoryId"
          width="100%"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="formModel.price"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="number">
        <el-input v-model="formModel.number"></el-input>
      </el-form-item>
      <el-form-item label="详细描述" prop="description">
        <el-input v-model="formModel.description"></el-input>
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

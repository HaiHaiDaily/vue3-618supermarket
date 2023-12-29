<script setup>
import { useEmployeeStore } from '@/stores'

//获取employeeStore
const employeeStore = useEmployeeStore()
</script>

<template>
  <page-container title="基本资料">
    <br />
    <el-row>
      <el-col :span="8" :offset="2">
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          disabled
        >
          <img
            v-if="employeeStore.employee.image"
            :src="employeeStore.employee.image"
            class="avatar"
          />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
      </el-col>

      <el-col :span="12">
        <el-form ref="formRef" label-width="100px" size="large">
          <el-form-item label="登录名称" prop="username">
            <el-input
              v-model="employeeStore.employee.username"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model="employeeStore.employee.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-input v-model="employeeStore.employee.sex" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="employeeStore.employee.phone"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="idNumber">
            <el-input
              v-model="employeeStore.employee.idNumber"
              disabled
            ></el-input>
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

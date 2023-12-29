<script setup>
import {
  employeeGetListService,
  employeeDelService,
  employeeUpdateInfoService
} from '@/api/employee'
import EmployeeEdit from '@/views/employee/components/EmployeeEdit.vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useEmployeeStore } from '@/stores'

//获取employeeStore
const employeeStore = useEmployeeStore()

// 数据
const employeeList = ref([])
const total = ref(0)

// 双向绑定数据
const params = ref({
  page: 1, // 第几页
  pageSize: 5, // 每页几条数据
  username: '',
  name: '',
  sex: ''
})

// loding
const loading = ref(false)

// 绑定抽屉
const employeeEditRef = ref()

// 获取数据 并保存在本地
const getArtcleList = async () => {
  loading.value = true
  const res = await employeeGetListService(params.value)
  console.log(res.data.data)
  employeeList.value = res.data.data.records
  console.log(employeeList.value)
  total.value = res.data.data.total
  loading.value = false
}
getArtcleList()

// 每页几条数据发生变化
const onSizeChange = (size) => {
  // 每页条数变化 -->从第一页渲染即可
  params.value.page = 1
  params.value.pageSize = size
  getArtcleList()
}

// 第几页发生变化
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.page = page
  // 基于当前页渲染
  getArtcleList()
}

// 搜索逻辑
const onSearch = () => {
  // 从第一页开始渲染
  params.value.page = 1
  // 根据最新的条件发请求渲染
  getArtcleList()
}

// 重置逻辑
const onReset = () => {
  // 重置搜索条件
  params.value.page = 1
  params.value.username = ''
  params.value.name = ''
  params.value.sex = ''
  // 重新发请求
  getArtcleList()
}

// 编辑新增逻辑
const onAddEmployee = () => {
  employeeEditRef.value.open({})
}
// 修改逻辑 管理员权限
const onEditEmployee = (row) => {
  //查看当前员工权限
  if (employeeStore.employee.type === 2) {
    ElMessage({ type: 'error', message: '权限不够' })
    return
  }
  employeeEditRef.value.open(row)
}

// 删除逻辑 管理员权限
const onDeleteEmployee = async (row) => {
  //查看当前员工权限
  if (employeeStore.employee.type === 2) {
    ElMessage({ type: 'error', message: '权限不够' })
    return
  }
  // 消息弹框
  await ElMessageBox.confirm('您确定删除该员工信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  //删除请求
  await employeeDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  // 重新渲染
  getArtcleList()
}

//修改状态,管理员权限
const updateStatus = async (row) => {
  //查看当前员工权限
  if (employeeStore.employee.type === 2) {
    ElMessage({ type: 'error', message: '权限不够' })
    return
  }
  if (row.status === 1) {
    //修改row.status的状态
    row.status = 0
  } else {
    row.status = 1
  }
  //发送修改请求
  await employeeUpdateInfoService(row)
  ElMessage({ type: 'success', message: '修改成功' })
  // 重新渲染
  getArtcleList()
}

// 子传父 添加|修改 成功逻辑
const onSuccess = (type) => {
  if (type === 'add') {
    //添加 -->desc排序 在最前添加--> 跳转第一页并渲染
    // const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.page = 1
  }
  getArtcleList()
}
</script>

<template>
  <page-container title="员工管理">
    <template #extra>
      <el-button @click="onAddEmployee" type="primary"> 新增员工 </el-button>
    </template>
    <!-- 搜索表单区域 -->
    <el-form inline>
      <el-form-item label="用户名:" prop="username">
        <el-input
          v-model="params.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="姓名:" prop="name">
        <el-input v-model="params.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-input v-model="params.sex" placeholder="请输入性别"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="employeeList" style="width: 100%">
      <el-table-column label="姓名">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="头像">
        <template #default="{ row }">
          <el-avatar :src="row.image" />
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="手机号" prop="phone" width="140">
      </el-table-column>
      <el-table-column label="性别" prop="sex" width="80"></el-table-column>
      <el-table-column
        label="身份证"
        prop="idNumber"
        width="200"
      ></el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-link
            v-if="row.status === 1"
            type="primary"
            @click="updateStatus(row)"
            >启用</el-link
          >
          <el-link v-else type="danger" @click="updateStatus(row)"
            >禁用</el-link
          >
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template #default="{ row }">
          {{ row.type === 1 ? '管理员' : '员工' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button circle plain type="primary" @click="onEditEmployee(row)"
            >修改</el-button
          >
          <el-button circle plain type="danger" @click="onDeleteEmployee(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.page"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉弹窗 -->
    <EmployeeEdit ref="employeeEditRef" @success="onSuccess"></EmployeeEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
